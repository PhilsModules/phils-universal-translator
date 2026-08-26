import { MODULE_ID } from './TranslationLogic.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class JournalSearchApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "universal-journal-search",
        tag: "form",
        window: {
            title: "Universal Journal Volltextsuche & Ersetzen",
            icon: "fas fa-magnifying-glass-location",
            resizable: true,
            contentClasses: ["universal-translator-window", "standard-form"]
        },
        position: {
            width: 860,
            height: 700
        },
        form: {
            handler: JournalSearchApp.myFormHandler,
            closeOnSubmit: false
        },
        actions: {
            executeSearch: JournalSearchApp.onExecuteSearch,
            clearSearch: JournalSearchApp.onClearSearch,
            replaceSingle: JournalSearchApp.onReplaceSingle,
            replaceAll: JournalSearchApp.onReplaceAll,
            openJournalPage: JournalSearchApp.onOpenJournalPage
        }
    };

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/journal-search.hbs`
        }
    };

    constructor(options = {}) {
        super(options);
        this.journalId = options.journalId || "all";
        this.searchQuery = options.searchQuery || "";
        this.replaceQuery = options.replaceQuery || "";
        this.caseSensitive = false;
        this.useRegex = false;
        this.searchResults = [];
        this.hasSearched = false;
    }

    static async myFormHandler(event, form, formData) {
        // Prevent default submission
    }

    async _prepareContext(options) {
        const journals = (game.journal || []).filter(j => !j.name.includes("(Backup)") && !j.flags?.[MODULE_ID]?.isBackup);

        const journalOptions = [
            { id: "all", name: "Alle Journale der Welt" },
            ...journals.map(j => ({ id: j.id, name: j.name }))
        ];

        return {
            journalId: this.journalId,
            journalOptions: journalOptions,
            searchQuery: this.searchQuery,
            replaceQuery: this.replaceQuery,
            caseSensitive: this.caseSensitive,
            useRegex: this.useRegex,
            searchResults: this.searchResults,
            hasSearched: this.hasSearched,
            totalMatches: this.searchResults.reduce((acc, r) => acc + r.matches.length, 0),
            matchedJournalsCount: this.searchResults.length
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        const searchInput = this.element.querySelector('#universal-search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this._performSearch();
                }
            });
        }
    }

    _performSearch() {
        const query = this.element.querySelector('#universal-search-input')?.value || this.searchQuery;
        const replace = this.element.querySelector('#universal-replace-input')?.value || this.replaceQuery;
        const journalSelect = this.element.querySelector('#universal-journal-select')?.value || this.journalId;
        const isCase = this.element.querySelector('#universal-case-sensitive')?.checked || false;
        const isRegex = this.element.querySelector('#universal-use-regex')?.checked || false;

        this.searchQuery = query;
        this.replaceQuery = replace;
        this.journalId = journalSelect;
        this.caseSensitive = isCase;
        this.useRegex = isRegex;

        if (!query.trim()) {
            this.searchResults = [];
            this.hasSearched = false;
            this.render(false);
            return;
        }

        let targetJournals = [];
        if (journalSelect === "all") {
            targetJournals = (game.journal || []).filter(j => !j.name.includes("(Backup)") && !j.flags?.[MODULE_ID]?.isBackup);
        } else {
            const j = game.journal?.get(journalSelect);
            if (j) targetJournals = [j];
        }

        let regex;
        try {
            const flags = isCase ? 'g' : 'gi';
            regex = isRegex ? new RegExp(query, flags) : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
        } catch (e) {
            ui.notifications.error(`Ungültiger regulärer Ausdruck: ${e.message}`);
            return;
        }

        const results = [];

        for (const journal of targetJournals) {
            const pageMatches = [];

            for (const page of (journal.pages || [])) {
                const text = page.text?.content || "";
                if (!text) continue;

                let match;
                const matchesOnPage = [];
                const pageRegex = new RegExp(regex);

                while ((match = pageRegex.exec(text)) !== null) {
                    const start = Math.max(0, match.index - 40);
                    const end = Math.min(text.length, match.index + match[0].length + 40);
                    const snippet = text.substring(start, end);

                    matchesOnPage.push({
                        matchedText: match[0],
                        index: match.index,
                        snippet: snippet
                    });
                }

                if (matchesOnPage.length > 0) {
                    pageMatches.push({
                        pageId: page.id,
                        pageName: page.name,
                        matches: matchesOnPage
                    });
                }
            }

            if (pageMatches.length > 0) {
                results.push({
                    journalId: journal.id,
                    journalName: journal.name,
                    pageMatches: pageMatches,
                    matches: pageMatches.flatMap(p => p.matches)
                });
            }
        }

        this.searchResults = results;
        this.hasSearched = true;
        this.render(false);
    }

    static onExecuteSearch(event, target) {
        this._performSearch();
    }

    static onClearSearch(event, target) {
        this.searchQuery = "";
        this.replaceQuery = "";
        this.searchResults = [];
        this.hasSearched = false;
        this.render(false);
    }

    static async onReplaceSingle(event, target) {
        const journalId = target.dataset.journalId;
        const pageId = target.dataset.pageId;
        const replaceText = this.replaceQuery || this.element.querySelector('#universal-replace-input')?.value || "";

        const journal = game.journal?.get(journalId);
        const page = journal?.pages?.get(pageId);
        if (!page) return;

        let flags = this.caseSensitive ? 'g' : 'gi';
        let regex = this.useRegex ? new RegExp(this.searchQuery, flags) : new RegExp(this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

        const currentText = page.text?.content || "";
        const newText = currentText.replace(regex, replaceText);

        await page.update({ "text.content": newText });
        ui.notifications.success(`Ersetzung auf Seite "${page.name}" angewendet!`);
        this._performSearch();
    }

    static async onReplaceAll(event, target) {
        const replaceText = this.replaceQuery || this.element.querySelector('#universal-replace-input')?.value || "";
        if (!this.searchQuery) return;

        let totalReplacements = 0;
        let flags = this.caseSensitive ? 'g' : 'gi';
        let regex = this.useRegex ? new RegExp(this.searchQuery, flags) : new RegExp(this.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

        for (const jResult of this.searchResults) {
            const journal = game.journal?.get(jResult.journalId);
            if (!journal) continue;

            const updates = [];
            for (const pMatch of jResult.pageMatches) {
                const page = journal.pages?.get(pMatch.pageId);
                if (!page) continue;

                const currentText = page.text?.content || "";
                const newText = currentText.replace(regex, replaceText);
                updates.push({
                    _id: page.id,
                    "text.content": newText
                });
                totalReplacements += pMatch.matches.length;
            }

            if (updates.length > 0) {
                await journal.updateEmbeddedDocuments("JournalEntryPage", updates);
            }
        }

        ui.notifications.success(`${totalReplacements} Ersetzungen erfolgreich in allen Journalen durchgeführt!`);
        this._performSearch();
    }

    static onOpenJournalPage(event, target) {
        const journalId = target.dataset.journalId;
        const pageId = target.dataset.pageId;
        const journal = game.journal?.get(journalId);
        if (journal) {
            journal.sheet.render(true, { pageId: pageId });
        }
    }
}
