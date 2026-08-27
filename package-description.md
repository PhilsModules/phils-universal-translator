# Phil's Universal Translator — Foundry VTT Package Description

Below is the clean, technical description formatted for the official Foundry VTT package directory and community listing.

---

## Short Summary (for package list views)
A local translation assistant and workflow utility for personal Foundry VTT game preparation with zero API costs, connecting directly to locally hosted language models (Ollama/LocalAI) or external consultation tools with full link protection and lore glossary support.

---

## Full Description (for Foundry VTT Package Page)

Phil's Universal Translator is a local-first workflow utility designed to help Game Masters prepare personal gaming sessions by structuring, protecting, and translating world text into any language directly inside Foundry VTT.

The module operates as an intelligent local bridge between Foundry VTT data and your own locally hosted language models (such as private setups running via Ollama, LM Studio, or LocalAI) or web-based reference assistants. It contains no pre-generated AI text or assets and requires zero paid API subscriptions.

### 🔒 Copyright & Private Use Notice
Translating legitimately acquired game material strictly for personal, private gaming preparation is legally permitted under many jurisdictions, including EU and German copyright law:
* **Section 23 (1) UrhG (Adaptations):** Adaptations or transformations of a work for purely personal, private use without publication or exploitation do not infringe copyright.
* **Section 53 (1) UrhG (Reproduction for private use):** Single copies for private, non-commercial use on any medium are explicitly permitted.

*Translations created with this module are strictly intended for private home games. Public redistribution, commercial exploitation, or re-hosting of translated proprietary material is prohibited.*

*⚠️ **Important Cloud AI Notice:** Uploading or transmitting copyrighted proprietary texts to external third-party cloud LLM services may violate copyright regulations and third-party terms. Users should strictly process protected content via locally hosted, offline language models (such as Ollama).*

### Key Capabilities

- **Local-First & Offline Capable:** Connects directly to local LLM instances (Ollama, LM Studio, LocalAI) running privately on your machine for zero API costs and 100% data privacy.
- **Dual Workflow (Local & Web Consultation):** Execute 1-click translations directly through your local Ollama instance or use the structured clipboard workflow to consult browser assistants.
- **LinkProtection Protocol:** Guarantees that internal entity links (`@UUID`, `@Embed`, `@Check`, `@Damage`), inline roll formulas (`[[/r ...]]`), and HTML structures are preserved without corruption.
- **12-Category In-World Lore Glossary:** Automatically builds and updates a dedicated journal (*AI Glossar*) categorized into locations, characters, deities, factions, biomes, species, cultures, classes, items, rules, and languages to maintain long-term naming consistency.
- **Campaign Integrity Auditor:** Scans world documents for broken entity links, missing text blocks, or character encoding issues, offering one-click batch repairs.
- **System-Agnostic Core:** Operates natively with any game system in Foundry VTT (Pathfinder 2e, D&D 5e, Shadowrun, Call of Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20, Savage Worlds, or custom systems).
- **Foundry v14 Ready:** Built on modern ApplicationV2 foundations with verified compatibility spanning Foundry v12, v13, and v14.
- **Non-Destructive Runtime Overlay:** Toggle between translated text and original source content directly in document sheets without altering underlying database files.
- **Translation Memory & Smart-Sync:** Stores translations locally and re-applies them automatically when official module updates occur.
- **Automatic Safety Backups:** Generates an immutable duplicate of every document before changes are written, ensuring any modification can be reverted instantly.

### How It Works

1. **Select Content:** Drag and drop your journal, item, actor, folder, or compendium pack into the Translation Studio.
2. **Translate Locally or Generate Prompt:** Click **Direct Local Translate** to process the batch directly via your local Ollama server, or copy the prompt for manual browser consultation.
3. **Validate & Diff Preview:** The built-in parser validates syntax, heals character encoding artifacts, and checks link integrity before presenting a side-by-side diff.
4. **Review & Save:** Inspect translated passages, review newly discovered lore terms, and apply updates safely to your world.

### Documentation & Source Code

- **GitHub Repository:** https://github.com/PhilsModules/phils-universal-translator
- **English User Guide:** https://github.com/PhilsModules/phils-universal-translator/blob/main/guide.md
- **Deutsche Anleitung:** https://github.com/PhilsModules/phils-universal-translator/blob/main/anleitung.md
- **License:** GNU General Public License v3.0
