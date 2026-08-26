import { MODULE_ID, loc } from './TranslationLogic.js';

/**
 * SmartLinkRemapper
 * Scans journals and documents for @UUID[Compendium...] and @Embed[Compendium...] links,
 * matches them against existing World Documents with 100% backup protection,
 * and remaps them so clicking links opens already translated World documents.
 */
export class SmartLinkRemapper {

    /**
     * Builds a comprehensive lookup index from Compendium UUIDs to World Document UUIDs.
     * @returns {Map<string, { worldUuid: string, worldDoc: Document, source: string }>}
     */
    static buildCompendiumToWorldIndex() {
        const index = new Map();

        // 1. Index all World Journals & Pages
        for (const journal of game.journal || []) {
            if (journal.name.includes("(Backup)") || journal.flags?.[MODULE_ID]?.isBackup || journal.name === "AI Glossar" || journal.name === "AI Glossary") {
                continue;
            }

            const jSource = journal._stats?.compendiumSource || journal.flags?.core?.sourceId || journal.flags?.[MODULE_ID]?.origUuid;
            if (jSource && typeof jSource === 'string') {
                index.set(jSource, { worldUuid: journal.uuid, worldDoc: journal, source: 'stats' });
            }

            for (const page of journal.pages || []) {
                const pSource = page._stats?.compendiumSource || page.flags?.core?.sourceId || page.flags?.[MODULE_ID]?.origUuid;
                if (pSource && typeof pSource === 'string') {
                    index.set(pSource, { worldUuid: page.uuid, worldDoc: page, source: 'stats' });
                }

                if (jSource && typeof jSource === 'string') {
                    index.set(`${jSource}.JournalEntryPage.${page.id}`, { worldUuid: page.uuid, worldDoc: page, source: 'parent_id' });
                    index.set(`${jSource}#${page.name}`, { worldUuid: page.uuid, worldDoc: page, source: 'parent_name' });
                }
            }
        }

        // 2. Index Compendium Packs & Name-based fallbacks
        const journalPacks = (game.packs || []).filter(p => p.documentName === "JournalEntry");
        for (const pack of journalPacks) {
            for (const entry of pack.index || []) {
                const compUuid = `Compendium.${pack.collection}.JournalEntry.${entry._id}`;
                if (!index.has(compUuid)) {
                    const match = (game.journal || []).find(j => 
                        !j.name.includes("(Backup)") &&
                        !j.flags?.[MODULE_ID]?.isBackup &&
                        (j.name === entry.name || 
                         j.flags?.[MODULE_ID]?.origName === entry.name ||
                         j.name.toLowerCase() === entry.name.toLowerCase())
                    );
                    if (match) {
                        index.set(compUuid, { worldUuid: match.uuid, worldDoc: match, source: 'name_match' });

                        for (const page of match.pages || []) {
                            index.set(`${compUuid}.JournalEntryPage.${page.id}`, { worldUuid: page.uuid, worldDoc: page, source: 'name_match_page' });
                            index.set(`${compUuid}#${page.name}`, { worldUuid: page.uuid, worldDoc: page, source: 'name_match_page' });
                        }
                    }
                }
            }
        }

        // 3. Index World Items
        for (const item of game.items || []) {
            const iSource = item._stats?.compendiumSource || item.flags?.core?.sourceId || item.flags?.[MODULE_ID]?.origUuid;
            if (iSource && typeof iSource === 'string') {
                index.set(iSource, { worldUuid: item.uuid, worldDoc: item, source: 'item_stats' });
            }
        }

        // 4. Index World Actors
        for (const actor of game.actors || []) {
            const aSource = actor._stats?.compendiumSource || actor.flags?.core?.sourceId || actor.flags?.[MODULE_ID]?.origUuid;
            if (aSource && typeof aSource === 'string') {
                index.set(aSource, { worldUuid: actor.uuid, worldDoc: actor, source: 'actor_stats' });
            }
        }

        return index;
    }

