<div align="center">

# Phil's Universal AI Translator

![Foundry v12 Compatible](https://img.shields.io/badge/Foundry-v12-green)
![Foundry v13 Compatible](https://img.shields.io/badge/Foundry-v13-brightgreen)
![Foundry v14 Compatible](https://img.shields.io/badge/Foundry-v14-brightgreen)
![System](https://img.shields.io/badge/System-Universal-blue)
![License](https://img.shields.io/badge/License-GPLv3-blue)
[![Version](https://img.shields.io/badge/version-v1.0.0-blue)](https://github.com/PhilsModules/phils-universal-translator/releases)
[![Patreon](https://img.shields.io/badge/SUPPORT-Patreon-ff424d?logo=patreon)](https://www.patreon.com/PhilsModules)

<br>

**The universal smart translation helper for Foundry VTT (v14 ready) – for any tabletop RPG system, true multilingual, no API costs, full control.**
<br>
*Der universelle, smarte Übersetzungs-Helfer für Foundry VTT (v14 ready) – für jedes Spielsystem, echtes Multilingual, keine API-Kosten, volle Kontrolle.*

📖 **[Detailed Manual / Ausführliche Anleitung](anleitung.md)**
<br><br>

<a href="#-english-instructions"><img src="https://img.shields.io/badge/%20-English_Instructions-black?style=for-the-badge&logo=united-kingdom&logoColor=white" alt="English Instructions"></a> <a href="#-deutsche-anleitung"><img src="https://img.shields.io/badge/%20-Deutsche_Anleitung-black?style=for-the-badge&logo=germany&logoColor=red" alt="Deutsche Anleitung"></a>
</div>

> [!CAUTION]
> ### ⚖️ Private Use Only / Nur für den privaten Gebrauch
> **English:** Translations of copyrighted works created with this module may **only be used for private purposes**. Publication, distribution, or commercial use (sale) is prohibited.
>
> **Deutsch:** Die mit diesem Modul erstellten Übersetzungen urheberrechtlich geschützter Werke dürfen **nur für den privaten Gebrauch** verwendet werden. Eine Veröffentlichung, Verbreitung oder kommerzielle Nutzung (Verkauf) ist nicht gestattet.

---

# <img src="https://flagcdn.com/48x36/gb.png" width="28" height="21" alt="EN"> English Instructions

**Translate adventures, journals, items, actors, folders, and compendiums for ANY tabletop RPG system using modern AI – free of charge without API costs.**

Phil's Universal AI Translator connects your Foundry VTT world with the power of modern AI (Google Gemini, ChatGPT, Claude, Copilot, Perplexity). The standout feature: **You don't need expensive API keys!** The module acts as an intelligent "Prompt Engineer" tailored for the free web interfaces of AI providers.

> 🧙‍♂️ **Deep Dive:** Want to discover how the automated safety shield, LinkProtection, and prompt pipelines work? Read the [Grimoire of Laziness (funktion.md)](funktion.md).
>
> 🧐 **For the refined scholar:** Prefer eloquent academic phrasing? Read the [System Architecture Exegesis (funktionen.md)](funktionen.md).

## 🚀 Key Highlights & Features (v1.0.0)

* 🌍 **True Multilingual (Any Language ➔ Any Language):** Translate not just from English to German, but between any language pair supported by your AI (e.g. English ➔ German, French, Spanish, Italian, Portuguese, Polish, Ukrainian, Japanese, Chinese, or German ➔ English, etc.).
* 🌐 **100% Universal & System-Agnostic:** Works with every game system on Foundry (Pathfinder 2e, D&D 5e, Shadowrun, Call of Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20, Savage Worlds, and custom systems).
* 🛡️ **Foundry v14 Ready:** Fully built for Foundry VTT v12, v13, and v14 with ApplicationV2 sheets and modern lifecycle event handling.
* 📢 **Narrative Read-Aloud (📢):** Red bullhorn icon in window headers and floating text-selection widget for instant on-the-fly GM narrative translations during sessions.
* 🔄 **Non-Destructive Runtime Overlay:** Seamlessly toggle between translations and original text in sheet headers without overwriting original data.
* 📚 **12-Category In-World Lore Glossary:** Automatically builds and manages an in-world journal (*AI Glossar*) categorized into 12 thematic sections (Locations, NPCs, Deities, Organizations, Biomes, Species, Cultures, Classes, Spells/Items, Rules, Languages, General).
* 🛡️ **LinkProtection Protocol:** Protects `@UUID[...]`, `@Embed[...]`, `@Check[...]`, `@Damage[...]`, `@Item[...]`, `@Actor[...]`, inline rolls `[[...]]`, and HTML structures from AI corruption.
* 🔍 **Campaign Integrity Auditor:** Scans your entire campaign for missing text chunks, broken backup links, and encoding glitches with 1-click automated repairs.
* ⚡ **Smart-Sync & Memory:** Automatically restores translations across documents after official system/module updates in 1 click.
* 📊 **Live Capacity Meter:** Real-time character counter and progress bar with automatic chunking for massive adventure texts.
* 💾 **100% Safety Backups:** Automatically creates an indestructible duplicate before applying changes.

## 📦 Installation

1. Open Foundry VTT.
2. Navigate to the **Add-on Modules** tab.
3. Click **Install Module**.
4. Paste the following **Manifest URL** into the bottom input field:
   ```text
   https://github.com/PhilsModules/phils-universal-translator/releases/latest/download/module.json
   ```
5. Click **Install**.

## 📖 Quickstart (4-Step Workflow)

1. **Open the Studio:** Click the **`Universal Übersetzer`** button in the header of Journals, Items, Actors, or Compendiums (or right-click any folder/document).
2. **Step 1 (Document & Target Language):** Drag & drop your document/folder into the window. Select your target language (German, French, Spanish, English, etc.), mode (*Translate*, *Proofread*, *Glossary*), and genre profile.
3. **Step 2 (Prompt & AI):** Click **"Copy Prompt & Open AI"**. The optimized prompt is copied to your clipboard and your chosen AI web interface opens in your browser.
4. **Step 3 (Paste Response):** Paste the AI's response with `CTRL + V` and click **"Analyze Response"**.
5. **Step 4 (Preview & Save):** Review the side-by-side rich diff view, accept new glossary terms, and click **"Apply & Save"** – all done!

---

# <img src="https://flagcdn.com/48x36/de.png" width="28" height="21" alt="DE"> Deutsche Anleitung

**Übersetze Abenteuer, Journale, Items, Akteure, Ordner und Kompendien für jedes beliebige Rollenspiel-System kostenlos mit modernster KI.**

Phil's Universal AI Translator verbindet deine Foundry VTT Welt mit der Power moderner KI (Google Gemini, ChatGPT, Claude, Copilot, Perplexity). Das Besondere: **Du brauchst keine teuren API-Keys!** Das Modul arbeitet als intelligenter "Prompt-Engineer" für die kostenlosen Web-Versionen der KI-Anbieter.

> 🧙‍♂️ **Deep Dive:** Willst du wissen, wie der automatische Schutzschild und die Prompt-Architektur funktionieren? Lies das [Grimoire der Faulheit (funktion.md)](funktion.md).
>
> 🧐 **Für das gehobene Auditorium:** Bevorzugst du eine eloquente Ausdrucksweise? [Exegese der Systemarchitektur (funktionen.md)](funktionen.md).

## 🚀 Highlights & Features (v1.0.0)

* 🌍 **Echtes Multilingual (Jede Sprache ➔ Jede Sprache):** Übersetze nicht nur von Englisch nach Deutsch, sondern zwischen beliebigen Sprachen (z.B. Englisch ➔ Deutsch, Französisch, Spanisch, Polnisch, Italienisch, Ukrainisch, Japanisch, Chinesisch oder Deutsch ➔ Englisch uvm.).
* 🌐 **100% Universell & System-Agnostisch:** Funktioniert mit jedem Foundry-System (Pathfinder 2e, D&D 5e, Shadowrun, Call of Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20, Savage Worlds uvm.).
* 🛡️ **Foundry v14 Ready:** Volle Kompatibilität mit Foundry VTT v12, v13 und v14 inklusive ApplicationV2-Sheets und moderner Event-Steuerung.
* 📢 **Vorlesetext-Schnellübersetzung:** Rotes Vorlese-Symbol (📢) in Fensterleisten und schwebendes Textmarkierungs-Widget für blitzschnelle Sofort-Übersetzung am Spieltisch.
* 🔄 **Non-Destruktives Runtime-Overlay:** Schalte in Sheets per Knopfdruck nahtlos zwischen Sprachen um, ohne die Originale zu überschreiben.
* 📚 **12-Kategorien Lore-Glossar:** Verwaltet ein in-world Journal (*AI Glossar*) mit 12 thematischen Kategorien (Orte, Charaktere, Götter, Organisationen, Biome, Spezies, Kulturen, Klassen, Zauber, Kosmologie, Sprachen, Spielregeln).
* 🛡️ **Automatischer LinkProtection-Schutz:** Schützt `@UUID[...]`, `@Embed[...]`, `@Check[...]`, `@Damage[...]`, Würfelwürfe und HTML-Strukturen vor Beschädigung.
* 🔍 **Kampagnen-Auditor:** Scannt deine gesamte Kampagne auf Vollständigkeit, tote Verlinkungen, fehlende Text-Chunks und Umlaute-Glitches mit 1-Klick-Reparatur.
* ⚡ **Smart-Sync nach System-Updates:** Stellt nach offiziellen Abenteuer- oder System-Updates alle Übersetzungen mit 1 Klick kostenlos aus dem Translation Memory wieder her.
* 📊 **Live-Kapazitätsanzeige:** Zeigt Zeichenmenge und Batches in Echtzeit an und teilt riesige Texte automatisch in passende Teil-Batches auf.
* 💾 **100% Verlässliche Sicherheits-Backups:** Erstellt vor jeder Änderung automatisch ein unzerstörbares World-Backup.

## 📦 Installation

1. Öffne Foundry VTT.
2. Gehe zum Reiter **Add-on Modules**.
3. Klicke auf **Install Module**.
4. Füge die folgende **Manifest URL** unten ein:
   ```text
   https://github.com/PhilsModules/phils-universal-translator/releases/latest/download/module.json
   ```
5. Klicke auf **Install**.

## 📖 Schnellstart (4-Schritte Workflow)

1. **Übersetzer öffnen:** Klicke oben im Reiter **Journalnotizen**, **Items**, **Akteure** oder **Kompendien** auf den Button **`Universal Übersetzer`** (oder nutze den Rechtsklick auf jeden Eintrag oder Ordner).
2. **Schritt 1 (Auswahl & Zielsprache):** Ziehe dein Dokument per Drag & Drop in das Fenster. Wähle Zielsprache (z.B. Deutsch, Französisch, Spanisch etc.), Modus (*Übersetzen*, *Lektorat*, *Glossar*) und Genre-Profil.
3. **Schritt 2 (Prompt & KI):** Klicke auf **"Prompt kopieren & KI öffnen"**. Der optimierte Prompt landet in deiner Zwischenablage und dein KI-Anbieter (z.B. Gemini) öffnet sich im Browser.
4. **Schritt 3 (Antwort einfügen):** Füge die Antwort der KI mit `STRG + V` ein und klicke auf **"Antwort analysieren"**.
5. **Schritt 4 (Vorschau & Speichern):** Prüfe die Side-by-Side Gegenüberstellung und klicke auf **"Änderungen anwenden & Speichern"** – fertig!

---

# ⚖️ License
**Phil's Universal AI Translator** is open-source software licensed under the [GPL-3.0 License](LICENSE).

<div align="center">
    <h2>❤️ Support the Development</h2>
    <p>If you enjoy this module and want to support open-source development for Foundry VTT, check out my Patreon!</p>
    <a href="https://www.patreon.com/PhilsModules">
        <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" width="200" />
    </a>
    <br><br>
    <p><i>Made with ❤️ for the Foundry VTT Community</i></p>
</div>
