/**
 * LinkProtection Engine for Foundry VTT
 * Ensures that @UUID[...], @Compendium[...], @JournalEntry[...], @Embed[...], @Check[...],
 * @Damage[...], @Item[...], @Actor[...], inline rolls, and HTML tags
 * are never broken or altered inappropriately by LLM translations.
 */
export class LinkProtection {
    /**
     * Regex pattern to identify any Foundry dynamic entity link.
     */
    static LINK_REGEX = /@([a-zA-Z0-9]+)\[([^\]]+)\](?:\{([^\}]*)\})?/g;

    /**
     * Comprehensive protection regex matching:
     * 1. HTML Tags: <...>
     * 2. Foundry Links & Embeds: @Type[...]{...} or @Type[...]
     * 3. Inline Rolls / Macros: [[...]]
     */
    static FULL_PROTECTION_REGEX = /((?:<[^>]+>)|(?:@[a-zA-Z0-9]+\[[^\]]*\](?:\{[^}]*\})?)|(?:\[\[.*?\]\]))/g;

    /**
     * Extracts all Foundry links from a given string.
     * @param {string} text
     * @returns {Array<{full: string, type: string, target: string, label: string|null, index: number}>}
     */
    static extractLinks(text) {
        if (!text || typeof text !== 'string') return [];
        const links = [];
        const matches = text.matchAll(new RegExp(this.LINK_REGEX));
        for (const match of matches) {
            links.push({
                full: match[0],
                type: match[1],
                target: match[2],
                label: match[3] || null,
                index: match.index
            });
        }
        return links;
    }

    /**
     * Masks all dynamic Foundry links and embeds with safe placeholder tokens.
     * @param {string} text
     * @param {string} [prefix="%%UNIVERSAL_LINK_"]
     * @returns {{maskedText: string, linkMap: Map<string, string>}}
     */
    static maskLinks(text, prefix = "%%UNIVERSAL_LINK_") {
        if (!text || typeof text !== 'string') return { maskedText: text, linkMap: new Map() };

        const linkMap = new Map();
        let counter = 0;

        const maskedText = text.replace(this.LINK_REGEX, (match) => {
            counter++;
            const placeholder = `${prefix}${counter}%%`;
            linkMap.set(placeholder, match);
            return placeholder;
        });

        return { maskedText, linkMap };
    }

    /**
     * Unmasks previously stored link placeholders back into their original or translated form.
     * @param {string} text
     * @param {Map<string, string>} linkMap
     * @returns {string}
     */
    static unmaskLinks(text, linkMap) {
        if (!text || !linkMap || linkMap.size === 0) return text;

        let result = text;
        for (const [placeholder, originalLink] of linkMap.entries()) {
            result = result.replaceAll(placeholder, originalLink);
        }
        return result;
    }

    /**
     * Validates and repairs links in translated text against the original text.
     * Preserves translated display labels {label} while strictly maintaining the target UUID / path.
     * 
     * @param {string} originalText
     * @param {string} translatedText
     * @returns {{valid: boolean, repairedText: string, errors: string[], linkDetails: Array<object>}}
     */
    static validateAndRepairLinks(originalText, translatedText) {
        if (!originalText || !translatedText) {
            return { valid: true, repairedText: translatedText, errors: [], linkDetails: [] };
        }

        const origLinks = this.extractLinks(originalText);
        if (origLinks.length === 0) {
            return { valid: true, repairedText: translatedText, errors: [], linkDetails: [] };
        }

        let repairedText = translatedText;
        const errors = [];
        const linkDetails = [];

        // Track used translated links
        const transLinks = this.extractLinks(translatedText);

        origLinks.forEach((orig) => {
            const origType = orig.type;
            const origTarget = orig.target;
            const origLabel = orig.label;

            // Search for exact match in translated text
            const exactMatch = transLinks.find(t => t.type === origType && t.target.trim() === origTarget.trim());

            if (exactMatch) {
                linkDetails.push({
                    original: orig.full,
                    current: exactMatch.full,
                    status: "ok",
                    target: origTarget
                });
            } else {
                // Link target was altered, missing or partially translated!
                const targetClean = origTarget.split(/\s+/)[0];
                const targetTokens = targetClean.split('.').filter(t => t.length > 5);
                const uniqueId = targetTokens.length > 0 ? targetTokens[targetTokens.length - 1] : targetClean;

                let recovered = false;

                // Try to find a corrupted @Type[...] containing uniqueId
                const corruptedRegex = new RegExp(`@([a-zA-Z0-9]+)\\[[^\\]]*?${uniqueId}[^\\]]*?\\](?:\\{([^\\}]*)\\})?`, 'g');
                if (corruptedRegex.test(repairedText)) {
                    repairedText = repairedText.replace(corruptedRegex, (match, mType, mLabel) => {
                        const finalLabel = mLabel !== undefined ? `{${mLabel}}` : (origLabel ? `{${origLabel}}` : "");
                        return `@${origType}[${origTarget}]${finalLabel}`;
                    });
                    recovered = true;
                }

                // If not found by ID, check if link was translated literally or exists as plain text
                if (!recovered && origLabel && origLabel.length >= 3) {
                    const labelEscaped = origLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const labelLinkRegex = new RegExp(`@[a-zA-Z0-9]+\\[[^\\]]+\\]\\{${labelEscaped}\\}`, 'g');
                    if (labelLinkRegex.test(repairedText)) {
                        repairedText = repairedText.replace(labelLinkRegex, `@${origType}[${origTarget}]{${origLabel}}`);
                        recovered = true;
                    } else {
                        // Check if the label or a German translated variant appears as plain text in the output
                        const root = origLabel.replace(/(?:ians|ian|s|es|en|er|e)$/i, '');
                        const rootEsc = (root.length >= 3 ? root : origLabel).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[ck]/gi, '[ck]');
                        const suffixPattern = '(?:ianerinnen|ianerinn|ianerinen|ianerin|ianern|ianere|ianers|ianer|ierinnen|ierinn|ierinen|ierin|iere|iern|iers|ier|ianischen|ianischer|ianisches|ianische|ianisch|ischen|ischer|isches|ische|isch|enden|ender|endes|ende|end|heiten|heit|keiten|keit|schaften|schaft|lingen|linge|ling|enen|ener|enem|enes|ene|isse|issen|isses|sse|ssen|sses|ern|er|en|es|em|e|n|s)?';
                        const plainRegex = new RegExp(`(?<!@(?:UUID|Embed|Compendium|Check|Damage|Item|Actor)\\[[^\\]]*?)(?<!\\{)(?<![-/])\\b(${labelEscaped}|${rootEsc}${suffixPattern})\\b(?![-/])(?![^\\[]*\\])`, 'i');
                        if (plainRegex.test(repairedText)) {
                            repairedText = repairedText.replace(plainRegex, `@${origType}[${origTarget}]{$1}`);
                            recovered = true;
                        }
                    }
                }

                if (recovered) {
                    linkDetails.push({
                        original: orig.full,
                        current: `@${origType}[${origTarget}]${origLabel ? `{${origLabel}}` : ""}`,
                        status: "repaired",
                        target: origTarget
                    });
                } else {
                    errors.push(`Fehlender Link: ${orig.full}`);
                    linkDetails.push({
                        original: orig.full,
                        current: "(Nicht gefunden)",
                        status: "missing",
                        target: origTarget
                    });
                }
            }
        });

        return {
            valid: errors.length === 0,
            repairedText: repairedText,
            errors: errors,
            linkDetails: linkDetails
        };
    }
}
