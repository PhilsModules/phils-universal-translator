import {
    loc,
    resolvePrompt,
    getCleanData,
    MODULE_ID,
    injectOfficialTranslations,
    injectGlossaryMarkers,
    applyResolvedUpdate,
    smartParseAiResponse,
    buildPreApplyDiff,
    calculateTranslationStats,
    restoreDocumentFromBackup,
    createChunkedBatches
} from './TranslationLogic.js';
import { UniversalGlossary } from './UniversalGlossary.js';
import { TermReplacer } from './TermReplacer.js';
import { TranslationStatsApp } from './TranslationStatsApp.js';
import { JournalSearchApp } from './JournalSearchApp.js';
import { TranslationMemory } from './TranslationMemory.js';
import { TranslationDatabase } from './TranslationDatabase.js';
import { RuntimeTranslationEngine } from './RuntimeTranslationEngine.js';
import { SmartLinkRemapper } from './SmartLinkRemapper.js';
import { CampaignAuditorApp } from './CampaignAuditorApp.js';
import { GlossarySearchApp } from './GlossarySearchApp.js';
import { SUPPORTED_LANGUAGES } from './main.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const AI_THEMES = {
    gemini: { label: "Google Gemini", url: "https://gemini.google.com/app" },
    chatgpt: { label: "ChatGPT", url: "https://chatgpt.com/" },
    claude: { label: "Anthropic Claude", url: "https://claude.ai/new" },
    copilot: { label: "Microsoft Copilot", url: "https://copilot.microsoft.com/" },
    perplexity: { label: "Perplexity AI", url: "https://www.perplexity.ai/" }
};

const SETTING_PRESETS = [
    { id: "fantasy", label: "Fantasy / High Fantasy" },
    { id: "grimdark", label: "Dark Fantasy / Grimdark" },
    { id: "scifi", label: "Sci-Fi / Space Opera" },
    { id: "cyberpunk", label: "Cyberpunk / Tech-Noir" },
    { id: "horror", label: "Horror / Lovecraftian" },
    { id: "modern", label: "Modern / Urban Mystery" },
    { id: "postapo", label: "Post-Apocalyptic / Wasteland" },
    { id: "custom", label: "Benutzerdefiniert / Eigene Kampagne" }
];

export function calculateDocCharCount(doc) {
    if (!doc) return 0;
    try {
        const clean = getCleanData(doc, true);
        return JSON.stringify(clean).length;
    } catch (e) {
        let fallbackCount = (doc.name || "").length;
        if (doc.text?.content) fallbackCount += doc.text.content.length;
        if (doc.system?.overview) fallbackCount += doc.system.overview.length;
        if (doc.system?.description) fallbackCount += (typeof doc.system.description === 'string' ? doc.system.description.length : (doc.system.description?.value?.length || 0));
        return fallbackCount;
    }
}

export class TranslationStudioApp extends HandlebarsApplicationMixin(ApplicationV2) {
    document = null;
    isCompendium = false;
    isFolder = false;
    selectedFolderId = "all";
    selectedDiffPageId = null;
    step = 1;
    mode = 'translate';
    selectedTargetLang = "de";
    selectedSourceLang = "auto";
    selectedSettingPreset = "fantasy";
    customSettingName = "";
    customTargetLangName = "";
    selectedIds = [];
    customInstruct = "";
    generatedPrompt = "";
    pastedText = "";
    parseError = null;
    previewData = null;
    parseResult = null;
    promptBatches = [];
    currentBatchIndex = 0;

