# 🧙‍♂️ Phil's Universal AI Translator – The "Grimoire of Laziness"

<div align="right">
  <a href="funktion.md">🇩🇪 Zum deutschen Grimoire der Faulheit wechseln</a>
</div>

Welcome to the club of relaxed Game Masters. You've chosen **Phil's Universal AI Translator**. Excellent choice.

Perhaps you're sitting back with a coffee, wondering: *"How on earth does this wizardry actually work without expensive API keys, and why isn't my Foundry world blowing up in the process?"*

Here is the deep dive under the hood – explained for people who love running epic campaigns, but get cold sweats at the sight of API invoices and raw JSON code.

---

## 🏗️ The Core Principle: The Biological Data Pipeline

Modern AI models like Google Gemini, ChatGPT, or Claude are phenomenal at translating fantasy and sci-fi lore. But direct API access costs money, requires credit cards, and locks accounts if you feed them a thick rulebook.

The solution: **You are the pipeline!**

1. **The module preps everything into bite-sized packets:** It scans your document, protects Foundry entity links (`@UUID`, `@Embed`, roll formulas), injects campaign glossary terms, and constructs a finely tuned prompt.
2. **Copy & Open AI:** 1 click on *"Copy Prompt & Open AI"* places the prompt onto your clipboard and launches your browser.
3. **Paste (`CTRL + V`):** The AI does the heavy lifting.
4. **Retrieve & Apply:** You copy the response, paste it back into the studio – and the module parses the JSON, heals character encoding, and updates your world documents in milliseconds!

---

## 🛡️ The "Chastity Belt Protocol" (Link & Syntax Protection)

AIs love being "creative". But with Foundry links like `@UUID[JournalEntry.abc123xyz]{The Crypt}`, creativity is fatal. If the AI tries to translate the internal database ID `abc123xyz`, the link is broken permanently.

### How the module protects your links:
- **LinkProtection Engine:** All links are detected and tagged before sending to the AI.
- **Intelligent Reconstruction:** Even if an AI mangles an ID, the LinkProtection parser identifies the intended target and restores the valid link target.
- **Display Label Translation:** The optional human-readable text inside the curly braces `{...}` is cleanly translated into your target language, while the technical target remains untouched.

---

## 📚 The In-World Glossary: Bookkeeping on Autopilot

Nobody enjoys manually curating vocabulary spreadsheets. That's why the module compels the AI to handle this bookkeeping automatically during every translation run:

1. **Detection:** With every translation, the AI identifies new proper nouns, places, NPCs, and unique terms.
2. **Categorization:** Terms are classified directly into 12 thematic categories (Locations, Deities, Organizations, Biomes, Species, Spells, etc.).
3. **1-Click Import:** At Step 4 of the Studio, all new terms are imported into your in-world **`AI Glossar`** journal with a single click.
4. **Consistency:** In the next chapter, the module references all accumulated terms to guarantee 100% naming consistency across your entire multi-year campaign!

---

## 🔒 The Parachute: 100% Reliable Backups

Because safety is paramount:
- Before a single letter in your world is modified, the module automatically duplicates the original document as `Document Name (Backup)`.
- If you ever wish to revert, a single click on **"Restore Backup"** resets the document to its pristine original state.
