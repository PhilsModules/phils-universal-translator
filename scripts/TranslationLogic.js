export const MODULE_ID = "phils-universal-translator";
console.log("Phil's Universal Translator | Logic initialized");

import { UniversalGlossary } from "./UniversalGlossary.js";
import { TermReplacer } from "./TermReplacer.js";
import { LinkProtection } from "./LinkProtection.js";
import { TranslationDatabase } from "./TranslationDatabase.js";

/**
 * Resolves an embedded Foundry document by its UUID string synchronously.
 * @param {string} uuidStr
 * @returns {Document|null}
 */
export function resolveEmbedDocument(uuidStr) {
    if (!uuidStr || typeof uuidStr !== 'string') return null;
    try {
        if (typeof globalThis.fromUuidSync === 'function') {
            const doc = globalThis.fromUuidSync(uuidStr);
            if (doc) return doc;
        }
    } catch (e) { }

    try {
        const parts = uuidStr.split('.');
        if (parts[0] === 'JournalEntry' && parts.length >= 2) {
            const journal = game.journal?.get(parts[1]);
            if (journal) {
                if (parts.length >= 4 && parts[2] === 'JournalEntryPage') {
                    return journal.pages?.get(parts[3]) || null;
                }
                return journal;
            }
        }
    } catch (e) { }
    return null;
}

/**
 * Scans HTML content for @Embed[UUID ...] tags and extracts their real text and system fields.
 * @param {string} content
 * @returns {Array<object>}
 */
export function extractEmbedsFromContent(content) {
    if (!content || typeof content !== 'string') return [];
    const embeds = [];
    const embedRegex = /@Embed\[\s*([a-zA-Z0-9_\.\-]+)(?:(?:\s+)([^\]]*))?\]/gi;
    let match;
    const seen = new Set();

    while ((match = embedRegex.exec(content)) !== null) {
        const uuid = match[1];
        if (seen.has(uuid)) continue;
        seen.add(uuid);

        if (!uuid.startsWith('JournalEntry.') && !uuid.startsWith('Compendium.')) {
            continue;
        }

        const targetDoc = resolveEmbedDocument(uuid);
        if (targetDoc && (targetDoc.documentName === "JournalEntryPage" || targetDoc.documentName === "JournalEntry")) {
            const embedObj = {
                uuid: uuid,
                name: targetDoc.name,
                type: targetDoc.type || "JournalEntryPage"
            };

            if (targetDoc.text && typeof targetDoc.text.content === 'string' && targetDoc.text.content.trim()) {
                embedObj.text = { content: targetDoc.text.content };
            }

            if (targetDoc.system && typeof targetDoc.system === 'object') {
                embedObj.system = {};
                const transKeys = ['overview', 'exposition', 'summary', 'caption', 'edict', 'subtitle', 'description'];
                for (const k of transKeys) {
                    if (typeof targetDoc.system[k] === 'string' && targetDoc.system[k].trim()) {
                        embedObj.system[k] = targetDoc.system[k];
                    }
                }
                if (targetDoc.system.description?.value) {
                    embedObj.system.description = { value: targetDoc.system.description.value };
                }
                if (Object.keys(embedObj.system).length === 0) delete embedObj.system;
            }

            embeds.push(embedObj);
        }
    }
    return embeds;
}

/**
 * Calculates translation stats across all journals, items, and compendiums in the world.
 * @returns {Promise<object>}
 */
export async function calculateTranslationStats() {
    let translatedWords = 0;
    let grammarWords = 0;

    const countWords = (str) => {
        if (!str || typeof str !== 'string') return 0;
        return str.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).filter(w => w.length > 0).length;
    };

    // 1. World Journals
    const journals = game.journal || [];
    for (const journal of journals) {
        for (const page of (journal.pages || [])) {
            const flags = page.flags?.[MODULE_ID] || {};
            if (!flags.aiProcessed && !flags.aiGrammarChecked) continue;

            let text = "";
            if (page.text?.content) text += " " + page.text.content;
            if (page.system) {
                if (page.system.overview) text += " " + page.system.overview;
                if (page.system.description) text += " " + (typeof page.system.description === 'string' ? page.system.description : (page.system.description.value || ""));
            }

            const w = countWords(text);
            if (flags.aiProcessed) translatedWords += w;
            if (flags.aiGrammarChecked) grammarWords += w;
        }
    }

    // 2. World Items
    const items = game.items || [];
    for (const item of items) {
        const flags = item.flags?.[MODULE_ID] || {};
        if (flags.aiProcessed) {
            const desc = (typeof item.system?.description === 'string') ? item.system.description : (item.system?.description?.value || "");
            translatedWords += countWords(item.name) + countWords(desc);
        }
    }

    const timeTranslation = translatedWords / 300;
    const timeGrammar = grammarWords / 1000;
    const totalHours = timeTranslation + timeGrammar;

    return {
        translatedWords: translatedWords.toLocaleString(),
        grammarWords: grammarWords.toLocaleString(),
        hoursTranslation: timeTranslation.toFixed(1),
        hoursGrammar: timeGrammar.toFixed(1),
        hoursSaved: totalHours.toFixed(1)
    };
}

