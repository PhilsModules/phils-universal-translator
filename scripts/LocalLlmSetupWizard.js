import { LocalLlmClient } from './LocalLlmClient.js';
import { MODULE_ID } from './TranslationLogic.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * LocalLlmSetupWizard
 * Onboarding and configuration interface for local LLMs (Ollama / LocalAI / LM Studio).
 */
export class LocalLlmSetupWizard extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "universal-local-llm-wizard",
        tag: "form",
        window: {
            title: "PHILS_UNIVERSAL_TRANSLATE.Wizard.WindowTitle",
            icon: "fa-solid fa-server",
            resizable: true,
            contentClasses: ["universal-translator-window", "universal-wizard-window"]
        },
        position: {
            width: 680,
            height: 720
        },
        form: {
            handler: LocalLlmSetupWizard.myFormHandler,
            closeOnSubmit: false
        },
        actions: {
            testConnection: function(event, target) { return this.onTestConnection(event, target); },
            saveAndClose: function(event, target) { return this.onSaveAndClose(event, target); },
            skipWizard: function(event, target) { return this.onSkipWizard(event, target); }
        }
    };

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/local-llm-setup.hbs`
        }
    };

    constructor(options = {}) {
        super(options);
        this.endpoint = game.settings.get(MODULE_ID, 'localLlmEndpoint') || "http://localhost:11434";
        this.model = game.settings.get(MODULE_ID, 'localLlmModel') || "llama3";
        this.availableModels = [];
        this.isConnected = false;
        this.statusMessage = "";
    }

    static async myFormHandler(event, form, formData) {
        // Handled via actions
    }

    async _prepareContext(_options) {
        return {
            endpoint: this.endpoint,
            model: this.model,
            availableModels: this.availableModels,
            isConnected: this.isConnected,
            statusMessage: this.statusMessage
        };
    }

    async onTestConnection(event, target) {
        const input = this.element?.querySelector('#wizard-endpoint-input');
        if (input && input.value) {
            this.endpoint = input.value.trim();
        }

        const modelSelect = this.element?.querySelector('#wizard-model-select');
        const modelInput = this.element?.querySelector('#wizard-model-input');
        if (modelSelect) this.model = modelSelect.value;
        else if (modelInput) this.model = modelInput.value.trim();

        ui.notifications.info(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Wizard.TestingConnection"));

        const res = await LocalLlmClient.testConnection(this.endpoint);
        if (res.success) {
            this.isConnected = true;
            this.availableModels = res.models || [];
            if (this.availableModels.length > 0 && !this.availableModels.includes(this.model)) {
                this.model = this.availableModels[0];
            }
            this.statusMessage = game.i18n.format("PHILS_UNIVERSAL_TRANSLATE.Wizard.TestSuccess", {
                server: res.serverType === "ollama" ? "Ollama" : "Local OpenAI Compatible",
                count: this.availableModels.length
            });
        } else {
            this.isConnected = false;
            this.availableModels = [];
            this.statusMessage = res.error || game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Wizard.TestFailed");
        }

        this.render(false);
    }

    async onSaveAndClose(event, target) {
        const input = this.element?.querySelector('#wizard-endpoint-input');
        if (input && input.value) {
            this.endpoint = input.value.trim();
        }

        const modelSelect = this.element?.querySelector('#wizard-model-select');
        const modelInput = this.element?.querySelector('#wizard-model-input');
        if (modelSelect) this.model = modelSelect.value;
        else if (modelInput) this.model = modelInput.value.trim();

        await game.settings.set(MODULE_ID, 'localLlmEndpoint', this.endpoint);
        await game.settings.set(MODULE_ID, 'localLlmModel', this.model);
        await game.settings.set(MODULE_ID, 'firstRunWizardCompleted', true);

        ui.notifications.success(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Wizard.ConfigSaved"));
        this.close();
    }

    async onSkipWizard(event, target) {
        await game.settings.set(MODULE_ID, 'firstRunWizardCompleted', true);
        ui.notifications.info(game.i18n.localize("PHILS_UNIVERSAL_TRANSLATE.Wizard.ManualModeActive"));
        this.close();
    }
}
