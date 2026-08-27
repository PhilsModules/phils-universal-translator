import { TranslationStudioApp } from './TranslationStudioApp.js';
import { MODULE_ID, cleanupExcessBackups, repairAllBackupConflicts } from './TranslationLogic.js';
import { UniversalGlossary } from './UniversalGlossary.js';
import { JournalSearchApp } from './JournalSearchApp.js';
import { CampaignAuditorApp } from './CampaignAuditorApp.js';
import { TranslationDatabase } from './TranslationDatabase.js';
import { RuntimeTranslationEngine } from './RuntimeTranslationEngine.js';
import { QuickSelectionTranslator } from './QuickSelectionTranslator.js';
import { LocalLlmSetupWizard } from './LocalLlmSetupWizard.js';

export const SUPPORTED_LANGUAGES = {
    'de': '🇩🇪 Deutsch (German)',
    'en': '🇬🇧 English (Englisch)',
    'fr': '🇫🇷 Français (French)',
    'es': '🇪🇸 Español (Spanish)',
    'it': '🇮🇹 Italiano (Italian)',
    'pt': '🇵🇹 Português (Portuguese)',
    'pl': '🇵🇱 Polski (Polish)',
    'uk': '🇺🇦 Українська (Ukrainian)',
    'ja': '🇯🇵 日本語 (Japanese)',
    'zh': '🇨🇳 中文 (Chinese)',
    'ru': '🇷🇺 Русский (Russian)',
    'custom': '🌐 Custom / Other'
};

Hooks.once('init', () => {
    console.log("Phil's Universal Translator | Initializing local translation assistant...");

    game.settings.register(MODULE_ID, 'localLlmEndpoint', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.LocalLlmEndpoint.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.LocalLlmEndpoint.Hint"),
        scope: 'client',
        config: true,
        type: String,
        default: 'http://localhost:11434'
    });

    game.settings.register(MODULE_ID, 'localLlmModel', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.LocalLlmModel.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.LocalLlmModel.Hint"),
        scope: 'client',
        config: true,
        type: String,
        default: 'llama3'
    });

    game.settings.register(MODULE_ID, 'aiProvider', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.AIProvider.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.AIProvider.Hint"),
        scope: 'client',
        config: true,
        type: String,
        default: 'ollama',
        choices: {
            'ollama': '🦙 Ollama / Local LLM (Local)',
            'gemini': 'Google Gemini (Web)',
            'chatgpt': 'ChatGPT (Web)',
            'claude': 'Anthropic Claude (Web)',
            'copilot': 'Microsoft Copilot',
            'perplexity': 'Perplexity AI'
        }
    });

    game.settings.register(MODULE_ID, 'firstRunWizardCompleted', {
        name: "First Run Wizard Completed",
        scope: 'client',
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register(MODULE_ID, 'targetLanguage', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.TargetLanguage.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.TargetLanguage.Hint"),
        scope: 'client',
        config: true,
        type: String,
        default: 'de',
        choices: SUPPORTED_LANGUAGES
    });

    game.settings.register(MODULE_ID, 'sourceLanguage', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.SourceLanguage.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.SourceLanguage.Hint"),
        scope: 'client',
        config: true,
        type: String,
        default: 'auto',
        choices: {
            'auto': '✨ Auto-Detect',
            'en': '🇬🇧 English (Englisch)',
            'de': '🇩🇪 Deutsch (German)',
            'fr': '🇫🇷 Français (French)',
            'es': '🇪🇸 Español (Spanish)',
            'ja': '🇯🇵 日本語 (Japanese)',
            'custom': '🌐 Custom / Other'
        }
    });

    game.settings.register(MODULE_ID, 'settingPreset', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.SettingPreset.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.SettingPreset.Hint"),
        scope: 'client',
        config: true,
        type: String,
        default: 'fantasy',
        choices: {
            'fantasy': 'Fantasy / High Fantasy',
            'grimdark': 'Dark Fantasy / Grimdark',
            'scifi': 'Sci-Fi / Space Opera',
            'cyberpunk': 'Cyberpunk / Tech-Noir',
            'horror': 'Horror / Lovecraftian',
            'modern': 'Modern / Urban Mystery',
            'postapo': 'Post-Apocalyptic / Wasteland',
            'custom': 'Custom / Homebrew'
        }
    });

    game.settings.register(MODULE_ID, 'batchSize', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.BatchSize.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.BatchSize.Hint"),
        scope: 'client',
        config: true,
        type: Number,
        default: 10
    });

    game.settings.register(MODULE_ID, 'maxPromptLength', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.MaxPromptLength.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.MaxPromptLength.Hint"),
        scope: 'client',
        config: true,
        type: Number,
        default: 12000
    });

    game.settings.register(MODULE_ID, 'enableRedHeaderButton', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.EnableRedHeaderButton.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.EnableRedHeaderButton.Hint"),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, 'enableQuickSelection', {
        name: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.EnableQuickSelection.Name"),
        hint: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Settings.EnableQuickSelection.Hint"),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, 'translationMemory', {
        name: "Translation Memory Store",
        scope: 'world',
        config: false,
        type: Object,
        default: {}
    });

    RuntimeTranslationEngine.initialize();
    QuickSelectionTranslator.initialize();
});

