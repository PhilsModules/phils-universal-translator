import { LinkProtection } from "./LinkProtection.js";

export class TermReplacer {
    static _regexCache = null;
    static _lookupCache = null;
    static _lastDictionary = null;

    /**
     * Replaces terms in the text with their values from the dictionary.
     * Strictly respects HTML tags and Foundry links (never replaces inside tags or link targets).
     * 
     * @param {string} text - The input text (potentially HTML).
     * @param {Object} dictionary - Map of terms to replace (English -> German).
     * @param {boolean} [appendOriginal=false] - If true and translation differs from original, appends the original term: "Translation %%Original%%".
     * @returns {{text: string, replaced: Array<{original: string, translation: string}>}} The text with terms replaced and list of replacements.
     */
    static replaceTerms(text, dictionary, appendOriginal = false) {
        if (!text || !dictionary || typeof text !== 'string') {
            return { text: text, replaced: [] };
        }

        // Check if we can reuse the cached regex and lookup
        if (this._lastDictionary !== dictionary || !this._regexCache || !this._lookupCache) {
            const keys = Object.keys(dictionary)
                .filter(k => k && k.length > 1)
                .sort((a, b) => b.length - a.length);

            if (keys.length === 0) return { text: text, replaced: [] };

            const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = keys.map(escapeRegExp).join("|");

            // Lookbehind (?<!\w) and lookahead (?!\w) to match whole words/phrases
            this._regexCache = new RegExp(`(?<!\\w)(${pattern})(?!\\w)`, 'gi');

            // Lowercase lookup map for case-insensitive lookup
            this._lookupCache = {};
            for (const [key, value] of Object.entries(dictionary)) {
                this._lookupCache[key.toLowerCase()] = { original: key, translation: value };
            }

            this._lastDictionary = dictionary;
        }

        const replacedTerms = new Map();

        // Protection split: Split by HTML tags, @Links, and inline rolls
        const parts = text.split(LinkProtection.FULL_PROTECTION_REGEX);

        const newText = parts.map((part, index) => {
            // Odd indices in split results with capturing regex are the protected parts
            if (index % 2 === 1) return part;

            // Replace terms in the normal text content
            return part.replace(this._regexCache, (match, p1, offset, fullString) => {
                const lowerMatch = match.toLowerCase();

                // Disambiguation protection for generic adjectives like "common":
                // If "common" is mapped to "Gemeinsprache", NEVER replace it when followed by non-language nouns (e.g. coin, ground, sense, hazard, item, etc.)
                if (lowerMatch === "common" && typeof fullString === 'string') {
                    const followingText = fullString.slice(offset + match.length, offset + match.length + 30);
                    if (/^\s+(?:coin|coins|currency|ground|sense|knowledge|hazard|hazards|item|items|people|person|practice|occurrence|sight|creature|monster|folk|event|events|room|rooms|area|areas)\b/i.test(followingText)) {
                        return match; // Keep "Common" as is for natural contextual translation
                    }
                }

                const entry = this._lookupCache[lowerMatch];
                if (entry) {
                    replacedTerms.set(entry.original, entry.translation);
                    // NEVER append %%...%% if original and translation are the same
                    const isIdentical = entry.original.trim().toLowerCase() === entry.translation.trim().toLowerCase();
                    if (appendOriginal && !isIdentical) {
                        return `${entry.translation} %%${entry.original}%%`;
                    }
                    return entry.translation;
                }
                return match;
            });
        }).join("");

        const replacedList = Array.from(replacedTerms.entries()).map(([original, translation]) => ({ original, translation }));
        return { text: newText, replaced: replacedList };
    }
}
