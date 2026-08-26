# Phil's Universal AI Translator — Foundry VTT Package Description

Below is the clean, human-written description formatted for the official Foundry VTT package directory and community listing.

---

## Short Summary (for package list views)
Universal, AI-powered multilingual translation helper for any tabletop RPG system in Foundry VTT (v14 ready) featuring dynamic lore glossary, update-proof translation memory, non-destructive runtime overlay, narrative read-aloud translation, campaign auditor, and side-by-side diff previews.

---

## Full Description (for Foundry VTT Package Page)

Phil's Universal AI Translator provides game masters with a structured, reliable way to translate adventure modules, journals, items, actors, folders, and compendium packs into any language directly inside Foundry VTT.

Unlike traditional translation modules that require paid API subscriptions or complex key configurations, this module operates as an intelligent local bridge between your world data and modern web-based AI services (including Google Gemini, ChatGPT, Claude, Microsoft Copilot, and Perplexity). You retain complete control over your content with zero recurring costs.

### Key Capabilities

- **True Multilingual Translation:** Translate between any language pair supported by your chosen AI model (English to German, French, Spanish, Italian, Portuguese, Polish, Ukrainian, Japanese, Chinese, or vice versa).
- **System-Agnostic Core:** Works natively across all Foundry VTT systems, including Pathfinder 2e, D&D 5e, Shadowrun, Call of Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20, Savage Worlds, and custom community systems.
- **Foundry v14 Ready:** Built on modern ApplicationV2 foundations with verified support for Foundry v12, v13, and v14.
- **LinkProtection Protocol:** Protects internal entity links (`@UUID`, `@Embed`, `@Check`, `@Damage`), dice rolls, and HTML formatting from being modified or broken by language models.
- **12-Category Lore Glossary:** Automatically builds and updates an in-world journal (*AI Glossar*) categorized into locations, characters, deities, factions, biomes, species, cultures, classes, items, rules, and languages to maintain long-term naming consistency.
- **Campaign Integrity Auditor:** Scans your active world documents for broken links, missing text blocks, or character encoding issues, offering one-click batch repairs.
- **Non-Destructive Runtime Overlay:** Toggle between translated text and original source content directly in document sheets without altering underlying database files.
- **Narrative Read-Aloud Tool:** Trigger instant translations directly from window headers or by highlighting text in open sheets during live sessions.
- **Translation Memory & Smart-Sync:** Stores translated content locally and re-applies it automatically when official modules or system packages receive updates.
- **Automatic Safety Backups:** Duplicates documents prior to writing changes, ensuring any modification can be reverted instantly.

### How It Works

1. **Select Document:** Open the studio from any directory header or context menu and drag your document or folder into the drop zone.
2. **Copy Structured Prompt:** Click the copy button to place an optimized prompt on your clipboard while your browser opens your chosen AI interface.
3. **Paste Response:** Paste the generated JSON output back into the studio. The built-in parser validates syntax, heals encoding artifacts, and checks link integrity.
4. **Review & Save:** Inspect the side-by-side diff preview, review newly discovered glossary terms, and apply the update to your world.

### Documentation & Source Code

- **GitHub Repository:** https://github.com/PhilsModules/phils-universal-translator
- **User Guide:** https://github.com/PhilsModules/phils-universal-translator/blob/main/guide.md
- **Deutsche Anleitung:** https://github.com/PhilsModules/phils-universal-translator/blob/main/anleitung.md
- **License:** GNU General Public License v3.0
