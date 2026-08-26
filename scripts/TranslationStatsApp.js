import { MODULE_ID } from './TranslationLogic.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class TranslationStatsApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "universal-translation-stats",
        tag: "form",
        window: {
            title: "Universal Übersetzungs-Statistik",
            icon: "fas fa-chart-line",
            resizable: true,
            contentClasses: ["universal-translator-window", "standard-form"]
        },
        position: {
            width: 460,
            height: 400
        },
        form: {
            closeOnSubmit: true
        }
    };

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/translation-stats.hbs`
        }
    };

    constructor(options = {}) {
        super(options);
        this.stats = options.stats || {
            translatedWords: "0",
            grammarWords: "0",
            hoursTranslation: "0.0",
            hoursGrammar: "0.0",
            hoursSaved: "0.0"
        };
    }

    async _prepareContext(_options) {
        return {
            stats: this.stats
        };
    }
}
