import { MODULE_ID } from './TranslationLogic.js';

/**
 * Translation Memory & Update Synchronization Service.
 * Manages translation snapshots, content hash verification,
 * JSON export/import backups, and delta comparison after system/adventure updates.
 */
export class TranslationMemory {
    static SETTING_KEY = "translationMemory";

    /**
     * Computes a stable hash of text content for comparison.
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
            hash |= 0; // Convert to 32bit integer
        }
        return `h_${Math.abs(hash).toString(36)}`;
    }

    /**
     * Loads the stored Translation Memory dictionary from world settings.
     * @returns {object}
     */
    static loadMemory() {
        try {
            const data = game.settings.get(MODULE_ID, this.SETTING_KEY);
            return (typeof data === 'object' && data !== null) ? data : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Saves the Translation Memory dictionary to world settings.
     * @param {object} memory
     */
    static async saveMemory(memory) {
        try {
            await game.settings.set(MODULE_ID, this.SETTING_KEY, memory);
        } catch (e) {
            console.error("Phil's Universal Translator | Failed to save Translation Memory:", e);
        }
    }

    /**
     * Clears all stored entries from Translation Memory.
     */
    static async clearMemory() {
        await this.saveMemory({});
    }

    /**
     * Records or updates a translated page/item/actor in the Translation Memory.
     * @param {object} params
     */
    static async recordTranslation({ id, uuid, docName, name, origName, origText, transText, origSystem, transSystem, type }) {
        if (!id && !uuid) return;
        const key = uuid || id;
        const memory = this.loadMemory();

        memory[key] = {
            id,
            uuid: key,
            docName: docName || "",
            name: name || "",
            origName: origName || "",
            origHash: this.hashContent(origText || ""),
            origText: origText || "",
            transText: transText || "",
            origSystem: origSystem || null,
            transSystem: transSystem || null,
            type: type || "JournalEntryPage",
            systemId: game.system?.id || "generic",
            systemVersion: game.system?.version || "1.0.0",
            savedAt: Date.now()
        };

        await this.saveMemory(memory);
    }

    /**
     * Exports all stored translations as a downloadable JSON file.
     */
    static exportToFile() {
        const memory = this.loadMemory();
        const totalEntries = Object.keys(memory).length;

        if (totalEntries === 0) {
            ui.notifications.warn("Das Translation Memory ist noch leer. Übersetze zuerst ein paar Seiten oder Dokumente!");
            return;
        }

        const exportData = {
            module: MODULE_ID,
            version: game.modules.get(MODULE_ID)?.version || "1.0.0",
            systemId: game.system?.id || "generic",
            systemVersion: game.system?.version || "1.0.0",
            exportedAt: new Date().toISOString(),
            totalEntries: totalEntries,
            entries: memory
        };

        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const dateStr = new Date().toISOString().split("T")[0];
        a.href = url;
        a.download = `universal-translation-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        ui.notifications.success(`Übersetzungs-Backup erfolgreich exportiert (${totalEntries} Einträge gesichert)!`);
    }

    /**
     * Imports a previously exported Translation Memory JSON file.
     * @param {string} jsonText
     * @returns {Promise<{success: boolean, importedCount: number}>}
     */
    static async importFromFile(jsonText) {
        try {
            const data = JSON.parse(jsonText);
            const incomingEntries = data.entries || data;
            if (!incomingEntries || typeof incomingEntries !== 'object') {
                return { success: false, error: "Ungültiges Übersetzungs-Backup-Format." };
            }

            const currentMemory = this.loadMemory();
            let count = 0;

            for (const [k, v] of Object.entries(incomingEntries)) {
                if (v && (v.transText || v.name)) {
                    currentMemory[k] = { ...currentMemory[k], ...v };
                    count++;
                }
            }

            await this.saveMemory(currentMemory);
            return { success: true, importedCount: count };
        } catch (e) {
            return { success: false, error: `Import fehlgeschlagen: ${e.message}` };
        }
    }

    /**
     * Compares the current world/compendium documents against the Translation Memory.
     * @param {Array<Document>} targetJournals
     * @returns {object}
     */
    static analyzeSmartSync(targetJournals) {
        const memory = this.loadMemory();
        const autoApplicable = [];
        const modifiedByDevs = [];
        const newUnseen = [];

        for (const journal of targetJournals) {
            for (const page of (journal.pages || [])) {
                const key = page.uuid || page.id;
                const tmRecord = memory[key] || memory[page.id];
                const currentText = page.text?.content || "";
                const currentHash = this.hashContent(currentText);

                if (!tmRecord) {
                    newUnseen.push({
                        journalId: journal.id,
                        journalName: journal.name,
                        pageId: page.id,
                        pageName: page.name,
                        type: page.type
                    });
                } else if (currentHash === tmRecord.origHash || (currentText === tmRecord.origText)) {
                    // Exact match!
                    autoApplicable.push({
                        journalId: journal.id,
                        journalName: journal.name,
                        pageId: page.id,
                        pageName: page.name,
                        germanName: tmRecord.name,
                        germanText: tmRecord.transText,
                        germanSystem: tmRecord.transSystem,
                        type: page.type
                    });
                } else {
                    // Modified in update
                    modifiedByDevs.push({
                        journalId: journal.id,
                        journalName: journal.name,
                        pageId: page.id,
                        pageName: page.name,
                        germanName: tmRecord.name,
                        germanText: tmRecord.transText,
                        germanSystem: tmRecord.transSystem,
                        oldOrigText: tmRecord.origText,
                        newOrigText: currentText,
                        savedGermanText: tmRecord.transText,
                        type: page.type
                    });
                }
            }
        }

        return {
            autoApplicable,
            autoCount: autoApplicable.length,
            modifiedByDevs,
            modifiedCount: modifiedByDevs.length,
            newUnseen,
            newCount: newUnseen.length
        };
    }

    /**
     * 1-Click Applies all exact matching translations from memory onto the world journals.
     * @param {Array<object>} autoApplicableList
     * @returns {Promise<number>}
     */
    static async applyAutoMatches(autoApplicableList) {
        if (!autoApplicableList || autoApplicableList.length === 0) return 0;

        const journalMap = new Map();
        for (const item of autoApplicableList) {
            if (!journalMap.has(item.journalId)) journalMap.set(item.journalId, []);
            journalMap.get(item.journalId).push(item);
        }

        let appliedCount = 0;
        for (const [journalId, items] of journalMap.entries()) {
            const journal = game.journal.get(journalId);
            if (!journal) continue;

            const updates = items.map(item => {
                const u = {
                    _id: item.pageId,
                    name: item.germanName,
                    [`flags.${MODULE_ID}.aiProcessed`]: true,
                    [`flags.${MODULE_ID}.aiProcessedAt`]: Date.now()
                };
                if (item.germanText) u["text.content"] = item.germanText;
                if (item.germanSystem) {
                    for (const [k, v] of Object.entries(item.germanSystem)) {
                        u[`system.${k}`] = v;
                    }
                }
                return u;
            });

            if (updates.length > 0) {
                await journal.updateEmbeddedDocuments("JournalEntryPage", updates);
                appliedCount += updates.length;
            }
        }

        return appliedCount;
    }
}
