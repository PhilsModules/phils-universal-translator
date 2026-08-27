export const MODULE_ID = "phils-universal-translator";

export class UniversalGlossary {
    static _cache = null;
    static _categorizedCache = null;

    static CATEGORY_PAGE_MAP = {
        locations: "Orte",
        location: "Orte",
        ort: "Orte",
        orte: "Orte",
        places: "Orte",
        place: "Orte",
        settlements: "Orte",
        cities: "Orte",
        
        npcs: "Charaktere & NSCs",
        npc: "Charaktere & NSCs",
        character: "Charaktere & NSCs",
        characters: "Charaktere & NSCs",
        persons: "Charaktere & NSCs",
        nscs: "Charaktere & NSCs",
        monsters: "Charaktere & NSCs",
        creatures: "Charaktere & NSCs",

        deities: "Götter & Kulte",
        deity: "Götter & Kulte",
        god: "Götter & Kulte",
        gods: "Götter & Kulte",
        gott: "Götter & Kulte",
        götter: "Götter & Kulte",
        cults: "Götter & Kulte",
        religions: "Götter & Kulte",

        organizations: "Organisationen & Fraktionen",
        organization: "Organisationen & Fraktionen",
        factions: "Organisationen & Fraktionen",
        faction: "Organisationen & Fraktionen",
        fraktion: "Organisationen & Fraktionen",
        fraktionen: "Organisationen & Fraktionen",
        guilds: "Organisationen & Fraktionen",
        houses: "Organisationen & Fraktionen",
        orders: "Organisationen & Fraktionen",

        biomes: "Biome & Wildnis",
        biome: "Biome & Wildnis",
        geography: "Biome & Wildnis",
        nature: "Biome & Wildnis",
        wilderness: "Biome & Wildnis",
        landschaften: "Biome & Wildnis",

        ancestries: "Völker & Spezies",
        ancestry: "Völker & Spezies",
        spezies: "Völker & Spezies",
        species: "Völker & Spezies",
        rassen: "Völker & Spezies",
        races: "Völker & Spezies",
        völker: "Völker & Spezies",

        cultures: "Kulturen",
        culture: "Kulturen",
        kultur: "Kulturen",
        kulturen: "Kulturen",
        traditions: "Kulturen",

        classes: "Klassen & Archetypen",
        class: "Klassen & Archetypen",
        klasse: "Klassen & Archetypen",
        klassen: "Klassen & Archetypen",
        subclasses: "Klassen & Archetypen",
        archetypes: "Klassen & Archetypen",
        professions: "Klassen & Archetypen",

        spells_and_items: "Ausrüstung & Zauber",
        spells: "Ausrüstung & Zauber",
        spell: "Ausrüstung & Zauber",
        zauber: "Ausrüstung & Zauber",
        items: "Ausrüstung & Zauber",
        item: "Ausrüstung & Zauber",
        equipment: "Ausrüstung & Zauber",
        weapons: "Ausrüstung & Zauber",
        armor: "Ausrüstung & Zauber",
        gear: "Ausrüstung & Zauber",

        cosmos: "Kosmologie & Welten",
        cosmology: "Kosmologie & Welten",
        planes: "Kosmologie & Welten",
        realms: "Kosmologie & Welten",
        dimensions: "Kosmologie & Welten",

        languages: "Sprachen",
        language: "Sprachen",
        sprache: "Sprachen",
        sprachen: "Sprachen",
        dialects: "Sprachen",

        rules_and_mechanics: "Spielregeln & Mechaniken",
        rules: "Spielregeln & Mechaniken",
        mechanics: "Spielregeln & Mechaniken",
        conditions: "Spielregeln & Mechaniken",
        actions: "Spielregeln & Mechaniken",
        general: "Spielregeln & Mechaniken",
        other: "Spielregeln & Mechaniken"
    };