export function formatString(str, data = {}) {
    if (!str) return "";
    if (Array.isArray(str)) str = str.join("\n");
    for (const [k, v] of Object.entries(data)) {
        str = str.replace(new RegExp(`{${k}}`, 'g'), v || "");
    }
    return str;
}

export const loc = (key, data = {}) => {
    const i18nKey = `PHILS_UNIVERSAL_TRANSLATE.UI.${key}`;
    if (game.i18n.has(i18nKey)) return game.i18n.format(i18nKey, data);
    return null;
};

export function resolvePrompt(key, data) {
    const i18nKey = `PHILS_UNIVERSAL_TRANSLATE.Prompts.${key}`;
    let rawText = foundry.utils.getProperty(game.i18n.translations, i18nKey);
    if (!rawText && game.i18n._fallback) {
        rawText = foundry.utils.getProperty(game.i18n._fallback, i18nKey);
    }
    if (!rawText) rawText = game.i18n.localize(i18nKey);
    if (!rawText || rawText === i18nKey) return "";
    return formatString(rawText, data);
}

export const MOJIBAKE_MAP = [
    [/Ã¤/g, 'ä'], [/Ã¶/g, 'ö'], [/Ã¼/g, 'ü'],
    [/Ã„/g, 'Ä'], [/Ã–/g, 'Ö'], [/Ãœ/g, 'Ü'],
    [/ÃŸ/g, 'ß'],
    [/â€”/g, '—'], [/â€“/g, '–'],
    [/â€™/g, '’'], [/â€˜/g, '‘'],
    [/â€œ/g, '“'], [/â€\x9d/g, '”'], [/â€\x9c/g, '“'],
    [/â€\xa0/g, ' '], [/â€¢/g, '•'], [/â€¦/g, '…'],
    [/Ã©/g, 'é'], [/Ã¨/g, 'è'], [/Ã\xa0/g, 'à'], [/Ã¡/g, 'á'],
    [/Ã³/g, 'ó'], [/Ã²/g, 'ò'], [/Ãº/g, 'ú'], [/Ã¹/g, 'ù'],
    [/Ã®/g, 'î'], [/Ã¯/g, 'ï'], [/Ã«/g, 'ë'], [/Ãª/g, 'ê'],
    [/Ã§/g, 'ç'], [/Ã±/g, 'ñ'], [/Ã¢/g, 'â'], [/Ã´/g, 'ô'],
    [/Ã»/g, 'û'], [/Â°/g, '°'], [/Â«/g, '«'], [/Â»/g, '»'],
    [/Â/g, ''],
    [/obersicht/gi, 'Übersicht'],
    [/GeschǬtzter/gi, 'Geschützter'],
    [/TrǬmmer/gi, 'Trümmer'],
    [/DarǬber/gi, 'Darüber'],
    [/eingestǬrzte/gi, 'eingestürzte'],
    [/Krnkliche/gi, 'Kränkliche'],
    [/Dmmerflut/gi, 'Dämmerflut'],
    [/Zerstrung/gi, 'Zerstörung'],
    [/Ruber/gi, 'Räuber'],
    [/Ǭ/g, 'ü']
];

export function fixMojibake(str) {
    if (typeof str !== 'string' || !str) return str;
    let res = str;
    for (const [pattern, replacement] of MOJIBAKE_MAP) {
        res = res.replace(pattern, replacement);
    }
    return res;
}