Hooks.once('ready', async () => {
    await TranslationDatabase.initialize();

    if (game.user.isGM) {
        await UniversalGlossary.ensureFoundryGlossaryJournal();
        await cleanupExcessBackups();
        await repairAllBackupConflicts();

        // Check if first-run wizard should be displayed
        const wizardDone = game.settings.get(MODULE_ID, 'firstRunWizardCompleted');
        if (!wizardDone) {
            setTimeout(() => {
                new LocalLlmSetupWizard().render(true);
            }, 800);
        }
    }
    await UniversalGlossary.loadDictionary();

    if (typeof loadTemplates === 'function') {
        try {
            await loadTemplates([
                `modules/${MODULE_ID}/templates/translation-studio.hbs`,
                `modules/${MODULE_ID}/templates/local-llm-setup.hbs`,
                `modules/${MODULE_ID}/templates/journal-search.hbs`,
                `modules/${MODULE_ID}/templates/glossary-search.hbs`,
                `modules/${MODULE_ID}/templates/translation-stats.hbs`,
                `modules/${MODULE_ID}/templates/campaign-auditor.hbs`
            ]);
        } catch (e) { }
    }
});

// Journal Directory Header Buttons
Hooks.on('renderJournalDirectory', async (app, html) => {
    const element = html instanceof HTMLElement ? html : html[0];
    
    // 1. Translation Studio Button
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("universal-ai-translation-btn");
    button.innerHTML = `<i class="fas fa-language"></i> ${game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Title")}`;

    button.addEventListener("click", event => {
        event.preventDefault();
        new TranslationStudioApp().render(true);
    });

    // 2. Campaign Auditor Button
    const auditorBtn = document.createElement("button");
    auditorBtn.type = "button";
    auditorBtn.classList.add("universal-ai-translation-btn", "universal-auditor-header-btn");
    auditorBtn.innerHTML = `<i class="fas fa-shield-halved"></i> ${game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Auditor.Title")}`;
    auditorBtn.title = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Auditor.Subtitle");

    auditorBtn.addEventListener("click", event => {
        event.preventDefault();
        new CampaignAuditorApp().render(true);
    });

    let headerActions = element.querySelector(".header-actions");
    if (headerActions) {
        headerActions.append(button);
        headerActions.append(auditorBtn);
    } else {
        element.append(button);
        element.append(auditorBtn);
    }
});

// Compendium Directory Header Button
Hooks.on('renderCompendiumDirectory', async (app, html) => {
    const element = html instanceof HTMLElement ? html : html[0];
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("universal-ai-translation-btn");
    button.innerHTML = `<i class="fas fa-language"></i> ${game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Title")}`;

    button.addEventListener("click", event => {
        event.preventDefault();
        new TranslationStudioApp().render(true);
    });

    let headerActions = element.querySelector(".header-actions");
    if (headerActions) headerActions.append(button);
    else element.append(button);
});

// Item Directory Header Button
Hooks.on('renderItemDirectory', async (app, html) => {
    const element = html instanceof HTMLElement ? html : html[0];
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("universal-ai-translation-btn");
    button.innerHTML = `<i class="fas fa-language"></i> ${game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Title")}`;

    button.addEventListener("click", event => {
        event.preventDefault();
        new TranslationStudioApp().render(true);
    });

    let headerActions = element.querySelector(".header-actions");
    if (headerActions) headerActions.append(button);
    else element.append(button);
});