    static inferCategory(original, translation) {
        if (!original) return "Spielregeln & Mechaniken";
        const e = original.toLowerCase().trim();

        if (/\b(fighter|rogue|wizard|cleric|paladin|ranger|barbarian|bard|druid|monk|sorcerer|warlock|artificer|alchemist|gunslinger|investigator|magus|swashbuckler|thaumaturge|psychic|kineticist|warrior|knight|scout|assassin|hunter|shaman|priest|mechanic|soldier|agent)\b/i.test(e)) {
            return "Klassen & Archetypen";
        }
        if (/\b(language|dialect|sprache|tongue|common|elvish|dwarvish|draconic|celestial|infernal|abyssal|orcish|goblinoid)\b/i.test(e)) {
            return "Sprachen";
        }
        if (/\b(god|deity|gott|spirit|patron|lord|lady|pantheon|cult|temple of|church of)\b/i.test(e)) {
            return "Götter & Kulte";
        }
        if (/\b(guild|order|faction|legion|syndicate|consortium|cabal|alliance|brotherhood|clan|house)\b/i.test(e)) {
            return "Organisationen & Fraktionen";
        }
        if (/\b(city|town|village|keep|castle|tower|ruin|fortress|haven|port|gate|bridge|sanctuary|dungeon|crypt|tomb|cavern|mine)\b/i.test(e)) {
            return "Orte";
        }
        if (/\b(forest|jungle|mountain|valley|desert|swamp|marsh|ocean|sea|river|lake|plains|hills|canyon|glacier|island|wilds)\b/i.test(e)) {
            return "Biome & Wildnis";
        }
        if (/\b(elf|dwarf|human|halfling|gnome|orc|goblin|dragonborn|tiefling|aasimar|catfolk|kobold|lizardfolk|undead|construct|beast)\b/i.test(e)) {
            return "Völker & Spezies";
        }
        if (/\b(sword|dagger|bow|crossbow|axe|shield|armor|potion|scroll|wand|staff|ring|amulet|spell|fireball|heal|blast|bolt|curse|ward)\b/i.test(e)) {
            return "Ausrüstung & Zauber";
        }
        if (/\b(plane|dimension|astral|ethereal|shadowfell|feywild|abyss|hell|cosmos|multiverse)\b/i.test(e)) {
            return "Kosmologie & Welten";
        }
        return "Spielregeln & Mechaniken";
    }

    static async loadDictionary() {
        if (this._cache) return this._cache;

        const dictionary = {};
        const coreGlossary = await this.loadCoreGlossaryJson();

        for (const [category, items] of Object.entries(coreGlossary)) {
            if (typeof items === 'object' && items !== null) {
                for (const [eng, de] of Object.entries(items)) {
                    if (eng && de && typeof eng === 'string' && typeof de === 'string') {
                        dictionary[eng] = de;
                    }
                }
            }
        }

        try {
            const userGlossary = await this.loadUserGlossary();
            Object.assign(dictionary, userGlossary);
        } catch (e) {
            console.warn("Phil's Universal Translator | Error loading user glossary:", e);
        }

        this._cache = dictionary;
        return dictionary;
    }

    static clearCache() {
        this._cache = null;
        this._categorizedCache = null;
    }