export function detectMojibake(str) {
    if (typeof str !== 'string' || !str) {
        return { count: 0, samples: [], hasReplacementChars: false, replacementCount: 0, umlautCount: 0, hasUmlauts: false };
    }
    const mojibakeMatches = str.match(/Ã[¤¼¶„–œŸž¡¢£¥©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿]|â€[”™œ—–\xa0]/g) || [];
    const replacementMatches = str.match(/\ufffd/g) || [];
    const umlautMatches = str.match(/[äöüÄÖÜß]/g) || [];
    return {
        count: mojibakeMatches.length,
        samples: Array.from(new Set(mojibakeMatches)).slice(0, 5),
        hasReplacementChars: replacementMatches.length > 0,
        replacementCount: replacementMatches.length,
        umlautCount: umlautMatches.length,
        hasUmlauts: umlautMatches.length > 0
    };
}

export function extractMatchingGlossaryTerms(docData, dictionary, maxTerms = 60) {
    if (!docData || !dictionary || Object.keys(dictionary).length === 0) return [];
    
    const textBlob = JSON.stringify(docData).toLowerCase();
    const matching = [];

    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

    for (const eng of sortedKeys) {
        if (!eng || eng.length < 3) continue;
        const de = dictionary[eng];
        if (!de) continue;

        const escaped = eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(textBlob)) {
            matching.push({ original: eng, translation: de });
            if (matching.length >= maxTerms) break;
        }
    }

    return matching;
}

export function cleanAllArtifacts(obj) {
    if (typeof obj === 'string') {
        const cleaned = obj
            .replace(/###\s*(?:ANFANG|ENDE)\s+DES\s+PROMPTS\s*###/gi, "")
            .replace(/===\s*(?:ANFANG|ENDE)\s+DES\s+PROMPTS\s*===/gi, "")
            .replace(/\s?%%.*?%%/g, "")
            .replace(/\[\[\s*#?\d+\s*:\s*(.*?)\s*\]\]/g, "$1")
            .trim();
        return fixMojibake(cleaned);
    } else if (Array.isArray(obj)) {
        return obj.map(cleanAllArtifacts);
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            obj[key] = cleanAllArtifacts(obj[key]);
        }
        return obj;
    }
    return obj;
}

export async function injectGlossaryMarkers(docData) {
    const glossaryMap = new Map();
    const dictionary = await UniversalGlossary.loadDictionary();
    if (!dictionary || Object.keys(dictionary).length === 0) {
        return { processedData: docData, glossaryMap: glossaryMap };
    }

    const allGermanTerms = Object.values(dictionary);
    const uniqueTerms = [...new Set(allGermanTerms)].filter(t => t && t.length > 2);
    const terms = uniqueTerms.sort((a, b) => b.length - a.length);

    if (terms.length === 0) return { processedData: docData, glossaryMap: glossaryMap };

    let termCounter = 0;
    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "g");

    const processString = (text, scopeId) => {
        if (!text || typeof text !== 'string') return text;
        const parts = text.split(LinkProtection.FULL_PROTECTION_REGEX);
        return parts.map((part, index) => {
            if (index % 2 === 1) return part;
            return part.replace(regex, (match) => {
                termCounter++;
                const id = `#${termCounter}`;
                glossaryMap.set(id, { term: match, scopeId: scopeId });
                return `[[${id}:${match}]]`;
            });
        }).join("");
    };

    const injectInObject = (obj, currentScopeId = "root") => {
        let newScopeId = currentScopeId;
        if (typeof obj === 'object' && obj !== null && obj._id) {
            newScopeId = obj._id;
        }

        if (typeof obj === 'string') {
            return processString(obj, newScopeId);
        } else if (Array.isArray(obj)) {
            return obj.map(item => injectInObject(item, newScopeId));
        } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (key === "_id" || key === "type" || key === "identifier") continue;
                obj[key] = injectInObject(obj[key], newScopeId);
            }
            return obj;
        }
        return obj;
    };

    let processedData = foundry.utils.deepClone(docData);
    processedData = injectInObject(processedData);

    return { processedData, glossaryMap };
}

export async function injectOfficialTranslations(docData) {
    const dictionary = await UniversalGlossary.loadDictionary();
    if (!dictionary || Object.keys(dictionary).length === 0) return { docData, replacedTerms: [] };

    const processContent = (text) => {
        if (!text || typeof text !== 'string') return text;
        const result = TermReplacer.replaceTerms(text, dictionary, true);
        return result.text;
    };

    const injectInObject = (obj) => {
        if (typeof obj === 'string') {
            return processContent(obj);
        } else if (Array.isArray(obj)) {
            return obj.map(item => injectInObject(item));
        } else if (typeof obj === 'object' && obj !== null) {
            const res = {};
            for (const key in obj) {
                if (key === "_id" || key === "type" || key === "identifier" || key === "uuid" || key === "pack" || key === "img" || key === "src") {
                    res[key] = obj[key];
                } else {
                    res[key] = injectInObject(obj[key]);
                }
            }
            return res;
        }
        return obj;
    };

    return { docData: injectInObject(docData), replacedTerms: [] };
}