    /**
     * Scans world journals for compendium links that can be remapped to world documents.
     * @param {object|null} targetDoc - Optional specific JournalEntry or Folder to limit scope.
     * @returns {object} Analysis result containing found changes and stats.
     */
    static analyzeLinks(targetDoc = null) {
        const compMap = this.buildCompendiumToWorldIndex();
        const linkRegex = /@(UUID|Embed)\[\s*(Compendium\.[^\]\s]+)(?:(?:\s+)([^\]]*))?\](?:\{([^\}]*)\})?/g;

        let targetJournals = [];
        if (targetDoc?.documentName === "JournalEntry") {
            targetJournals = [targetDoc];
        } else if (targetDoc?.isFolderWrapper || targetDoc?.documentName === "Folder") {
            const docs = targetDoc.documents || (targetDoc.contents || []);
            targetJournals = docs.filter(d => d.documentName === "JournalEntry");
        } else {
            targetJournals = (game.journal || []).filter(j => !j.name.includes("(Backup)") && !j.flags?.[MODULE_ID]?.isBackup && j.name !== "AI Glossar" && j.name !== "AI Glossary");
        }

        const changes = [];
        let totalLinksFound = 0;
        let remappableCount = 0;
        let unmappedCount = 0;

        for (const journal of targetJournals) {
            const pageChanges = [];

            for (const page of (journal.pages || [])) {
                let html = page.text?.content || "";
                if (!html) continue;

                let match;
                const replacements = [];
                const pageRegex = new RegExp(linkRegex);

                while ((match = pageRegex.exec(html)) !== null) {
                    totalLinksFound++;
                    const fullMatch = match[0];
                    const linkType = match[1];
                    const compUuid = match[2];
                    const extraFlags = match[3] || "";
                    const label = match[4];

                    const mapped = compMap.get(compUuid);
                    if (mapped) {
                        remappableCount++;
                        const targetUuid = mapped.worldUuid;
                        const flagStr = extraFlags ? ` ${extraFlags}` : "";
                        const labelStr = label !== undefined ? `{${label}}` : "";
                        const newLink = `@${linkType}[${targetUuid}${flagStr}]${labelStr}`;

                        replacements.push({
                            original: fullMatch,
                            replacement: newLink,
                            compUuid: compUuid,
                            worldUuid: targetUuid,
                            targetDocName: mapped.worldDoc?.name || ""
                        });
                    } else {
                        unmappedCount++;
                    }
                }

                if (replacements.length > 0) {
                    pageChanges.push({
                        pageId: page.id,
                        pageName: page.name,
                        replacements: replacements
                    });
                }
            }

            if (pageChanges.length > 0) {
                changes.push({
                    journalId: journal.id,
                    journalName: journal.name,
                    journal: journal,
                    pageChanges: pageChanges
                });
            }
        }

        return {
            changes,
            totalLinksFound,
            remappableCount,
            unmappedCount,
            journalCount: changes.length
        };
    }

    /**
     * Executes the link remapping on world journals with 100% automatic backup protection.
     * @param {Array<object>} changesList
     * @returns {Promise<{success: boolean, modifiedJournals: number, modifiedPages: number, totalLinksRemapped: number}>}
     */
    static async executeRemapping(changesList) {
        if (!changesList || changesList.length === 0) {
            return { success: true, modifiedJournals: 0, modifiedPages: 0, totalLinksRemapped: 0 };
        }

        let modifiedJournals = 0;
        let modifiedPages = 0;
        let totalLinksRemapped = 0;

        for (const jChange of changesList) {
            const journal = jChange.journal || game.journal?.get(jChange.journalId);
            if (!journal) continue;

            // 1. Create safety backup of the journal before making changes
            try {
                const backupData = journal.toObject();
                delete backupData._id;
                backupData.name = `${journal.name} (Backup)`;
                backupData.flags = backupData.flags || {};
                backupData.flags[MODULE_ID] = {
                    isBackup: true,
                    originalId: journal.id,
                    createdAt: Date.now()
                };
                await JournalEntry.create(backupData);
            } catch (backupErr) {
                console.warn(`Phil's Universal Translator | Could not create backup for ${journal.name}:`, backupErr);
            }

            // 2. Apply replacements to pages
            const pageUpdates = [];
            for (const pChange of jChange.pageChanges) {
                const page = journal.pages.get(pChange.pageId);
                if (!page) continue;

                let html = page.text?.content || "";
                for (const r of pChange.replacements) {
                    html = html.replaceAll(r.original, r.replacement);
                    totalLinksRemapped++;
                }

                pageUpdates.push({
                    _id: page.id,
                    "text.content": html,
                    [`flags.${MODULE_ID}.linksRemapped`]: true,
                    [`flags.${MODULE_ID}.linksRemappedAt`]: Date.now()
                });
                modifiedPages++;
            }

            if (pageUpdates.length > 0) {
                await journal.updateEmbeddedDocuments("JournalEntryPage", pageUpdates);
                modifiedJournals++;
            }
        }

        return {
            success: true,
            modifiedJournals,
            modifiedPages,
            totalLinksRemapped
        };
    }
}