    static async loadCoreGlossaryJson() {
        try {
            const response = await fetch(`modules/${MODULE_ID}/glossary/universal-core-glossary.json?v=${Date.now()}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.warn("Phil's Universal Translator | Could not load universal-core-glossary.json:", e);
        }
        return {};
    }

    static getFoundryGlossaryJournal() {
        return game.journal?.find(j => {
            const name = (j.name || "").trim().toLowerCase();
            return name === "ai glossar" || name === "ai glossary";
        }) || null;
    }

    static extractTermsFromHtml(html) {
        if (!html) return [];
        const terms = [];
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const rows = tempDiv.querySelectorAll("table tr");
        for (const row of rows) {
            const cells = row.querySelectorAll("td, th");
            if (cells.length >= 2) {
                let eng = cells[0].textContent.trim();
                let de = cells[1].textContent.trim();

                eng = eng.replace(/\s*\([^)]*\)/g, '').trim();
                de = de.replace(/\s*\([^)]*\)/g, '').trim();

                if (eng && de && eng.toLowerCase() !== "original" && eng.toLowerCase() !== "englisch" && eng.toLowerCase() !== "english") {
                    terms.push({ original: eng, translation: de });
                }
            }
        }

        const listItems = tempDiv.querySelectorAll("li, p");
        for (const item of listItems) {
            const text = item.textContent.trim();
            const separatorMatch = text.match(/^([^:\-\=\>]+)\s*(?::|->|=>|=|–|—)\s*(.+)$/);
            if (separatorMatch) {
                let eng = separatorMatch[1].replace(/\s*\([^)]*\)/g, '').trim();
                let de = separatorMatch[2].replace(/\s*\([^)]*\)/g, '').trim();
                if (eng && de && eng.length >= 2) {
                    terms.push({ original: eng, translation: de });
                }
            }
        }

        return terms;
    }

    static async loadUserGlossary() {
        const journal = this.getFoundryGlossaryJournal();
        if (!journal) return {};

        const userTerms = {};
        for (const page of journal.pages) {
            const html = page.text?.content || "";
            if (!html) continue;
            const terms = this.extractTermsFromHtml(html);
            for (const t of terms) {
                userTerms[t.original] = t.translation;
            }
        }

        return userTerms;
    }

    static async ensureFoundryGlossaryJournal() {
        if (!game.user.isGM) return;

        let journal = this.getFoundryGlossaryJournal();
        if (!journal) {
            console.log("Phil's Universal Translator | Creating world 'AI Glossar' JournalEntry...");
            const coreGlossary = await this.loadCoreGlossaryJson();
            const isGerman = (game.i18n?.lang === 'de');
            const thOrig = game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.Glossary.ThOriginal") || (isGerman ? "Original (Englisch)" : "Original");
            const thTrans = game.i18n?.localize("PHILS_UNIVERSAL_TRANSLATE.Glossary.ThTranslation") || (isGerman ? "Übersetzung (Deutsch)" : "Translation");

            const overviewTitle = isGerman ? "Übersicht & Anleitung" : "Overview & Guide";
            const overviewHeading = isGerman ? "Universal Übersetzungs-Glossar" : "Universal Translation Glossary";
            const overviewDesc = isGerman 
                ? "<p>Dieses Glossar enthält alle offiziellen Übersetzungen und geschützten Eigennamen für deine Kampagne.</p><p><em>Hinweis:</em> Du kannst hier jederzeit Begriffe anpassen oder neue Zeilen hinzufügen. Das Übersetzungsmodul liest dieses Journal direkt aus und übernimmt alle Begriffe für KI-Prompts und automatische Wortersetzungen.</p>"
                : "<p>This glossary contains all official terminology, translations, and protected proper names for your campaign.</p><p><em>Note:</em> You can edit terms or add new rows at any time. The translation module reads this journal directly to supply AI prompts and terminology consistency.</p>";

            const pages = [
                {
                    name: overviewTitle,
                    type: "text",
                    text: {
                        content: `<h2>${overviewHeading}</h2>${overviewDesc}`
                    }
                }
            ];

            const standardCategories = [
                { id: "locations", name: "Orte" },
                { id: "npcs", name: "Charaktere & NSCs" },
                { id: "deities", name: "Götter & Kulte" },
                { id: "organizations", name: "Organisationen & Fraktionen" },
                { id: "biomes", name: "Biome & Wildnis" },
                { id: "ancestries", name: "Völker & Spezies" },
                { id: "cultures", name: "Kulturen" },
                { id: "classes", name: "Klassen & Archetypen" },
                { id: "spells_and_items", name: "Ausrüstung & Zauber" },
                { id: "cosmos", name: "Kosmologie & Welten" },
                { id: "languages", name: "Sprachen" },
                { id: "rules_and_mechanics", name: "Spielregeln & Mechaniken" }
            ];

            for (const cat of standardCategories) {
                const terms = coreGlossary[cat.id] || {};
                let rowsHtml = "";
                for (const [eng, de] of Object.entries(terms)) {
                    rowsHtml += `<tr><td><strong>${eng}</strong></td><td>${de}</td></tr>\n`;
                }

                pages.push({
                    name: cat.name,
                    type: "text",
                    text: {
                        content: `<h3>${cat.name}</h3>
<table class="ts-glossary-table" style="width:100%;border-collapse:collapse">
    <thead>
        <tr style="background:rgba(52, 152, 219, 0.2)">
            <th style="padding:6px 10px;border:1px solid #666;text-align:left">${thOrig}</th>
            <th style="padding:6px 10px;border:1px solid #666;text-align:left">${thTrans}</th>
        </tr>
    </thead>
    <tbody>
${rowsHtml}    </tbody>
</table>`
                    }
                });
            }

            journal = await JournalEntry.create({
                name: isGerman ? "AI Glossar" : "AI Glossary",
                pages: pages,
                ownership: { default: 2 }
            });
        }
        return journal;
    }

    static async addTerms(terms) {
        if (!terms || !Array.isArray(terms) || terms.length === 0) return;

        const journal = await this.ensureFoundryGlossaryJournal();
        if (!journal) return;

        const termsByPage = {};
        for (const t of terms) {
            if (!t.original || !t.translation) continue;
            const catKey = (t.category || "").toLowerCase().trim();
            const pageName = this.CATEGORY_PAGE_MAP[catKey] || this.inferCategory(t.original, t.translation);
            if (!termsByPage[pageName]) termsByPage[pageName] = [];
            termsByPage[pageName].push(t);
        }

        for (const [pageName, termList] of Object.entries(termsByPage)) {
            let page = journal.pages.find(p => p.name === pageName);

            if (!page) {
                const newPages = await journal.createEmbeddedDocuments("JournalEntryPage", [{
                    name: pageName,
                    type: "text",
                    text: {
                        content: `<h3>${pageName}</h3>
<table class="ts-glossary-table" style="width:100%;border-collapse:collapse">
    <thead>
        <tr style="background:rgba(52, 152, 219, 0.2)">
            <th style="padding:6px 10px;border:1px solid #666;text-align:left">Original (Englisch)</th>
            <th style="padding:6px 10px;border:1px solid #666;text-align:left">Übersetzung / Deutsch</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>`
                    }
                }]);
                page = newPages[0];
            }

            if (page) {
                let html = page.text?.content || "";
                for (const t of termList) {
                    const rowRegex = new RegExp(`<td><strong>\\s*${t.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<\\/strong><\\/td>`, 'i');
                    if (!rowRegex.test(html)) {
                        const newRow = `<tr><td><strong>${t.original}</strong></td><td>${t.translation}</td></tr>\n`;
                        if (html.includes("</tbody>")) {
                            html = html.replace("</tbody>", `${newRow}</tbody>`);
                        } else {
                            html += `\n<p><strong>${t.original}</strong>: ${t.translation}</p>`;
                        }
                    }
                }
                await page.update({ "text.content": html });
            }
        }

        this.clearCache();
        await this.loadDictionary();
    }

    static async getAllGlossaryTermsDetailed() {
        const glossaryJournal = await this.ensureFoundryGlossaryJournal();
        if (!glossaryJournal) return [];

        const allTerms = [];
        for (const page of glossaryJournal.pages) {
            if (page.type === "text" && page.text?.content) {
                const terms = this.extractTermsFromHtml(page.text.content);
                const pageName = page.name || "Allgemein";
                terms.forEach(t => {
                    if (t.original && t.translation) {
                        allTerms.push({
                            original: t.original,
                            translation: t.translation,
                            pageId: page._id || page.id,
                            pageName: pageName,
                            category: pageName.replace(/^\d+\.\s*/, ''),
                            isProperName: (t.original.toLowerCase() === t.translation.toLowerCase())
                        });
                    }
                });
            }
        }
        return allTerms;
    }

    static async updateGlossaryTerm(pageId, oldOriginal, newOriginal, newTranslation) {
        const glossaryJournal = await this.ensureFoundryGlossaryJournal();
        if (!glossaryJournal) return false;

        const page = glossaryJournal.pages.get(pageId);
        if (!page || !page.text?.content) return false;

        let terms = this.extractTermsFromHtml(page.text.content);
        let found = false;
        terms = terms.map(t => {
            if (t.original.toLowerCase() === oldOriginal.toLowerCase()) {
                found = true;
                return { original: newOriginal.trim(), translation: newTranslation.trim() };
            }
            return t;
        });

        if (!found) return false;

        const tableRows = terms.map(t => {
            const isProperName = (t.original.toLowerCase() === t.translation.toLowerCase());
            const note = isProperName ? `<span style="color:#e67e22;">(Eigenname - nicht übersetzen)</span>` : "";
            return `<tr><td><strong>${t.original}</strong></td><td>${t.translation} ${note}</td></tr>`;
        }).join("\n        ");

        const updatedHtml = `<h3>${page.name}</h3>
<table class="ts-glossary-table" style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr style="background: rgba(52, 152, 219, 0.2);">
            <th style="padding: 6px 10px; border: 1px solid #666; text-align: left;">Original (Englisch)</th>
            <th style="padding: 6px 10px; border: 1px solid #666; text-align: left;">Übersetzung / Deutsch</th>
        </tr>
    </thead>
    <tbody>
        ${tableRows}
    </tbody>
</table>`;

        await page.update({ "text.content": updatedHtml });
        this.clearCache();
        return true;
    }

    static async deleteGlossaryTerm(pageId, original) {
        const glossaryJournal = await this.ensureFoundryGlossaryJournal();
        if (!glossaryJournal) return false;

        const page = glossaryJournal.pages.get(pageId);
        if (!page || !page.text?.content) return false;

        let terms = this.extractTermsFromHtml(page.text.content);
        const initialLength = terms.length;
        terms = terms.filter(t => t.original.toLowerCase() !== original.toLowerCase());

        if (terms.length === initialLength) return false;

        const tableRows = terms.map(t => {
            const isProperName = (t.original.toLowerCase() === t.translation.toLowerCase());
            const note = isProperName ? `<span style="color:#e67e22;">(Eigenname - nicht übersetzen)</span>` : "";
            return `<tr><td><strong>${t.original}</strong></td><td>${t.translation} ${note}</td></tr>`;
        }).join("\n        ");

        const updatedHtml = `<h3>${page.name}</h3>
<table class="ts-glossary-table" style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr style="background: rgba(52, 152, 219, 0.2);">
            <th style="padding: 6px 10px; border: 1px solid #666; text-align: left;">Original (Englisch)</th>
            <th style="padding: 6px 10px; border: 1px solid #666; text-align: left;">Übersetzung / Deutsch</th>
        </tr>
    </thead>
    <tbody>
        ${tableRows}
    </tbody>
</table>`;

        await page.update({ "text.content": updatedHtml });
        this.clearCache();
        return true;
    }

    static async sortFoundryGlossaryAlphabetically(sortBy = 'original', direction = 'asc') {
        const glossaryJournal = await this.ensureFoundryGlossaryJournal();
        if (!glossaryJournal) return { success: false };

        let totalPagesSorted = 0;
        let totalTermsSorted = 0;

        for (const page of glossaryJournal.pages) {
            if (page.type !== "text" || !page.text?.content) continue;
            if (page.name.includes("Übersicht")) continue;

            const html = page.text.content;
            const terms = this.extractTermsFromHtml(html);
            if (terms.length === 0) continue;

            const dedupMap = new Map();
            for (const t of terms) {
                const k = t.original.toLowerCase();
                if (!dedupMap.has(k)) dedupMap.set(k, t);
            }
            const uniqueTerms = Array.from(dedupMap.values());

            uniqueTerms.sort((a, b) => {
                const valA = sortBy === 'translation' ? a.translation : a.original;
                const valB = sortBy === 'translation' ? b.translation : b.original;
                const cmp = valA.localeCompare(valB, 'de', { sensitivity: 'base', numeric: true });
                return direction === 'desc' ? -cmp : cmp;
            });

            const tableRows = uniqueTerms.map(t => {
                const isProperName = (t.original.toLowerCase() === t.translation.toLowerCase());
                const note = isProperName ? `<span style="color:#e67e22;">(Eigenname - nicht übersetzen)</span>` : "";
                return `<tr><td><strong>${t.original}</strong></td><td>${t.translation} ${note}</td></tr>`;
            }).join("\n        ");

            const pageTitle = page.name || "Kategorie";
            const updatedHtml = `<h3>${pageTitle}</h3>
<table class="ts-glossary-table" style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr style="background: rgba(52, 152, 219, 0.2);">
            <th style="padding: 6px 10px; border: 1px solid #666; text-align: left;">Original (Englisch)</th>
            <th style="padding: 6px 10px; border: 1px solid #666; text-align: left;">Übersetzung / Deutsch</th>
        </tr>
    </thead>
    <tbody>
        ${tableRows}
    </tbody>
</table>`;

            await page.update({ "text.content": updatedHtml });
            totalPagesSorted++;
            totalTermsSorted += uniqueTerms.length;
        }

        this.clearCache();
        ui.notifications.success(`Glossar erfolgreich sortiert: ${totalTermsSorted} Begriffe in ${totalPagesSorted} Kategorien sortiert!`);
        return { success: true, totalPagesSorted, totalTermsSorted };
    }
}