/**
 * Normalizes any Foundry Document (JournalEntry, Item, Actor, RollTable, etc.) into clean JSON.
 * @param {Document|object} doc
 * @param {boolean} isStudio
 * @returns {object}
 */
export function getCleanData(doc, isStudio = false) {
    if (!doc) return {};

    // 1. Single JournalEntryPage
    if (doc.documentName === "JournalEntryPage" || (doc.parent?.documentName === "JournalEntry" && doc.text)) {
        const clean = {
            _id: doc.id || doc._id,
            name: doc.name,
            type: doc.type || "text"
        };
        if (doc.text?.content) clean.text = { content: doc.text.content };
        if (doc.system && typeof doc.system === 'object') {
            clean.system = {};
            const keys = ['overview', 'exposition', 'summary', 'caption', 'edict', 'subtitle', 'description'];
            for (const k of keys) {
                if (typeof doc.system[k] === 'string' && doc.system[k].trim()) {
                    clean.system[k] = doc.system[k];
                }
            }
            if (doc.system.description?.value) {
                clean.system.description = { value: doc.system.description.value };
            }
            if (Object.keys(clean.system).length === 0) delete clean.system;
        }
        return clean;
    }

    // 2. Full JournalEntry
    if (doc.documentName === "JournalEntry" || (doc.pages && Array.isArray(Array.from(doc.pages)))) {
        const pagesList = Array.from(doc.pages || []);
        return {
            _id: doc.id || doc._id,
            name: doc.name,
            pages: pagesList.map(p => getCleanData(p, isStudio))
        };
    }

    // 3. Item (Weapon, Spell, Feat, Equipment, etc.)
    if (doc.documentName === "Item" || (doc.system && (doc.system.description !== undefined || doc.type))) {
        const clean = {
            _id: doc.id || doc._id,
            name: doc.name,
            type: doc.type || "item"
        };
        if (doc.system) {
            clean.system = {};
            if (typeof doc.system.description === 'string' && doc.system.description.trim()) {
                clean.system.description = doc.system.description;
            } else if (doc.system.description?.value) {
                clean.system.description = { value: doc.system.description.value };
            }
            if (doc.system.details && typeof doc.system.details === 'object') {
                clean.system.details = doc.system.details;
            }
            if (Object.keys(clean.system).length === 0) delete clean.system;
        }
        return clean;
    }

    // 4. Actor (NPC, Monster, Hazard)
    if (doc.documentName === "Actor") {
        const clean = {
            _id: doc.id || doc._id,
            name: doc.name,
            type: doc.type || "actor"
        };
        if (doc.system) {
            clean.system = {};
            if (doc.system.details?.biography?.value) {
                clean.system.details = { biography: { value: doc.system.details.biography.value } };
            } else if (typeof doc.system.biography === 'string') {
                clean.system.biography = doc.system.biography;
            }
            if (Object.keys(clean.system).length === 0) delete clean.system;
        }
        return clean;
    }

    // 5. Compendium Pack or Folder Wrapper
    if (doc.isFolderWrapper || doc.documents) {
        const docs = Array.from(doc.documents || []);
        return {
            name: doc.name,
            isFolder: true,
            pages: docs.map(d => getCleanData(d, isStudio))
        };
    }

    return foundry.utils.deepClone(doc);
}

/**
 * Splits items/pages into discrete character-bounded batches.
 * @param {Array<object>} items
 * @param {number} maxCapacity
 * @returns {Array<Array<object>>}
 */
export function createChunkedBatches(items, maxCapacity = 12000) {
    if (!items || items.length === 0) return [];
    const batches = [];
    let currentBatch = [];
    let currentSize = 0;

    for (const item of items) {
        const itemSize = JSON.stringify(item).length;
        if (currentSize + itemSize > maxCapacity && currentBatch.length > 0) {
            batches.push(currentBatch);
            currentBatch = [item];
            currentSize = itemSize;
        } else {
            currentBatch.push(item);
            currentSize += itemSize;
        }
    }

    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
}

/**
 * Smartly parses raw LLM text into valid JSON with comprehensive fallback repair.
 * @param {string} rawText
 * @returns {object}
 */