// Actor Directory Header Button
Hooks.on('renderActorDirectory', async (app, html) => {
    const element = html instanceof HTMLElement ? html : html[0];
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("universal-ai-translation-btn");
    button.innerHTML = `<i class="fas fa-language"></i> ${game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.Title")}`;

    button.addEventListener("click", event => {
        event.preventDefault();
        new TranslationStudioApp().render(true);
    });

    let headerActions = element.querySelector(".header-actions");
    if (headerActions) headerActions.append(button);
    else element.append(button);
});

// Context Menus
const registerGenericDirectoryOptions = (entry, menuOptions) => {
    const labelTrans = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ContextTranslateDoc");
    const labelSearch = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ContextSearchDoc");

    if (menuOptions.some(o => o.name === labelTrans)) return;

    menuOptions.push({
        name: labelTrans,
        icon: '<i class="fas fa-language"></i>',
        condition: (header) => {
            const doc = RuntimeTranslationEngine.getDocumentFromContext(header);
            return doc && (doc.isOwner || game.user.isGM);
        },
        callback: async (header) => {
            const doc = await RuntimeTranslationEngine.getDocumentFromContext(header);
            if (doc) {
                new TranslationStudioApp({ document: doc }).render(true);
            }
        }
    });

    menuOptions.push({
        name: labelSearch,
        icon: '<i class="fas fa-magnifying-glass-location"></i>',
        condition: (header) => {
            const doc = RuntimeTranslationEngine.getDocumentFromContext(header);
            return doc && (doc.isOwner || game.user.isGM) && doc.documentName === "JournalEntry";
        },
        callback: async (header) => {
            const doc = await RuntimeTranslationEngine.getDocumentFromContext(header);
            if (doc?.id) {
                new JournalSearchApp({ journalId: doc.id }).render(true);
            }
        }
    });
};

Hooks.on('getJournalEntryContextOptions', registerGenericDirectoryOptions);
Hooks.on('getJournalDirectoryEntryContext', registerGenericDirectoryOptions);
Hooks.on('getItemDirectoryEntryContextOptions', registerGenericDirectoryOptions);
Hooks.on('getItemDirectoryEntryContext', registerGenericDirectoryOptions);
Hooks.on('getActorDirectoryEntryContextOptions', registerGenericDirectoryOptions);
Hooks.on('getActorDirectoryEntryContext', registerGenericDirectoryOptions);

// Compendium Pack Context Options
const registerCompendiumDirectoryOptions = (entry, menuOptions) => {
    const labelComp = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ContextTranslateCompendium");
    if (menuOptions.some(o => o.name === labelComp)) return;

    menuOptions.push({
        name: labelComp,
        icon: '<i class="fas fa-language"></i>',
        condition: (header) => {
            const el = header instanceof HTMLElement ? header : (header[0] || header);
            const packId = el?.dataset?.pack || (typeof header.attr === 'function' ? (header.attr('data-pack') || header.closest('[data-pack]').attr('data-pack')) : null);
            const pack = game.packs?.get(packId);
            return !!pack;
        },
        callback: (header) => {
            const el = header instanceof HTMLElement ? header : (header[0] || header);
            const packId = el?.dataset?.pack || (typeof header.attr === 'function' ? (header.attr('data-pack') || header.closest('[data-pack]').attr('data-pack')) : null);
            const pack = game.packs?.get(packId);
            if (pack) {
                new TranslationStudioApp({ document: pack, isCompendium: true }).render(true);
            }
        }
    });
};

Hooks.on('getCompendiumEntryContextOptions', registerCompendiumDirectoryOptions);
Hooks.on('getCompendiumDirectoryEntryContext', registerCompendiumDirectoryOptions);

