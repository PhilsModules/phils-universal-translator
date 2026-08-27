import { UniversalGlossary } from './UniversalGlossary.js';
import { TermReplacer } from './TermReplacer.js';
import { TranslationDatabase } from './TranslationDatabase.js';
import { fixMojibake, cleanAllArtifacts, resolvePrompt } from './TranslationLogic.js';

const MODULE_ID = "phils-universal-translator";

const AI_URLS = {
    gemini: "https://gemini.google.com/app",
    chatgpt: "https://chatgpt.com/",
    claude: "https://claude.ai/new",
    copilot: "https://copilot.microsoft.com/",
    perplexity: "https://www.perplexity.ai/"
};

/**
 * QuickSelectionTranslator
 * Detects text selection anywhere in Foundry (Sheets, Popups, Journals, Chat, Dialogs)
 * and provides instant translation or opens the Translation Studio with the snippet pre-selected.
 */
export class QuickSelectionTranslator {
    static floatingButton = null;
    static activeSelectionData = null;

    /**
     * Initializes global selection listeners and DOM containers.
     */
    static initialize() {
        this._createFloatingWidget();

        document.addEventListener('mouseup', (e) => this._handleMouseUp(e));
        document.addEventListener('keyup', (e) => {
            if (e.key === "Shift" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
                this._handleMouseUp(e);
            }
        });
        document.addEventListener('mousedown', (e) => {
            if (this.floatingButton && !this.floatingButton.contains(e.target)) {
                this._hideFloatingWidget();
            }
        });
    }

    /**
     * Creates the floating action button DOM element.
     */
    static _createFloatingWidget() {
        if (this.floatingButton) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'universal-floating-translate-btn';
        btn.className = 'universal-floating-btn';
        btn.innerHTML = `<i class="fa-solid fa-bullhorn" style="color: #ff5252; margin-right: 4px;"></i> ${game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ModeTranslate") || "Translate"}`;
        btn.title = game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtnTitle") || "Translate text in Translation Studio";
        btn.style.display = 'none';
        btn.style.position = 'fixed';
        btn.style.zIndex = '99999';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.activeSelectionData) {
                this.translateSnippet(this.activeSelectionData);
            }
            this._hideFloatingWidget();
        });

        document.body.appendChild(btn);
        this.floatingButton = btn;
    }

    static _handleMouseUp(e) {
        let enabled = true;
        try {
            if (game.settings && game.settings.settings.has(`${MODULE_ID}.enableQuickSelection`)) {
                enabled = game.settings.get(MODULE_ID, 'enableQuickSelection');
            } else {
                enabled = true;
            }
        } catch (err) {
            enabled = false;
        }

        if (!enabled) return;

        // Delay slightly for selection to settle
        setTimeout(() => {
            const selection = window.getSelection();
            const text = selection ? selection.toString().trim() : "";

            if (!text || text.length < 5) {
                this._hideFloatingWidget();
                return;
            }

            // Don't trigger inside inputs or textareas unless desired
            const activeTag = document.activeElement?.tagName;
            if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
                this._hideFloatingWidget();
                return;
            }

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect && rect.width > 0 && rect.height > 0) {
                this.activeSelectionData = {
                    text: text,
                    range: range
                };

                if (this.floatingButton) {
                    this.floatingButton.style.top = `${Math.max(10, rect.top - 40)}px`;
                    this.floatingButton.style.left = `${Math.max(10, rect.left + rect.width / 2 - 50)}px`;
                    this.floatingButton.style.display = 'block';
                }
            }
        }, 50);
    }

    static _hideFloatingWidget() {
        if (this.floatingButton) {
            this.floatingButton.style.display = 'none';
        }
    }

    /**
     * Translates an active sheet, popup, or application on the fly.
     * @param {Application} sheet
     * @param {HTMLElement} [element]
     */
    static async translateActiveSheetOrWindow(sheet, element = null) {
        const { TranslationStudioApp } = await import('./TranslationStudioApp.js');

        // Extract document from sheet / app if available
        let doc = sheet?.document || sheet?.object || sheet?.activity?.item || null;

        // 1. If it's a JournalEntryPage, pass its parent Journal with this page pre-selected
        if (doc && doc.documentName === "JournalEntryPage") {
            if (doc.parent) {
                new TranslationStudioApp({ document: doc.parent, selectedIds: [doc.id] }).render(true);
                return;
            }
            new TranslationStudioApp({ document: doc }).render(true);
            return;
        }

        // 2. If it's a full Foundry Document (JournalEntry, Item, Actor, RollTable, etc.)
        if (doc && (doc.documentName || doc.pages || doc.system)) {
            new TranslationStudioApp({ document: doc }).render(true);
            return;
        }

        // 3. Fallback: Extract translatable content from DOM elements
        const el = element || (sheet?.element instanceof HTMLElement ? sheet.element : sheet?.element?.[0]);
        let title = game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Title") || "Universal Translator";
        let textContent = "";

        if (el) {
            title = el.querySelector('.window-title')?.textContent?.trim() || title;
            const contentEl = el.querySelector('.journal-page-content, .editor-content, .window-content, .content, .prose-mirror, .sheet-body, .description') || el;
            textContent = contentEl.innerHTML || contentEl.textContent || "";
        }

        if (!textContent || !textContent.trim()) {
            ui.notifications.warn(game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.NoTranslatableContent") || "No translatable content found in this window.");
            return;
        }

        const wrapper = {
            name: title,
            documentName: "JournalEntry",
            pages: [
                {
                    id: "snippet-page",
                    name: title,
                    type: "text",
                    text: { content: textContent }
                }
            ]
        };

        new TranslationStudioApp({ document: wrapper }).render(true);
    }

    /**
     * Opens Translation Studio with pre-selected snippet data.
     * @param {object} selectionData
     */
    static async translateSnippet(selectionData) {
        const { TranslationStudioApp } = await import('./TranslationStudioApp.js');

        const wrapper = {
            name: game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtn") || "Read-Aloud",
            documentName: "JournalEntry",
            pages: [
                {
                    id: "snippet-page",
                    name: game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtn") || "Read-Aloud",
                    type: "text",
                    text: { content: `<p>${Handlebars.escapeExpression(selectionData.text)}</p>` }
                }
            ]
        };

        new TranslationStudioApp({ document: wrapper }).render(true);
    }
}
