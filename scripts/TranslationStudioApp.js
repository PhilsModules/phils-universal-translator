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
import { LocalLlmClient } from './LocalLlmClient.js';
import { LocalLlmSetupWizard } from './LocalLlmSetupWizard.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const AI_THEMES = {
    ollama: { label: "Ollama (Local LLM)", url: "http://localhost:11434" },
    gemini: { label: "Google Gemini", url: "https://gemini.google.com/app" },
    chatgpt: { label: "ChatGPT", url: "https://chatgpt.com/" },
    claude: { label: "Anthropic Claude", url: "https://claude.ai/new" },
    copilot: { label: "Microsoft Copilot", url: "https://copilot.microsoft.com/" },
    perplexity: { label: "Perplexity AI", url: "https://www.perplexity.ai/" }
};

const SETTING_PRESETS = [
    { id: "fantasy", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.Fantasy", label: "Fantasy / High Fantasy" },
    { id: "grimdark", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.Grimdark", label: "Dark Fantasy / Grimdark" },
    { id: "scifi", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.SciFi", label: "Sci-Fi / Space Opera" },
    { id: "cyberpunk", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.Cyberpunk", label: "Cyberpunk / Tech-Noir" },
    { id: "horror", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.Horror", label: "Horror / Lovecraftian" },
    { id: "modern", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.Modern", label: "Modern / Urban Mystery" },
    { id: "postapo", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.PostApo", label: "Post-Apocalyptic / Wasteland" },
    { id: "custom", labelKey: "PHILS_UNIVERSAL_TRANSLATE.Presets.Custom", label: "Custom / Homebrew Setting" }
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
    static DEFAULT_OPTIONS = {
        id: "universal-translation-studio",
        tag: "form",
        window: {
            title: "PHILS_UNIVERSAL_TRANSLATE.UI.StudioTitle",
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
            openLocalLlmSetup: function(event, target) { return this.onOpenLocalLlmSetup(event, target); },
            executeDirectLocalTranslation: function(event, target) { return this.onExecuteDirectLocalTranslation(event, target); },
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
        this.selectedDiffPageId = null;
        this.step = 1;
        this.mode = options.mode || 'translate';
        this.selectedTargetLang = game.settings.get(MODULE_ID, 'targetLanguage') || 'de';
        this.selectedSourceLang = game.settings.get(MODULE_ID, 'sourceLanguage') || 'auto';
        this.selectedSettingPreset = game.settings.get(MODULE_ID, 'settingPreset') || 'fantasy';
        this.customSettingName = "";
        this.customTargetLangName = "";
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
                docName = folder?.name || doc.name || game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.BadgeFolder");

                const allDocs = Array.from(doc.documents || folder?.contents || folder?.documents || []);
                pagesOrItems = allDocs.map(d => {
                    const charCount = calculateDocCharCount(d);
                    const flags = d.flags?.[MODULE_ID] || {};
                    const isProcessed = !!flags.aiProcessed;
                    const isGrammarChecked = !!flags.aiGrammarChecked;
                    const isCompleted = (this.mode === 'grammar') ? isGrammarChecked : isProcessed;
                    let isChecked = false;
                    if (this.selectedIds && this.selectedIds.length > 0) {
                        isChecked = this.selectedIds.includes(d.id || d._id);
                    } else if (!isCompleted && selectedCount < batchSize) {
                        isChecked = true;
                        selectedCount++;
                    }
                    return {
                        id: d.id || d._id,
                        name: d.name,
                        type: d.type || folderType,
                        charCount: charCount,
                        formattedChars: charCount > 1000 ? `${(charCount / 1000).toFixed(1)}k` : `${charCount}`,
                        isHuge: charCount > 15000,
                        checked: isChecked,
                        isProcessed,
                        isGrammarChecked
                    };
                });
            } else if (doc.pack || isCompendiumPack) {
                isCompendiumPack = true;
                this.isCompendium = true;
                const pack = (typeof doc.getDocuments === 'function') ? doc : game.packs.get(doc.pack || doc.id);
                docName = pack?.metadata?.label || doc.name;
                const index = await pack.getIndex({ fields: ["name", "type", "flags"] });
                pagesOrItems = Array.from(index).map(entry => {
                    const flags = entry.flags?.[MODULE_ID] || {};
                    const isProcessed = !!flags.aiProcessed;
                    const isGrammarChecked = !!flags.aiGrammarChecked;
                    const isCompleted = (this.mode === 'grammar') ? isGrammarChecked : isProcessed;
                    let isChecked = false;
                    if (this.selectedIds && this.selectedIds.length > 0) {
                        isChecked = this.selectedIds.includes(entry._id);
                    } else if (!isCompleted && selectedCount < batchSize) {
                        isChecked = true;
                        selectedCount++;
                    }
                    return {
                        id: entry._id,
                        name: entry.name,
                        type: entry.type || pack.metadata.type,
                        charCount: (entry.name || "").length * 5 + 200,
                        formattedChars: "~1k",
                        isHuge: false,
                        checked: isChecked,
                        isProcessed,
                        isGrammarChecked
                    };
                });
            } else if (doc.documentName === "JournalEntry" || doc.pages) {
                const backupName = `${doc.name} (Backup)`;
                hasBackup = !!(game.journal && game.journal.getName(backupName));
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
        const activeAiProvider = game.settings.get(MODULE_ID, 'aiProvider') || 'ollama';
        const aiInfo = AI_THEMES[activeAiProvider] || AI_THEMES.ollama || AI_THEMES.gemini;
        const localLlmEndpoint = game.settings.get(MODULE_ID, 'localLlmEndpoint') || "http://localhost:11434";
        const localLlmModel = game.settings.get(MODULE_ID, 'localLlmModel') || "llama3";

        const systemName = game.system?.title || game.system?.id || "Tabletop RPG";
        const settingPresets = SETTING_PRESETS.map(sp => ({
            ...sp,
            label: game.i18n.has(sp.labelKey) ? game.i18n.localize(sp.labelKey) : sp.label,
            selected: sp.id === this.selectedSettingPreset
        }));

        const languageOptions = Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => ({
            code,
            label: (typeof label === 'string' && game.i18n.has(label)) ? game.i18n.localize(label) : label,
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
            aiUrl: aiInfo.url,
            isDirectTranslating: this.isDirectTranslating || false,
            localLlmEndpoint: localLlmEndpoint,
            localLlmModel: localLlmModel,
            isOllamaActive: activeAiProvider === 'ollama'
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

        // Add change listeners for dropdowns and radios to guarantee reactivity
        const targetLangSelect = this.element.querySelector('#universal-target-lang-select');
        if (targetLangSelect) {
            targetLangSelect.addEventListener('change', (e) => this.onChangeTargetLanguage(e, e.target));
        }

        const genreSelect = this.element.querySelector('#universal-genre-select');
        if (genreSelect) {
            genreSelect.addEventListener('change', (e) => this.onChangeSettingPreset(e, e.target));
        }

        const packSelect = this.element.querySelector('#universal-pack-select');
        if (packSelect) {
            packSelect.addEventListener('change', (e) => this.onSelectCompendium(e, e.target));
        }

        const modeInputs = this.element.querySelectorAll('input[name="mode"]');
        modeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.mode = e.target.value;
                this.render(false);
            });
        });
    }

    onOpenStats(event, target) {
        calculateTranslationStats().then(stats => {
            new TranslationStatsApp({ stats }).render(true);
        });
    }

    onOpenGlossarySearch(event, target) {
        new GlossarySearchApp().render(true);
    }

    onOpenAuditor(event, target) {
        new CampaignAuditorApp().render(true);
    }

    onOpenSearch(event, target) {
        new JournalSearchApp().render(true);
    }

    onOpenGlossaryJournal(event, target) {
        const journal = UniversalGlossary.getFoundryGlossaryJournal();
        if (journal) journal.sheet.render(true);
        else ui.notifications.warn(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.NoGlossaryFound"));
    }

    async onSortGlossaryDialog(event, target) {
        await UniversalGlossary.sortFoundryGlossaryAlphabetically();
    }

    onExportMemory(event, target) {
        TranslationMemory.exportToFile();
    }

    async onImportMemory(event, target) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (re) => {
                const res = await TranslationMemory.importFromFile(re.target.result);
                if (res.success) ui.notifications.success(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Notifications.ImportSuccess", { count: res.importedCount }));
                else ui.notifications.error(res.error);
            };
            reader.readAsText(file);
        };
        input.click();
    }

    async onClearMemory(event, target) {
        Dialog.confirm({
            title: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Dialogs.ClearMemoryTitle"),
            content: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Dialogs.ClearMemoryContent"),
            yes: async () => {
                await TranslationMemory.clearMemory();
                ui.notifications.info(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.MemoryCleared"));
            }
        });
    }

    async onSmartSync(event, target) {
        const journals = (game.journal || []).filter(j => !j.name.includes("(Backup)") && !j.flags?.[MODULE_ID]?.isBackup);
        const syncAnalysis = TranslationMemory.analyzeSmartSync(journals);

        if (syncAnalysis.autoCount === 0) {
            ui.notifications.info(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.NoSmartSyncMatches"));
            return;
        }

        Dialog.confirm({
            title: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Dialogs.SmartSyncTitle"),
            content: game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Dialogs.SmartSyncContent", { count: syncAnalysis.autoCount }),
            yes: async () => {
                const count = await TranslationMemory.applyAutoMatches(syncAnalysis.autoApplicable);
                ui.notifications.success(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Notifications.SmartSyncSuccess", { count: count }));
                this.render(false);
            }
        });
    }

    async onRemapLinks(event, target) {
        const analysis = SmartLinkRemapper.analyzeLinks(this.document);
        if (analysis.remappableCount === 0) {
            ui.notifications.info(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.NoRemappableLinks"));
            return;
        }

        Dialog.confirm({
            title: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Dialogs.RemapLinksTitle"),
            content: game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Dialogs.RemapLinksContent", { count: analysis.remappableCount, journals: analysis.journalCount }),
            yes: async () => {
                const res = await SmartLinkRemapper.executeRemapping(analysis.changes);
                ui.notifications.success(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Notifications.RemapSuccess", { links: res.totalLinksRemapped, journals: res.modifiedJournals }));
            }
        });
    }

    async onRestoreBackup(event, target) {
        if (!this.document) return;
        await restoreDocumentFromBackup(this.document);
        this.render(false);
    }

    onClearDocument(event, target) {
        this.document = null;
        this.isCompendium = false;
        this.isFolder = false;
        this.selectedIds = [];
        this.step = 1;
        this.render(false);
    }

    onToggleSelect(event, target) {
        const id = target?.dataset?.id;
        if (id) {
            if (this.selectedIds.includes(id)) {
                this.selectedIds = this.selectedIds.filter(x => x !== id);
            } else {
                this.selectedIds.push(id);
            }
        } else {
            const boxes = Array.from(this.element.querySelectorAll('input[name="selectedPages"]'));
            if (this.selectedIds.length === boxes.length) {
                this.selectedIds = [];
            } else {
                this.selectedIds = boxes.map(b => b.value);
            }
        }
        this.render(false);
    }

    onSelectUnprocessed(event, target) {
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

    onSelectNext(event, target) {
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

    async onSelectCompendium(event, target) {
        const packId = target?.value || this.element.querySelector('#universal-pack-select')?.value;
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

    onFilterFolder(event, target) {
        this.selectedFolderId = target?.value || "all";
        this.render(false);
    }

    onChangeSettingPreset(event, target) {
        const val = target?.value || this.element.querySelector('#universal-genre-select')?.value;
        if (val) {
            this.selectedSettingPreset = val;
            this.render(false);
        }
    }

    onChangeTargetLanguage(event, target) {
        const val = target?.value || this.element.querySelector('#universal-target-lang-select')?.value;
        if (val) {
            this.selectedTargetLang = val;
            this.render(false);
        }
    }

    onSelectDiffPage(event, target) {
        this.selectedDiffPageId = target?.dataset?.pageId;
        this.render(false);
    }

    async onGeneratePrompt(event, target) {
        if (!this.document) {
            ui.notifications.warn(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.SelectDocFirst"));
            return;
        }

        const checkedBoxes = Array.from(this.element.querySelectorAll('input[name="selectedPages"]:checked'));
        if (checkedBoxes.length === 0) {
            ui.notifications.warn(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.SelectPagesFirst"));
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
            userPrompt: this.customInstruct ? `\n### USER CUSTOM INSTRUCTIONS:\n${this.customInstruct}\n` : "",
            jsonString: jsonString
        });
    }

    onPrevBatchPart(event, target) {
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

    onNextBatchPart(event, target) {
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

    onCopyPromptAndOpenAi(event, target) {
        const activeAiProvider = game.settings.get(MODULE_ID, 'aiProvider') || 'gemini';
        const aiInfo = AI_THEMES[activeAiProvider] || AI_THEMES.gemini;

        navigator.clipboard.writeText(this.generatedPrompt).then(() => {
            ui.notifications.success(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.PromptCopied"));
            window.open(aiInfo.url, "_blank");
            this.step = 3;
            this.render(false);
        }).catch(err => {
            ui.notifications.error(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.ClipboardError"));
        });
    }

    onJumpToStep(event, target) {
        const targetStep = parseInt(target?.dataset?.step, 10);
        if (targetStep >= 1 && targetStep <= 4) {
            this.step = targetStep;
            this.render(false);
        }
    }

    onBackToStep1(event, target) {
        this.step = 1;
        this.render(false);
    }

    onGoToStep3(event, target) {
        this.step = 3;
        this.render(false);
    }

    onBackToStep2(event, target) {
        this.step = 2;
        this.render(false);
    }

    onBackToStep3(event, target) {
        this.step = 3;
        this.render(false);
    }

    onAnalyzePaste(event, target) {
        const text = this.element.querySelector('#universal-paste-input')?.value || this.pastedText;
        this.pastedText = text;

        if (!text || !text.trim()) {
            ui.notifications.warn(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.PasteFirst"));
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
            ui.notifications.error(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Notifications.AnalyzeError", { error: err.message }));
            this.render(false);
        }
    }

    async onApplyFinalUpdate(event, target) {
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

            ui.notifications.success(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Notifications.DocUpdatedSuccess", { name: this.document.name }));
            this.step = 1;
            this.selectedIds = [];
            this.pastedText = "";
            this.parseResult = null;
            this.previewData = null;
            this.render(false);
        } catch (err) {
            ui.notifications.error(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Notifications.SaveError", { error: err.message }));
        }
    }

    async onApplyAndContinue(event, target) {
        await this.onApplyFinalUpdate(event, target);
        this.onSelectNext(event, target);
    }

    onOpenLocalLlmSetup(event, target) {
        new LocalLlmSetupWizard().render(true);
    }

    async onExecuteDirectLocalTranslation(event, target) {
        if (!this.generatedPrompt) {
            ui.notifications.warn(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Notifications.SelectPagesFirst"));
            return;
        }

        this.isDirectTranslating = true;
        this.render(false);

        try {
            const endpoint = game.settings.get(MODULE_ID, 'localLlmEndpoint') || "http://localhost:11434";
            const model = game.settings.get(MODULE_ID, 'localLlmModel') || "llama3";

            const rawResponse = await LocalLlmClient.queryDirect({
                prompt: this.generatedPrompt,
                endpoint: endpoint,
                model: model
            });

            this.pastedText = rawResponse;
            this.parseResult = smartParseAiResponse(rawResponse);
            this.previewData = buildPreApplyDiff(this.document, this.parseResult);
            this.selectedDiffPageId = this.previewData.diffs?.[0]?.id || null;
            this.parseError = null;
            this.step = 4;
            ui.notifications.success(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.LocalLlm.DirectTranslationSuccess"));
        } catch (err) {
            console.error("Phil's Universal Translator | Direct local translation error:", err);
            this.parseError = err.message;
            ui.notifications.error(game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.LocalLlm.DirectTranslationError", { error: err.message }));
            this.step = 3;
        } finally {
            this.isDirectTranslating = false;
            this.render(false);
        }
    }
}