// Folder Context Options
const registerFolderDirectoryOptions = (entry, menuOptions) => {
    const labelFolder = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ContextTranslateFolder");
    if (menuOptions.some(o => o.name === labelFolder)) return;

    menuOptions.push({
        name: labelFolder,
        icon: '<i class="fas fa-folder-open"></i>',
        condition: (header) => {
            const el = header instanceof HTMLElement ? header : (header[0] || header);
            const folderId = el?.dataset?.folderId || (typeof header.attr === 'function' ? (header.attr('data-folder-id') || header.closest('[data-folder-id]').attr('data-folder-id')) : null);
            const folder = game.folders?.get(folderId);
            return !!folder;
        },
        callback: (header) => {
            const el = header instanceof HTMLElement ? header : (header[0] || header);
            const folderId = el?.dataset?.folderId || (typeof header.attr === 'function' ? (header.attr('data-folder-id') || header.closest('[data-folder-id]').attr('data-folder-id')) : null);
            const folder = game.folders?.get(folderId);
            if (folder) {
                const docs = Array.from(folder.contents || folder.documents || []);
                if (folder.getSubfolders) {
                    for (const sf of folder.getSubfolders(true)) {
                        docs.push(...Array.from(sf.contents || sf.documents || []));
                    }
                }
                const folderWrapper = {
                    isFolderWrapper: true,
                    name: folder.name,
                    id: folder.id,
                    type: folder.type,
                    documents: docs
                };
                new TranslationStudioApp({ document: folderWrapper, isFolder: true }).render(true);
            }
        }
    });
};

Hooks.on('getFolderDirectoryEntryContextOptions', registerFolderDirectoryOptions);
Hooks.on('getFolderDirectoryEntryContext', registerFolderDirectoryOptions);

// Red Header Buttons for Sheets & Applications (Vorlesetext)
Hooks.on('getJournalSheetHeaderButtons', (sheet, buttons) => {
    let enabled = true;
    try { enabled = game.settings.get(MODULE_ID, 'enableRedHeaderButton'); } catch(e) { enabled = false; }
    if (!enabled) return;
    buttons.unshift({
        label: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtn"),
        class: "universal-red-translate-btn",
        icon: "fas fa-bullhorn",
        onclick: () => {
            QuickSelectionTranslator.translateActiveSheetOrWindow(sheet);
        }
    });
});

Hooks.on('getJournalEntryPageSheetHeaderButtons', (sheet, buttons) => {
    let enabled = true;
    try { enabled = game.settings.get(MODULE_ID, 'enableRedHeaderButton'); } catch(e) { enabled = false; }
    if (!enabled) return;
    buttons.unshift({
        label: game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtn"),
        class: "universal-red-translate-btn",
        icon: "fas fa-bullhorn",
        onclick: () => {
            QuickSelectionTranslator.translateActiveSheetOrWindow(sheet);
        }
    });
});

Hooks.on('renderApplication', (app, html) => {
    let enabled = true;
    try { enabled = game.settings.get(MODULE_ID, 'enableRedHeaderButton'); } catch(e) { enabled = false; }
    if (!enabled) return;
    const el = html instanceof HTMLElement ? html : html?.[0];
    if (!el) return;
    if (app instanceof TranslationStudioApp || app instanceof CampaignAuditorApp) return;

    const header = el.querySelector('.window-header');
    if (header && !header.querySelector('.universal-red-translate-btn')) {
        const btn = document.createElement('a');
        btn.className = 'header-button control universal-red-translate-btn';
        btn.title = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtnTitle");
        btn.innerHTML = `<i class="fas fa-bullhorn" style="color: #ff5252; text-shadow: 0 0 6px rgba(255, 82, 82, 0.6);"></i> ${game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtn")}`;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            QuickSelectionTranslator.translateActiveSheetOrWindow(app, el);
        });
        const closeBtn = header.querySelector('.close');
        if (closeBtn) header.insertBefore(btn, closeBtn);
        else header.appendChild(btn);
    }
});

Hooks.on('renderApplicationV2', (app, html) => {
    let enabled = true;
    try { enabled = game.settings.get(MODULE_ID, 'enableRedHeaderButton'); } catch(e) { enabled = false; }
    if (!enabled) return;
    const el = html instanceof HTMLElement ? html : html?.[0];
    if (!el) return;
    if (app instanceof TranslationStudioApp || app instanceof CampaignAuditorApp) return;

    const header = el.querySelector('.window-header');
    if (header && !header.querySelector('.universal-red-translate-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'header-control universal-red-translate-btn';
        btn.title = game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.UI.ReadAloudBtnTitle");
        btn.innerHTML = `<i class="fa-solid fa-bullhorn" style="color: #ff5252;"></i>`;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            QuickSelectionTranslator.translateActiveSheetOrWindow(app, el);
        });
        const closeBtn = header.querySelector('[data-action="close"]');
        if (closeBtn) header.insertBefore(btn, closeBtn);
        else header.appendChild(btn);
    }
});