export function smartParseAiResponse(rawText) {
    if (!rawText || typeof rawText !== 'string') {
        throw new Error("Leere oder ungültige KI-Antwort erhalten.");
    }

    let cleaned = rawText.trim();

    // 1. Strip Markdown code blocks
    cleaned = cleaned.replace(/^```json\s*/i, "");
    cleaned = cleaned.replace(/^```\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");
    cleaned = cleaned.trim();

    // 2. Extract JSON payload between outer braces if text surrounds it
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    // 3. Fix common JSON malformations (trailing commas)
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

    // 4. Auto-fix Mojibake
    cleaned = fixMojibake(cleaned);

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch (err) {
        throw new Error(`JSON konnte nicht geparst werden: ${err.message}`);
    }

    return cleanAllArtifacts(parsed);
}

/**
 * Builds pre-apply diff comparison for Step 4 of the Studio.
 * @param {Document|object} originalDoc
 * @param {object} parsedResult
 * @returns {object}
 */
export function buildPreApplyDiff(originalDoc, parsedResult) {
    const diffs = [];

    const pages = parsedResult.pages || (parsedResult.items ? parsedResult.items : (Array.isArray(parsedResult) ? parsedResult : [parsedResult]));

    for (const page of pages) {
        if (!page) continue;
        const origPage = originalDoc.pages?.get?.(page._id || page.id) || (originalDoc.pages || []).find?.(p => p.id === (page._id || page.id)) || originalDoc;

        diffs.push({
            id: page._id || page.id,
            name: page.name || origPage?.name || "Unbenannt",
            origName: origPage?.name || page.name,
            origText: origPage?.text?.content || origPage?.system?.description || "",
            transText: page.text?.content || page.system?.description || "",
            type: page.type || "text"
        });
    }

    return {
        docName: parsedResult.name || originalDoc.name,
        diffs: diffs,
        newTerms: parsedResult.newTerms || [],
        aiNotes: parsedResult.aiNotes || []
    };
}

/**
 * Applies translations to target Foundry document with safe backups.
 * @param {Document} targetDoc
 * @param {object} parsedData
 * @returns {Promise<{success: boolean, backupDoc: Document|null}>}
 */
export async function applyResolvedUpdate(targetDoc, parsedData) {
    if (!targetDoc) throw new Error("Kein Ziel-Dokument angegeben.");

    // 1. Create safe backup of original document
    let backupDoc = null;
    try {
        if (targetDoc.documentName === "JournalEntry" && !targetDoc.name.includes("(Backup)")) {
            const backupData = targetDoc.toObject();
            delete backupData._id;
            backupData.name = `${targetDoc.name} (Backup)`;
            backupData.flags = backupData.flags || {};
            backupData.flags[MODULE_ID] = {
                isBackup: true,
                originalId: targetDoc.id,
                createdAt: Date.now()
            };
            backupDoc = await JournalEntry.create(backupData);
        }
    } catch (e) {
        console.warn("Phil's Universal Translator | Backup konnte nicht erstellt werden:", e);
    }

    // 2. Apply updates
    if (parsedData.name && targetDoc.name !== parsedData.name) {
        await targetDoc.update({ name: parsedData.name });
    }

    // 3. Apply pages/items
    const pages = parsedData.pages || parsedData.items;
    if (Array.isArray(pages) && targetDoc.pages) {
        const updates = [];
        for (const p of pages) {
            if (!p._id && !p.id) continue;
            const u = {
                _id: p._id || p.id,
                name: p.name,
                [`flags.${MODULE_ID}.aiProcessed`]: true,
                [`flags.${MODULE_ID}.aiProcessedAt`]: Date.now()
            };
            if (p.text?.content !== undefined) u["text.content"] = p.text.content;
            if (p.system) {
                for (const [k, v] of Object.entries(p.system)) {
                    u[`system.${k}`] = v;
                }
            }
            updates.push(u);
        }

        if (updates.length > 0) {
            await targetDoc.updateEmbeddedDocuments("JournalEntryPage", updates);
        }
    }

    // 4. Save new terms to glossary
    if (Array.isArray(parsedData.newTerms) && parsedData.newTerms.length > 0) {
        await UniversalGlossary.addTerms(parsedData.newTerms);
    }

    return { success: true, backupDoc };
}

/**
 * Restores a document from its last backup.
 * @param {Document} targetDoc
 * @returns {Promise<boolean>}
 */
export async function restoreDocumentFromBackup(targetDoc) {
    if (!targetDoc) return false;

    const backup = game.journal?.find(j => 
        j.flags?.[MODULE_ID]?.isBackup && 
        j.flags?.[MODULE_ID]?.originalId === targetDoc.id
    ) || game.journal?.find(j => j.name === `${targetDoc.name} (Backup)`);

    if (!backup) {
        ui.notifications.warn(`Kein Sicherheits-Backup für "${targetDoc.name}" gefunden.`);
        return false;
    }

    const updates = backup.pages.map(p => ({
        _id: p.id,
        name: p.name,
        "text.content": p.text?.content || "",
        [`flags.${MODULE_ID}.aiProcessed`]: false
    }));

    await targetDoc.update({
        name: backup.name.replace(/\s*\(Backup\)/i, ""),
        pages: updates
    });

    ui.notifications.success(`Originalzustand aus "${backup.name}" erfolgreich wiederhergestellt!`);
    return true;
}

export async function cleanupExcessBackups() {
    if (!game.user.isGM) return;
    const excess = game.journal?.filter(j => 
        (j.name.includes("(Backup) (Backup)") || (j.name.match(/\(Backup\)/g) || []).length > 1)
    ) || [];
    for (const b of excess) {
        await b.delete();
    }
}

export async function repairAllBackupConflicts() {
    if (!game.user.isGM) return;
    const backups = game.journal?.filter(j => j.name.includes("(Backup)") || j.flags?.[MODULE_ID]?.isBackup) || [];
    for (const b of backups) {
        if (!b.flags?.[MODULE_ID]?.isBackup) {
            await b.update({ [`flags.${MODULE_ID}.isBackup`]: true });
        }
    }
}

export async function repairAllWorldBackupLinks() {
    if (!game.user.isGM) return;
    return await SmartLinkRemapper.executeRemapping(SmartLinkRemapper.analyzeLinks().changes);
}

export async function repairAllMojibakeWorldWide() {
    if (!game.user.isGM) return 0;
    let fixedCount = 0;
    for (const journal of game.journal || []) {
        const pageUpdates = [];
        for (const page of journal.pages || []) {
            let html = page.text?.content || "";
            if (detectMojibake(html).count > 0) {
                pageUpdates.push({
                    _id: page.id,
                    "text.content": fixMojibake(html)
                });
                fixedCount++;
            }
        }
        if (pageUpdates.length > 0) {
            await journal.updateEmbeddedDocuments("JournalEntryPage", pageUpdates);
        }
    }
    return fixedCount;
}

/**
 * Scans entire campaign for missing chunks, broken links, mojibake, and backup issues.
 * @returns {Promise<object>}
 */
export async function auditCampaignIntegrity() {
    const journals = (game.journal || []).filter(j => !j.name.includes("(Backup)") && !j.flags?.[MODULE_ID]?.isBackup && j.name !== "AI Glossar" && j.name !== "AI Glossary");
    
    let totalCheckedPages = 0;
    let intactCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    const journalAudits = [];
    const brokenLinkIssues = [];
    const mojibakeIssues = [];
    const chunkLossIssues = [];
    const backupHijacks = [];

    for (const journal of journals) {
        const pageAudits = [];
        for (const page of (journal.pages || [])) {
            totalCheckedPages++;
            const html = page.text?.content || "";
            const mb = detectMojibake(html);
            const links = LinkProtection.extractLinks(html);
            let status = "ok";
            const issues = [];

            if (mb.count > 0) {
                issues.push(`Umlaute beschädigt (${mb.count} Funde)`);
                mojibakeIssues.push({ journal: journal.name, page: page.name, count: mb.count });
                status = "warning";
            }

            if (html.includes("MISSING_TRANSLATION_CHUNK") || html.includes("undefined")) {
                issues.push("Fehlender Text-Chunk");
                chunkLossIssues.push({ journal: journal.name, page: page.name });
                status = "error";
            }

            if (status === "ok") intactCount++;
            else if (status === "warning") warningCount++;
            else errorCount++;

            pageAudits.push({
                id: page.id,
                name: page.name,
                status: status,
                issues: issues,
                linkCount: links.length
            });
        }

        journalAudits.push({
            id: journal.id,
            name: journal.name,
            pageAudits: pageAudits
        });
    }

    const health = totalCheckedPages > 0 ? Math.round((intactCount / totalCheckedPages) * 100) : 100;

    return {
        totalJournals: journals.length,
        totalCheckedPages,
        intactCount,
        warningCount,
        errorCount,
        overallHealth: health,
        backupHijacks,
        chunkLossIssues,
        brokenLinkIssues,
        mojibakeIssues,
        journalAudits
    };
}
