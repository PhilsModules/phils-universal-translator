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
        game.settings.register(MODULE_ID, 'enableQuickSelection', {
            name: "Schnellübersetzer bei Textmarkierung & Popups",
            hint: "Zeigt bei Popups, Dialogen und markiertem Text im Spiel einen Button an, um die Übersetzung direkt im Translation Studio zu öffnen.",
            scope: 'client',
            config: true,
            type: Boolean,
            default: true
        });

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
        btn.innerHTML = `<i class="fa-solid fa-bullhorn" style="color: #ff5252; margin-right: 4px;"></i> Übersetzen`;
        btn.title = "📢 Ausgewählten Text im Universal Translation Studio übersetzen";
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
        if (!game.settings.get(MODULE_ID, 'enableQuickSelection')) return;

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
        const el = element || (sheet?.element instanceof HTMLElement ? sheet.element : sheet?.element?.[0]);
        let textContent = "";
        let title = "Schnellübersetzung";

        if (sheet?.document) {
            title = sheet.document.name || title;
            textContent = sheet.document.text?.content || sheet.document.system?.description?.value || sheet.document.system?.description || "";
        } else if (el) {
            title = el.querySelector('.window-title')?.textContent?.trim() || title;
            const contentEl = el.querySelector('.journal-page-content, .editor-content, .window-content, .content') || el;
            textContent = contentEl.innerHTML || contentEl.textContent || "";
        }

        if (!textContent) {
            ui.notifications.warn("Kein übersetzbarer Inhalt in diesem Fenster gefunden.");
            return;
        }

        // Import dynamically to prevent circular dependencies
        const { TranslationStudioApp } = await import('./TranslationStudioApp.js');

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
            name: "Textauswahl",
            documentName: "JournalEntry",
            pages: [
                {
                    id: "snippet-page",
                    name: "Markierter Text",
                    type: "text",
                    text: { content: `<p>${Handlebars.escapeExpression(selectionData.text)}</p>` }
                }
            ]
        };

        new TranslationStudioApp({ document: wrapper }).render(true);
    }
}
