const MODULE_ID = "phils-universal-translator";

/**
 * TranslationDatabase
 * Manages the physical and in-memory translation storage for any system.
 * Bridges 'translations/universal-de.json' and Foundry World settings.
 * Stores all German translations non-destructively without modifying original English documents.
 */
export class TranslationDatabase {
    static MODULE_ID = MODULE_ID;
    static JSON_PATH = `modules/${MODULE_ID}/translations/universal-de.json`;
    static SETTING_KEY = "translationMemory";
    static cache = new Map();
    static isInitialized = false;

    /**
     * Stable hash of content to detect changes made by official updates.
     * @param {string} text 
     * @returns {string}
     */
    static hashContent(text) {
        if (!text || typeof text !== 'string') return "empty";
        const clean = text.replace(/\s+/g, ' ').trim();
        let hash = 0;
        for (let i = 0; i < clean.length; i++) {
            const chr = clean.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return `h_${Math.abs(hash).toString(36)}`;
    }

    /**
     * Splits HTML content into distinct logical paragraphs/blocks for fine-grained drift matching.
     * @param {string} html 
     * @returns {Array<{ tag: string, content: string, hash: string }>}
     */
    static splitParagraphs(html) {
        if (!html || typeof html !== 'string') return [];
        const blocks = [];
        const regex = /<(p|li|blockquote|section|h[1-6]|div)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const tag = match[1].toLowerCase();
            const content = match[2].trim();
            if (content) {
                blocks.push({
                    tag,
                    content,
                    hash: this.hashContent(content)
                });
            }
        }
        return blocks;
    }

    /**
     * Initializes the Translation Database:
     * 1. Loads translations/universal-de.json from disk.
     * 2. Migrates and merges existing world settings.
     * 3. Syncs and populates cache.
     */
    static async initialize() {
        this.cache.clear();

        // 1. Try loading from bundled JSON file
        try {
            const res = await fetch(this.JSON_PATH + `?v=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                const entries = data.entries || data;
                for (const [key, val] of Object.entries(entries)) {
                    if (val && typeof val === 'object') {
                        this.cache.set(key, val);
                        if (val.id && val.id !== key) this.cache.set(val.id, val);
                        if (val.uuid && val.uuid !== key) this.cache.set(val.uuid, val);
                    }
                }
                console.log(`Phil's Universal Translator | ${this.cache.size} Übersetzungen aus universal-de.json geladen.`);
            }
        } catch (err) {
            console.warn("Phil's Universal Translator | universal-de.json konnte nicht direkt geladen werden, verwende World-Store:", err);
        }

        // 2. Load and merge World Settings
        try {
            const worldMem = game.settings.get(MODULE_ID, this.SETTING_KEY) || {};
            for (const [key, val] of Object.entries(worldMem)) {
                if (!val) continue;
                const entry = {
                    id: val.id || key,
                    uuid: val.uuid || key,
                    docName: val.docName || "",
                    name: val.name || "",
                    text: val.text || val.transText || "",
                    system: val.system || val.transSystem || null,
                    sourceHash: val.sourceHash || val.origHash || (val.sourceText || val.origText ? this.hashContent(val.sourceText || val.origText) : ""),
                    sourceText: val.sourceText || val.origText || "",
                    type: val.type || "JournalEntryPage",
                    updatedAt: val.savedAt || val.updatedAt || Date.now()
                };

                this.cache.set(key, entry);
                if (entry.id && entry.id !== key) this.cache.set(entry.id, entry);
                if (entry.uuid && entry.uuid !== key) this.cache.set(entry.uuid, entry);
            }
        } catch (e) {
            console.error("Phil's Universal Translator | Fehler beim Laden der World-Übersetzungen:", e);
        }

        this.isInitialized = true;
    }

    /**
     * Gets a stored translation for a document, page, or UUID.
     * @param {Document|string} docOrKey
     * @returns {object|null}
     */
    static get(docOrKey) {
        if (!docOrKey) return null;
        if (typeof docOrKey === 'string') {
            return this.cache.get(docOrKey) || null;
        }

        const uuid = docOrKey.uuid;
        const id = docOrKey.id || docOrKey._id;

        if (uuid && this.cache.has(uuid)) return this.cache.get(uuid);
        if (id && this.cache.has(id)) return this.cache.get(id);

        return null;
    }

    /**
     * Sets or updates a translation in memory and world storage.
     * @param {string} key
     * @param {object} entry
     */
    static async set(key, entry) {
        if (!key || !entry) return;
        this.cache.set(key, entry);
        if (entry.id && entry.id !== key) this.cache.set(entry.id, entry);
        if (entry.uuid && entry.uuid !== key) this.cache.set(entry.uuid, entry);

        try {
            const worldMem = game.settings.get(MODULE_ID, this.SETTING_KEY) || {};
            worldMem[key] = entry;
            await game.settings.set(MODULE_ID, this.SETTING_KEY, worldMem);
        } catch (e) {
            console.error("Phil's Universal Translator | Fehler beim Speichern in World-Store:", e);
        }
    }
}
