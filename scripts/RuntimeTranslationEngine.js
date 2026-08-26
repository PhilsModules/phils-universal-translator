import { TranslationDatabase } from './TranslationDatabase.js';

const MODULE_ID = "phils-universal-translator";

/**
 * RuntimeTranslationEngine
 * 100% Non-destructive Runtime Translation Layer for Foundry VTT.
 * Leaves all underlying world and compendium documents as untouched English originals,
 * while dynamically rendering German translations from TranslationDatabase on-the-fly.
 */
export class RuntimeTranslationEngine {
    static isEnabled = true;
    static defaultLanguage = "de"; // 'de' or 'en'

    /**
     * Resolves a Document (JournalEntry, Item, Actor, etc.) from a context menu target element.
     * @param {HTMLElement|jQuery} target
     * @returns {Document|Promise<Document>|null}
     */
    static getDocumentFromContext(target) {
        if (!target) return null;
        const el = target instanceof HTMLElement ? target : (target[0] instanceof HTMLElement ? target[0] : null);

        let docId = null;
        let packId = null;
        let uuid = null;

        if (el) {
            const itemEl = el.closest('[data-document-id], [data-entry-id], [data-pack], [data-uuid], .directory-item, .journal, .compendium-pack') || el;
            docId = itemEl.dataset?.documentId || itemEl.dataset?.entryId || el.dataset?.documentId || el.dataset?.entryId;
            packId = itemEl.dataset?.pack || el.dataset?.pack || itemEl.closest('[data-pack]')?.dataset?.pack;
            uuid = itemEl.dataset?.uuid || el.dataset?.uuid;
        }

        if (!docId && typeof target.attr === 'function') {
            docId = target.attr('data-document-id') || target.attr('data-entry-id') || target.closest('[data-document-id]').attr('data-document-id') || target.closest('[data-entry-id]').attr('data-entry-id');
            packId = target.attr('data-pack') || target.closest('[data-pack]').attr('data-pack');
            uuid = target.attr('data-uuid') || target.closest('[data-uuid]').attr('data-uuid');
        }

        if (uuid) {
            try {
                if (typeof fromUuidSync === 'function') {
                    const doc = fromUuidSync(uuid);
                    if (doc) return doc;
                }
            } catch (e) { }
        }

        if (packId && docId) {
            const pack = game.packs?.get(packId);
            if (pack) {
                return pack.get(docId) || pack.getDocument(docId);
            }
        }

        if (docId) {
            const journal = game.journal?.get(docId);
            if (journal) return journal;

            const item = game.items?.get(docId);
            if (item) return item;

            const actor = game.actors?.get(docId);
            if (actor) return actor;

            for (const pack of (game.packs || [])) {
                if (pack.documentName === "JournalEntry" && pack.has(docId)) {
                    return pack.get(docId) || pack.getDocument(docId);
                }
            }
        }

        return null;
    }

    /**
     * Initializes all runtime translation hooks and listeners.
     */
    static initialize() {
        // 1. Header Buttons for Journal Sheets (ApplicationV1)
        Hooks.on('getJournalSheetHeaderButtons', (app, buttons) => {
            const doc = app.document || app.object;
            if (!doc) return;

            const currentLang = app._universalLang || this.defaultLanguage;
            buttons.unshift({
                class: 'universal-runtime-lang-toggle-btn',
                icon: 'fa-solid fa-language',
                label: currentLang === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English',
                title: 'Sprache umschalten (Deutsch / Englisches Original)',
                onclick: (ev) => {
                    ev.preventDefault();
                    this.toggleLanguage(app);
                }
            });
        });

        // 2. Header Buttons for Single Page Sheets (ApplicationV1)
        Hooks.on('getJournalEntryPageSheetHeaderButtons', (app, buttons) => {
            const doc = app.document || app.object;
            if (!doc) return;

            const currentLang = app._universalLang || this.defaultLanguage;
            buttons.unshift({
                class: 'universal-runtime-lang-toggle-btn',
                icon: 'fa-solid fa-language',
                label: currentLang === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English',
                title: 'Sprache umschalten (Deutsch / Englisches Original)',
                onclick: (ev) => {
                    ev.preventDefault();
                    this.toggleLanguage(app);
                }
            });
        });

        // 3. Render Hook for Journal Sheet DOM injection
        Hooks.on('renderJournalSheet', (app, html) => {
            this.applyRuntimeTranslationToSheet(app, html);
        });

        // 4. Render Hook for Page Sheet DOM injection
        Hooks.on('renderJournalEntryPageSheet', (app, html) => {
            this.applyRuntimeTranslationToSheet(app, html);
        });
    }

    /**
     * Toggles the displayed language of a Sheet between German and English without altering database data.
     * @param {Application} app
     */
    static toggleLanguage(app) {
        const current = app._universalLang || this.defaultLanguage;
        app._universalLang = current === 'de' ? 'en' : 'de';
        app.render(true);
    }

    /**
     * Injects translated texts into the rendered sheet DOM if German is selected.
     * @param {Application} app
     * @param {HTMLElement|jQuery} html
     */
    static applyRuntimeTranslationToSheet(app, html) {
        const doc = app.document || app.object;
        if (!doc) return;

        const lang = app._universalLang || this.defaultLanguage;
        if (lang === 'en') return; // Show original English!

        const el = html instanceof HTMLElement ? html : html?.[0];
        if (!el) return;

        // If doc is JournalEntry, process each page element
        if (doc.documentName === "JournalEntry") {
            for (const page of (doc.pages || [])) {
                const trans = TranslationDatabase.get(page);
                if (!trans) continue;

                const pageEl = el.querySelector(`[data-page-id="${page.id}"]`);
                if (pageEl) {
                    const titleEl = pageEl.querySelector('.journal-page-header, h1, h2');
                    if (titleEl && trans.name) titleEl.textContent = trans.name;

                    const contentEl = pageEl.querySelector('.journal-page-content, .editor-content');
                    if (contentEl && trans.text) contentEl.innerHTML = trans.text;
                }
            }
        } else if (doc.documentName === "JournalEntryPage") {
            const trans = TranslationDatabase.get(doc);
            if (trans) {
                const titleEl = el.querySelector('.journal-page-header, input[name="name"], h1, h2');
                if (titleEl && trans.name) {
                    if (titleEl.tagName === 'INPUT') titleEl.value = trans.name;
                    else titleEl.textContent = trans.name;
                }

                const contentEl = el.querySelector('.journal-page-content, .editor-content');
                if (contentEl && trans.text) contentEl.innerHTML = trans.text;
            }
        }
    }
}