    static DEFAULT_OPTIONS = {
        id: "universal-translation-studio",
        tag: "form",
        window: {
            title: "Phil's Universal AI Translation Studio",
            icon: "fas fa-language",
            resizable: true,
            contentClasses: ["universal-translator-window", "standard-form"]
        },
        position: {
            width: 1000,
            height: 870
        },
        form: {
            handler: TranslationStudioApp.myFormHandler,
            closeOnSubmit: false
        },
        actions: {
            openStats: function(event, target) { return this.onOpenStats(event, target); },
            openGlossarySearch: function(event, target) { return this.onOpenGlossarySearch(event, target); },
            openGlossaryJournal: function(event, target) { return this.onOpenGlossaryJournal(event, target); },
            openAuditor: function(event, target) { return this.onOpenAuditor(event, target); },
            openSearch: function(event, target) { return this.onOpenSearch(event, target); },
            sortGlossaryDialog: function(event, target) { return this.onSortGlossaryDialog(event, target); },
            exportMemory: function(event, target) { return this.onExportMemory(event, target); },
            importMemory: function(event, target) { return this.onImportMemory(event, target); },
            clearMemory: function(event, target) { return this.onClearMemory(event, target); },
            selectDiffPage: function(event, target) { return this.onSelectDiffPage(event, target); },
            smartSync: function(event, target) { return this.onSmartSync(event, target); },
            remapLinks: function(event, target) { return this.onRemapLinks(event, target); },
            restoreBackup: function(event, target) { return this.onRestoreBackup(event, target); },
            clearDocument: function(event, target) { return this.onClearDocument(event, target); },
            toggleSelect: function(event, target) { return this.onToggleSelect(event, target); },
            selectUnprocessed: function(event, target) { return this.onSelectUnprocessed(event, target); },
            selectNext: function(event, target) { return this.onSelectNext(event, target); },
            selectCompendium: function(event, target) { return this.onSelectCompendium(event, target); },
            filterFolder: function(event, target) { return this.onFilterFolder(event, target); },
            changeSettingPreset: function(event, target) { return this.onChangeSettingPreset(event, target); },
            changeTargetLanguage: function(event, target) { return this.onChangeTargetLanguage(event, target); },
            generatePrompt: function(event, target) { return this.onGeneratePrompt(event, target); },
            prevBatchPart: function(event, target) { return this.onPrevBatchPart(event, target); },
            nextBatchPart: function(event, target) { return this.onNextBatchPart(event, target); },
            jumpToStep: function(event, target) { return this.onJumpToStep(event, target); },
            backToStep1: function(event, target) { return this.onBackToStep1(event, target); },
            copyPromptAndOpenAi: function(event, target) { return this.onCopyPromptAndOpenAi(event, target); },
            goToStep3: function(event, target) { return this.onGoToStep3(event, target); },
            backToStep2: function(event, target) { return this.onBackToStep2(event, target); },
            analyzePaste: function(event, target) { return this.onAnalyzePaste(event, target); },
            backToStep3: function(event, target) { return this.onBackToStep3(event, target); },
            applyFinalUpdate: function(event, target) { return this.onApplyFinalUpdate(event, target); },
            applyAndContinue: function(event, target) { return this.onApplyAndContinue(event, target); }
        }
    };

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/translation-studio.hbs`
        }
    };

    constructor(options = {}) {
        super(options);
        this.document = options.document || null;
        this.isCompendium = options.isCompendium || false;
        this.isFolder = options.isFolder || false;
        this.selectedFolderId = "all";
        this.step = 1;
        this.mode = options.mode || 'translate';
        this.selectedTargetLang = game.settings.get(MODULE_ID, 'targetLanguage') || 'de';
        this.selectedSourceLang = game.settings.get(MODULE_ID, 'sourceLanguage') || 'auto';
        this.selectedSettingPreset = game.settings.get(MODULE_ID, 'settingPreset') || 'fantasy';
        this.selectedIds = [];
        this.customInstruct = "";
        this.generatedPrompt = "";
        this.pastedText = "";
        this.parseError = null;
        this.previewData = null;
        this.parseResult = null;
        this.promptBatches = [];
        this.currentBatchIndex = 0;
    }

    static async myFormHandler(event, form, formData) {
        // Prevent default submission
    }

    async _prepareContext(_options) {
        const doc = this.document;
        const hasDoc = !!doc;
        let docName = "";
        let isCompendiumPack = this.isCompendium;
        let isFolderDoc = this.isFolder;
        let compendiumPacks = [];
        let packFolders = [];

        if (game.packs) {
            compendiumPacks = Array.from(game.packs).map(p => ({
                id: p.metadata.id,
                label: `${p.metadata.label} (${p.metadata.type})`,
                type: p.metadata.type
            }));
        }

        let hasBackup = false;
        let pagesOrItems = [];
        const batchSize = game.settings.get(MODULE_ID, 'batchSize') || 10;
        const maxCharLimit = game.settings.get(MODULE_ID, 'maxPromptLength') || 12000;
        let selectedCount = 0;
        let currentBatchChars = 0;

        if (hasDoc) {
            if (doc.isFolderWrapper || doc.documentName === "Folder" || this.isFolder) {
                isFolderDoc = true;
                this.isFolder = true;
                const folder = (game.folders && doc.id) ? game.folders.get(doc.id) : doc;
                const folderType = folder?.type || (doc.contents?.[0]?.documentName) || (doc.documents?.[0]?.documentName) || "JournalEntry";

                let allDocs = Array.from(folder?.contents || doc.documents || doc.contents || []);
                if (folder?.getSubfolders) {
                    for (const sf of folder.getSubfolders(true)) {
                        allDocs.push(...Array.from(sf.contents || sf.documents || []));
                    }
                }
                allDocs = allDocs.filter(d => !d.name.includes("(Backup)") && d.name !== "AI Glossar" && d.name !== "AI Glossary");

                if (folderType === "JournalEntry") {
                    for (const j of allDocs) {
                        for (const p of (j.pages || [])) {
                            const charCount = calculateDocCharCount(p);
                            const flags = p.flags?.[MODULE_ID] || {};
                            const isProcessed = !!flags.aiProcessed;
                            const isGrammarChecked = !!flags.aiGrammarChecked;
                            const isCompleted = (this.mode === 'grammar') ? isGrammarChecked : isProcessed;

                            let isChecked = false;
                            if (this.selectedIds && this.selectedIds.length > 0) {
                                isChecked = this.selectedIds.includes(p.id);
                            } else if (!isCompleted && selectedCount < batchSize) {
                                isChecked = true;
                                selectedCount++;
                            }

                            pagesOrItems.push({
                                id: p.id,
                                journalId: j.id,
                                name: p.name,
                                type: p.type,
                                folderName: j.name,
                                charCount: charCount,
                                formattedChars: charCount > 1000 ? `${(charCount / 1000).toFixed(1)}k` : `${charCount}`,
                                isHuge: charCount > 15000,
                                checked: isChecked,
                                isProcessed,
                                isGrammarChecked
                            });
                        }
                    }
                    docName = `[Journal-Ordner] ${folder.name || doc.name} (${pagesOrItems.length} Seiten)`;
                } else {
                    pagesOrItems = allDocs.map(d => {
                        const charCount = calculateDocCharCount(d);
                        const flags = d.flags?.[MODULE_ID] || {};
                        const isProcessed = !!flags.aiProcessed;
                        let isChecked = false;
                        if (this.selectedIds && this.selectedIds.length > 0) {
                            isChecked = this.selectedIds.includes(d.id);
                        } else if (!isProcessed && selectedCount < batchSize) {
                            isChecked = true;
                            selectedCount++;
                        }
                        return {
                            id: d.id,
                            name: d.name,
                            type: d.type || d.documentName || "Item",
                            folderName: d.folder?.name || "",
                            charCount: charCount,
                            formattedChars: charCount > 1000 ? `${(charCount / 1000).toFixed(1)}k` : `${charCount}`,
                            isHuge: charCount > 15000,
                            checked: isChecked,
                            isProcessed,
                            isGrammarChecked: false
                        };
                    });
                    docName = `[Ordner] ${folder.name || doc.name} (${allDocs.length} Einträge)`;
                }
            } else if (doc.metadata || doc.isCompendiumCollection) {
                isCompendiumPack = true;
                this.isCompendium = true;
                docName = `[Kompendium] ${doc.metadata.label}`;
                const docs = await doc.getDocuments();
                pagesOrItems = docs.map(d => {
                    const charCount = calculateDocCharCount(d);
                    const flags = d.flags?.[MODULE_ID] || {};
                    const isProcessed = !!flags.aiProcessed;
                    let isChecked = false;
                    if (this.selectedIds && this.selectedIds.length > 0) {
                        isChecked = this.selectedIds.includes(d.id);
                    } else if (!isProcessed && selectedCount < batchSize) {
                        isChecked = true;
                        selectedCount++;
                    }
                    return {
                        id: d.id,
                        name: d.name,
                        type: d.type || d.documentName,
                        folderName: d.folder?.name || "",
                        charCount: charCount,
                        formattedChars: charCount > 1000 ? `${(charCount / 1000).toFixed(1)}k` : `${charCount}`,
                        isHuge: charCount > 15000,
                        checked: isChecked,
                        isProcessed,
                        isGrammarChecked: false
                    };
                });
            } else if (doc.documentName === "JournalEntry" || doc.pages) {
                docName = doc.name;
                const pages = Array.from(doc.pages || []);
                pagesOrItems = pages.map(p => {
                    const charCount = calculateDocCharCount(p);
                    const flags = p.flags?.[MODULE_ID] || {};
                    const isProcessed = !!flags.aiProcessed;
                    const isGrammarChecked = !!flags.aiGrammarChecked;
                    const isCompleted = (this.mode === 'grammar') ? isGrammarChecked : isProcessed;
                    let isChecked = false;
                    if (this.selectedIds && this.selectedIds.length > 0) {
                        isChecked = this.selectedIds.includes(p.id);
                    } else if (!isCompleted && selectedCount < batchSize) {
                        isChecked = true;
                        selectedCount++;
                    }
                    return {
                        id: p.id,
                        name: p.name,
                        type: p.type,
                        charCount: charCount,
                        formattedChars: charCount > 1000 ? `${(charCount / 1000).toFixed(1)}k` : `${charCount}`,
                        isHuge: charCount > 15000,
                        checked: isChecked,
                        isProcessed,
                        isGrammarChecked
                    };
                });
            } else {
                docName = doc.name;
                const charCount = calculateDocCharCount(doc);
                pagesOrItems = [{
                    id: doc.id || doc._id || "single-doc",
                    name: doc.name,
                    type: doc.type || doc.documentName,
                    charCount: charCount,
                    formattedChars: charCount > 1000 ? `${(charCount / 1000).toFixed(1)}k` : `${charCount}`,
                    isHuge: charCount > 15000,
                    checked: true,
                    isProcessed: !!doc.flags?.[MODULE_ID]?.aiProcessed,
                    isGrammarChecked: false
                }];
            }
        }

        for (const item of pagesOrItems) {
            if (item.checked) {
                currentBatchChars += item.charCount;
            }
        }

        const totalBatchParts = Math.max(1, Math.ceil(currentBatchChars / maxCharLimit));
        const activeAiProvider = game.settings.get(MODULE_ID, 'aiProvider') || 'gemini';
        const aiInfo = AI_THEMES[activeAiProvider] || AI_THEMES.gemini;

        const systemName = game.system?.title || game.system?.id || "Tabletop RPG";
        const settingPresets = SETTING_PRESETS.map(sp => ({
            ...sp,
            selected: sp.id === this.selectedSettingPreset
        }));

        const languageOptions = Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => ({
            code,
            label,
            selected: code === this.selectedTargetLang
        }));

        let activeDiffItem = null;
        if (this.previewData?.diffs?.length > 0) {
            if (!this.selectedDiffPageId) {
                this.selectedDiffPageId = this.previewData.diffs[0].id;
            }
            activeDiffItem = this.previewData.diffs.find(d => d.id === this.selectedDiffPageId) || this.previewData.diffs[0];
        }

        return {
            step: this.step,
            isStep1: this.step === 1,
            isStep2: this.step === 2,
            isStep3: this.step === 3,
            isStep4: this.step === 4,
            mode: this.mode,
            isModeTranslate: this.mode === 'translate',
            isModeGrammar: this.mode === 'grammar',
            isModeGlossary: this.mode === 'glossary',
            hasDoc: hasDoc,
            document: doc,
            docName: docName,
            pagesOrItems: pagesOrItems,
            hasBackup: hasBackup,
            compendiumPacks: compendiumPacks,
            packFolders: packFolders,
            isFolder: isFolderDoc,
            isCompendium: isCompendiumPack,
            systemName: systemName,
            settingPresets: settingPresets,
            selectedSettingPreset: this.selectedSettingPreset,
            languageOptions: languageOptions,
            selectedTargetLang: this.selectedTargetLang,
            isCustomTargetLang: this.selectedTargetLang === "custom",
            customTargetLangName: this.customTargetLangName,
            isCustomSetting: this.selectedSettingPreset === "custom",
            customSettingName: this.customSettingName,
            customInstruct: this.customInstruct,
            generatedPrompt: this.generatedPrompt,
            pastedText: this.pastedText,
            parseError: this.parseError,
            previewData: this.previewData,
            activeDiffItem: activeDiffItem,
            selectedDiffPageId: this.selectedDiffPageId,
            currentBatchChars: currentBatchChars,
            maxCharLimit: maxCharLimit,
            batchPercent: Math.min(100, Math.round((currentBatchChars / maxCharLimit) * 100)),
            batchStatusColor: currentBatchChars > maxCharLimit ? "red" : (currentBatchChars > maxCharLimit * 0.75 ? "orange" : "green"),
            totalBatchParts: totalBatchParts,
            currentBatchPart: this.currentBatchIndex + 1,
            hasMultipleParts: this.promptBatches.length > 1,
            aiProviderName: aiInfo.label,
            aiUrl: aiInfo.url
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);

        const dropZone = this.element.querySelector('.universal-drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });
            dropZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const data = TextEditor.getDragEventData(e);
                if (data && data.uuid) {
                    const doc = await fromUuid(data.uuid);
                    if (doc) {
                        this.document = doc;
                        this.isCompendium = !!doc.pack;
                        this.isFolder = doc.documentName === "Folder";
                        this.selectedIds = [];
                        this.render(false);
                    }
                }
            });
        }
    }

    static onOpenStats(event, target) {
        calculateTranslationStats().then(stats => {
            new TranslationStatsApp({ stats }).render(true);
        });
    }

    static onOpenGlossarySearch(event, target) {
        new GlossarySearchApp().render(true);
    }

    static onOpenAuditor(event, target) {
        new CampaignAuditorApp().render(true);
    }

    static onOpenSearch(event, target) {
        new JournalSearchApp().render(true);
    }

    static onOpenGlossaryJournal(event, target) {
        const journal = UniversalGlossary.getFoundryGlossaryJournal();
        if (journal) journal.sheet.render(true);
        else ui.notifications.warn("Kein AI Glossar gefunden.");
    }

    static async onSortGlossaryDialog(event, target) {
        await UniversalGlossary.sortFoundryGlossaryAlphabetically();
    }

    static onExportMemory(event, target) {
        TranslationMemory.exportToFile();
    }

    static async onImportMemory(event, target) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (re) => {
                const res = await TranslationMemory.importFromFile(re.target.result);
                if (res.success) ui.notifications.success(`${res.importedCount} Einträge erfolgreich importiert!`);
                else ui.notifications.error(res.error);
            };
            reader.readAsText(file);
        };
        input.click();
    }

    static async onClearMemory(event, target) {
        Dialog.confirm({
            title: "Translation Memory leeren",
            content: "<p>Möchtest du wirklich alle gespeicherten Übersetzungen aus dem World-Speicher löschen?</p>",
            yes: async () => {
                await TranslationMemory.clearMemory();
                ui.notifications.info("Translation Memory geleert.");
            }
        });
    }

    static async onSmartSync(event, target) {
        const journals = (game.journal || []).filter(j => !j.name.includes("(Backup)") && !j.flags?.[MODULE_ID]?.isBackup);
        const syncAnalysis = TranslationMemory.analyzeSmartSync(journals);

        if (syncAnalysis.autoCount === 0) {
            ui.notifications.info("Keine exakten Übereinstimmungen im Translation Memory gefunden.");
            return;
        }

        Dialog.confirm({
            title: "Smart-Sync Übersetzungen anwenden",
            content: `<p>Es wurden <strong>${syncAnalysis.autoCount} Seiten</strong> gefunden, die exakt mit früheren Übersetzungen übereinstimmen.</p><p>Möchtest du diese jetzt mit 1 Klick anwenden?</p>`,
            yes: async () => {
                const count = await TranslationMemory.applyAutoMatches(syncAnalysis.autoApplicable);
                ui.notifications.success(`${count} Seiten erfolgreich synchronisiert!`);
                this.render(false);
            }
        });
    }

    static async onRemapLinks(event, target) {
        const analysis = SmartLinkRemapper.analyzeLinks(this.document);
        if (analysis.remappableCount === 0) {
            ui.notifications.info("Keine umbiegbaren Kompendium-Links gefunden.");
            return;
        }

        Dialog.confirm({
            title: "Kompendium-Links umbiegen",
            content: `<p>Es wurden <strong>${analysis.remappableCount} Verlinkungen</strong> in ${analysis.journalCount} Journalen gefunden, die auf existierende Welt-Dokumente umgebogen werden können.</p><p>Vor der Änderung wird automatisch ein Sicherheits-Backup erstellt.</p>`,
            yes: async () => {
                const res = await SmartLinkRemapper.executeRemapping(analysis.changes);
                ui.notifications.success(`${res.totalLinksRemapped} Links in ${res.modifiedJournals} Journalen erfolgreich umgebogen!`);
            }
        });
    }

    static async onRestoreBackup(event, target) {
        if (!this.document) return;
        await restoreDocumentFromBackup(this.document);
        this.render(false);
    }

    static onClearDocument(event, target) {
        this.document = null;
        this.isCompendium = false;
        this.isFolder = false;
        this.selectedIds = [];
        this.step = 1;
        this.render(false);
    }

    static onToggleSelect(event, target) {
        const id = target.dataset.id;
        if (!id) return;
        if (this.selectedIds.includes(id)) {
            this.selectedIds = this.selectedIds.filter(x => x !== id);
        } else {
            this.selectedIds.push(id);
        }
        this.render(false);
    }

    static onSelectUnprocessed(event, target) {
        const batchSize = game.settings.get(MODULE_ID, 'batchSize') || 10;
        const boxes = Array.from(this.element.querySelectorAll('input[name="selectedPages"]'));
        this.selectedIds = [];
        let count = 0;
        for (const b of boxes) {
            const isProcessed = b.dataset.processed === "true";
            if (!isProcessed && count < batchSize) {
                this.selectedIds.push(b.value);
                count++;
            }
        }
        this.render(false);
    }

    static onSelectNext(event, target) {
        const batchSize = game.settings.get(MODULE_ID, 'batchSize') || 10;
        const boxes = Array.from(this.element.querySelectorAll('input[name="selectedPages"]'));
        const startIndex = boxes.findIndex(b => this.selectedIds.includes(b.value));
        const nextBoxes = startIndex !== -1 ? boxes.slice(startIndex + this.selectedIds.length) : boxes;
        this.selectedIds = [];
        let count = 0;
        for (const b of nextBoxes) {
            if (count < batchSize) {
                this.selectedIds.push(b.value);
                count++;
            }
        }
        this.render(false);
    }

    static async onSelectCompendium(event, target) {
        const packId = target.value;
        if (!packId) return;
        const pack = game.packs?.get(packId);
        if (pack) {
            this.document = pack;
            this.isCompendium = true;
            this.isFolder = false;
            this.selectedIds = [];
            this.render(false);
        }
    }

    static onFilterFolder(event, target) {
        this.selectedFolderId = target.value || "all";
        this.render(false);
    }

    static onChangeSettingPreset(event, target) {
        this.selectedSettingPreset = target.value;
        this.render(false);
    }

    static onChangeTargetLanguage(event, target) {
        this.selectedTargetLang = target.value;
        this.render(false);
    }

    static onSelectDiffPage(event, target) {
        this.selectedDiffPageId = target.dataset.pageId;
        this.render(false);
    }

    static async onGeneratePrompt(event, target) {
        if (!this.document) {
            ui.notifications.warn("Bitte wähle zuerst ein Dokument oder einen Ordner aus.");
            return;
        }

        const checkedBoxes = Array.from(this.element.querySelectorAll('input[name="selectedPages"]:checked'));
        if (checkedBoxes.length === 0) {
            ui.notifications.warn("Bitte wähle mindestens eine Seite oder ein Element aus.");
            return;
        }

        this.selectedIds = checkedBoxes.map(b => b.value);
        this.mode = this.element.querySelector('input[name="mode"]:checked')?.value || this.mode || 'translate';
        this.customInstruct = this.element.querySelector('#universal-custom-instruct')?.value || this.customInstruct;

        const maxCharLimit = game.settings.get(MODULE_ID, 'maxPromptLength') || 12000;
        const systemName = game.system?.title || game.system?.id || "Tabletop RPG";
        
        let settingContextStr = SETTING_PRESETS.find(p => p.id === this.selectedSettingPreset)?.label || "Fantasy";
        if (this.selectedSettingPreset === "custom" && this.customSettingName) {
            settingContextStr = this.customSettingName;
        }

        let targetLangName = SUPPORTED_LANGUAGES[this.selectedTargetLang] || "Deutsch";
        if (this.selectedTargetLang === "custom" && this.customTargetLangName) {
            targetLangName = this.customTargetLangName;
        }

        let sourceLangName = this.selectedSourceLang === 'auto' ? 'Originalsprache / Englisch' : (SUPPORTED_LANGUAGES[this.selectedSourceLang] || 'Englisch');

        const targetCleanItems = [];
        if (this.document.pages) {
            for (const p of this.document.pages) {
                if (this.selectedIds.includes(p.id)) {
                    targetCleanItems.push(getCleanData(p, true));
                }
            }
        } else if (this.document.documents) {
            for (const d of this.document.documents) {
                if (this.selectedIds.includes(d.id || d._id)) {
                    targetCleanItems.push(getCleanData(d, true));
                }
            }
        } else {
            targetCleanItems.push(getCleanData(this.document, true));
        }

        this.promptBatches = createChunkedBatches(targetCleanItems, maxCharLimit);
        this.currentBatchIndex = 0;

        await this._buildBatchPrompt(this.currentBatchIndex, systemName, settingContextStr, sourceLangName, targetLangName);

        this.step = 2;
        this.render(false);
    }

    async _buildBatchPrompt(batchIndex, systemName, settingContextStr, sourceLangName, targetLangName) {
        const batchItems = this.promptBatches[batchIndex] || [];
        let promptKey = "TranslateWithGlossary";
        if (this.mode === "grammar") promptKey = "GrammarCheck";
        else if (this.mode === "glossary") promptKey = "GlossaryGen";

        let payloadData = {
            name: this.document.name || "Dokument",
            pages: batchItems
        };

        if (this.mode === "translate") {
            const injected = await injectOfficialTranslations(payloadData);
            payloadData = injected.docData;
        } else if (this.mode === "grammar") {
            const injected = await injectGlossaryMarkers(payloadData);
            payloadData = injected.processedData;
        }

        const jsonString = JSON.stringify(payloadData, null, 2);

        this.generatedPrompt = resolvePrompt(promptKey, {
            systemName: systemName,
            settingContext: settingContextStr,
            sourceLangName: sourceLangName || "Englisch",
            targetLangName: targetLangName || "Deutsch",
            userPrompt: this.customInstruct ? `\n### ZUSATZANWEISUNGEN DES BENUTZERS:\n${this.customInstruct}\n` : "",
            jsonString: jsonString
        });
    }

    static onPrevBatchPart(event, target) {
        if (this.currentBatchIndex > 0) {
            this.currentBatchIndex--;
            const systemName = game.system?.title || game.system?.id || "Tabletop RPG";
            const settingContextStr = SETTING_PRESETS.find(p => p.id === this.selectedSettingPreset)?.label || "Fantasy";
            const targetLangName = SUPPORTED_LANGUAGES[this.selectedTargetLang] || "Deutsch";
            const sourceLangName = this.selectedSourceLang === 'auto' ? 'Originalsprache / Englisch' : (SUPPORTED_LANGUAGES[this.selectedSourceLang] || 'Englisch');
            this._buildBatchPrompt(this.currentBatchIndex, systemName, settingContextStr, sourceLangName, targetLangName).then(() => {
                this.render(false);
            });
        }
    }

    static onNextBatchPart(event, target) {
        if (this.currentBatchIndex < this.promptBatches.length - 1) {
            this.currentBatchIndex++;
            const systemName = game.system?.title || game.system?.id || "Tabletop RPG";
            const settingContextStr = SETTING_PRESETS.find(p => p.id === this.selectedSettingPreset)?.label || "Fantasy";
            const targetLangName = SUPPORTED_LANGUAGES[this.selectedTargetLang] || "Deutsch";
            const sourceLangName = this.selectedSourceLang === 'auto' ? 'Originalsprache / Englisch' : (SUPPORTED_LANGUAGES[this.selectedSourceLang] || 'Englisch');
            this._buildBatchPrompt(this.currentBatchIndex, systemName, settingContextStr, sourceLangName, targetLangName).then(() => {
                this.render(false);
            });
        }
    }

    static onCopyPromptAndOpenAi(event, target) {
        const activeAiProvider = game.settings.get(MODULE_ID, 'aiProvider') || 'gemini';
        const aiInfo = AI_THEMES[activeAiProvider] || AI_THEMES.gemini;

        navigator.clipboard.writeText(this.generatedPrompt).then(() => {
            ui.notifications.success("Prompt in Zwischenablage kopiert! KI wird geöffnet...");
            window.open(aiInfo.url, "_blank");
            this.step = 3;
            this.render(false);
        }).catch(err => {
            ui.notifications.error("Zwischenablage konnte nicht beschrieben werden.");
        });
    }

    static onJumpToStep(event, target) {
        const targetStep = parseInt(target.dataset.step, 10);
        if (targetStep >= 1 && targetStep <= 4) {
            this.step = targetStep;
            this.render(false);
        }
    }

    static onBackToStep1(event, target) {
        this.step = 1;
        this.render(false);
    }

    static onGoToStep3(event, target) {
        this.step = 3;
        this.render(false);
    }

    static onBackToStep2(event, target) {
        this.step = 2;
        this.render(false);
    }

    static onBackToStep3(event, target) {
        this.step = 3;
        this.render(false);
    }

    static onAnalyzePaste(event, target) {
        const text = this.element.querySelector('#universal-paste-input')?.value || this.pastedText;
        this.pastedText = text;

        if (!text || !text.trim()) {
            ui.notifications.warn("Bitte füge zuerst die Antwort der KI in das Textfeld ein.");
            return;
        }

        try {
            this.parseResult = smartParseAiResponse(text);
            this.previewData = buildPreApplyDiff(this.document, this.parseResult);
            this.selectedDiffPageId = this.previewData.diffs?.[0]?.id || null;
            this.parseError = null;
            this.step = 4;
            this.render(false);
        } catch (err) {
            this.parseError = err.message;
            ui.notifications.error(`Fehler beim Analysieren: ${err.message}`);
            this.render(false);
        }
    }

    static async onApplyFinalUpdate(event, target) {
        if (!this.parseResult || !this.document) return;

        try {
            await applyResolvedUpdate(this.document, this.parseResult);

            const pages = this.parseResult.pages || this.parseResult.items || [this.parseResult];
            for (const p of pages) {
                await TranslationMemory.recordTranslation({
                    id: p._id || p.id,
                    docName: this.document.name,
                    name: p.name,
                    transText: p.text?.content || p.system?.description || "",
                    type: p.type
                });
            }

            ui.notifications.success(`Dokument "${this.document.name}" erfolgreich aktualisiert!`);
            this.step = 1;
            this.selectedIds = [];
            this.pastedText = "";
            this.parseResult = null;
            this.previewData = null;
            this.render(false);
        } catch (err) {
            ui.notifications.error(`Fehler beim Speichern: ${err.message}`);
        }
    }

    static async onApplyAndContinue(event, target) {
        await this.onApplyFinalUpdate(event, target);
        this.onSelectNext(event, target);
    }
}
