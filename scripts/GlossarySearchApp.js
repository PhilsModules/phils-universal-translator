import { MODULE_ID } from './TranslationLogic.js';
import { UniversalGlossary } from './UniversalGlossary.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class GlossarySearchApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "universal-glossary-search",
        tag: "form",
        window: {
            title: "Universal AI Glossar — Suche & Begriff-Manager",
            icon: "fas fa-book-bookmark",
            resizable: true,
            contentClasses: ["universal-translator-window", "standard-form"]
        },
        position: {
            width: 880,
            height: 720
        },
        form: {
            handler: GlossarySearchApp.myFormHandler,
            closeOnSubmit: false
        },
        actions: {
            clearSearch: GlossarySearchApp.onClearSearch,
            filterCategory: GlossarySearchApp.onFilterCategory,
            addTerm: GlossarySearchApp.onAddTerm,
            addTermQuick: GlossarySearchApp.onAddTermQuick,
            editTerm: GlossarySearchApp.onEditTerm,
            deleteTerm: GlossarySearchApp.onDeleteTerm,
            openGlossaryJournal: GlossarySearchApp.onOpenGlossaryJournal
        }
    };

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/glossary-search.hbs`
        }
    };

    constructor(options = {}) {
        super(options);
        this.searchQuery = options.searchQuery || "";
        this.selectedCategory = options.selectedCategory || "all";
        this.allTerms = [];
    }

    static async myFormHandler(event, form, formData) {
        // Prevent default submission
    }

    async _prepareContext(options) {
        await UniversalGlossary.ensureFoundryGlossaryJournal();
        this.allTerms = await UniversalGlossary.getAllGlossaryTermsDetailed();

        const query = (this.searchQuery || "").trim().toLowerCase();
        const activeCat = this.selectedCategory || "all";

        const catCounts = { all: this.allTerms.length };
        for (const t of this.allTerms) {
            const catKey = t.category || "Allgemein";
            catCounts[catKey] = (catCounts[catKey] || 0) + 1;
        }

        const knownCategories = [
            { id: "all", label: "Alle" },
            { id: "Orte", label: "Orte" },
            { id: "Charaktere & NSCs", label: "Charaktere" },
            { id: "Götter & Kulte", label: "Götter" },
            { id: "Organisationen & Fraktionen", label: "Organisationen" },
            { id: "Biome & Wildnis", label: "Biome" },
            { id: "Völker & Spezies", label: "Völker" },
            { id: "Kulturen", label: "Kulturen" },
            { id: "Klassen & Archetypen", label: "Klassen" },
            { id: "Ausrüstung & Zauber", label: "Ausrüstung" },
            { id: "Kosmologie & Welten", label: "Kosmologie" },
            { id: "Sprachen", label: "Sprachen" },
            { id: "Spielregeln & Mechaniken", label: "Spielregeln" }
        ];

        const categories = knownCategories.map(c => {
            let count = 0;
            if (c.id === "all") {
                count = this.allTerms.length;
            } else {
                for (const [catName, cnt] of Object.entries(catCounts)) {
                    if (catName.toLowerCase().includes(c.label.toLowerCase()) || catName.toLowerCase().includes(c.id.toLowerCase())) {
                        count += cnt;
                    }
                }
            }
            return {
                id: c.id,
                label: c.label,
                count: count,
                active: activeCat === c.id || (activeCat === "all" && c.id === "all")
            };
        });

        let filtered = this.allTerms;

        if (activeCat !== "all") {
            filtered = filtered.filter(t => {
                const cat = (t.category || "").toLowerCase();
                return cat.includes(activeCat.toLowerCase());
            });
        }

        if (query) {
            filtered = filtered.filter(t => 
                t.original.toLowerCase().includes(query) || 
                t.translation.toLowerCase().includes(query)
            );
        }

        return {
            searchQuery: this.searchQuery,
            selectedCategory: this.selectedCategory,
            categories: categories,
            terms: filtered,
            totalTerms: this.allTerms.length,
            resultCount: filtered.length
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        const searchInput = this.element.querySelector('#universal-glossary-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.render(false);
            });
        }
    }

    static onClearSearch(event, target) {
        this.searchQuery = "";
        this.render(false);
    }

    static onFilterCategory(event, target) {
        const catId = target.dataset.catId || "all";
        this.selectedCategory = catId;
        this.render(false);
    }

    static async onAddTerm(event, target) {
        const categories = [
            "Orte", "Charaktere & NSCs", "Götter & Kulte", "Organisationen & Fraktionen",
            "Biome & Wildnis", "Völker & Spezies", "Kulturen", "Klassen & Archetypen",
            "Ausrüstung & Zauber", "Kosmologie & Welten", "Sprachen", "Spielregeln & Mechaniken"
        ];

        const catOptions = categories.map(c => `<option value="${c}">${c}</option>`).join("");

        const content = `
            <div style="padding: 10px; font-family: var(--font-primary);">
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight: bold; margin-bottom: 4px;">Original (Englisch):</label>
                    <input type="text" id="add-term-orig" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px;" placeholder="z.B. Shadowdale" autofocus>
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight: bold; margin-bottom: 4px;">Übersetzung (Deutsch):</label>
                    <input type="text" id="add-term-trans" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px;" placeholder="z.B. Schattental">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight: bold; margin-bottom: 4px;">Kategorie:</label>
                    <select id="add-term-cat" style="width: 100%; padding: 6px; background: #222; border: 1px solid #555; color: #fff; border-radius: 4px;">
                        ${catOptions}
                    </select>
                </div>
            </div>
        `;

        new Dialog({
            title: "Neuen Begriff zum AI Glossar hinzufügen",
            content: content,
            buttons: {
                save: {
                    icon: '<i class="fas fa-plus"></i>',
                    label: "Hinzufügen",
                    callback: async (html) => {
                        const orig = html.find('#add-term-orig').val()?.trim();
                        const trans = html.find('#add-term-trans').val()?.trim();
                        const cat = html.find('#add-term-cat').val()?.trim();

                        if (orig && trans) {
                            await UniversalGlossary.addTerms([{ original: orig, translation: trans, category: cat }]);
                            ui.notifications.success(`Begriff "${orig}" -> "${trans}" zum Glossar hinzugefügt!`);
                            this.render(false);
                        } else {
                            ui.notifications.warn("Bitte sowohl Original als auch Übersetzung eingeben.");
                        }
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Abbrechen"
                }
            },
            default: "save"
        }).render(true);
    }

    static async onAddTermQuick(event, target) {
        return this.onAddTerm(event, target);
    }

    static async onEditTerm(event, target) {
        const pageId = target.dataset.pageId;
        const orig = target.dataset.orig;
        const trans = target.dataset.trans;

        const content = `
            <div style="padding: 10px; font-family: var(--font-primary);">
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight: bold; margin-bottom: 4px;">Original (Englisch):</label>
                    <input type="text" id="edit-term-orig" value="${Handlebars.escapeExpression(orig)}" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display:block; font-weight: bold; margin-bottom: 4px;">Übersetzung (Deutsch):</label>
                    <input type="text" id="edit-term-trans" value="${Handlebars.escapeExpression(trans)}" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px;">
                </div>
            </div>
        `;

        new Dialog({
            title: `Begriff bearbeiten: ${orig}`,
            content: content,
            buttons: {
                save: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Speichern",
                    callback: async (html) => {
                        const newOrig = html.find('#edit-term-orig').val()?.trim();
                        const newTrans = html.find('#edit-term-trans').val()?.trim();

                        if (newOrig && newTrans) {
                            await UniversalGlossary.updateGlossaryTerm(pageId, orig, newOrig, newTrans);
                            ui.notifications.success(`Begriff "${newOrig}" aktualisiert!`);
                            this.render(false);
                        }
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Abbrechen"
                }
            },
            default: "save"
        }).render(true);
    }

    static async onDeleteTerm(event, target) {
        const pageId = target.dataset.pageId;
        const orig = target.dataset.orig;

        Dialog.confirm({
            title: "Begriff löschen",
            content: `<p>Möchtest du den Begriff <strong>"${orig}"</strong> wirklich aus dem AI Glossar entfernen?</p>`,
            yes: async () => {
                await UniversalGlossary.deleteGlossaryTerm(pageId, orig);
                ui.notifications.info(`Begriff "${orig}" aus dem Glossar gelöscht.`);
                this.render(false);
            }
        });
    }

    static onOpenGlossaryJournal(event, target) {
        const journal = UniversalGlossary.getFoundryGlossaryJournal();
        if (journal) {
            journal.sheet.render(true);
        } else {
            ui.notifications.warn("Kein AI Glossar Journal in der Welt gefunden.");
        }
    }
}
