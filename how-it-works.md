# Functional Overview: Phil's Universal Translator

<div align="right">
  <a href="funktion.md">Zur deutschen Funktionsübersicht wechseln</a>
</div>

This overview explains how Phil's Universal Translator operates under the hood, how it avoids recurring API costs, and how it protects your game data throughout the translation lifecycle.

---

## The Core Concept: The Structured Local Pipeline

Direct AI API integrations often introduce recurring subscription costs, usage limits, and account restrictions when working through extensive adventure books.

Phil's Universal Translator solves this by decoupling translation from paid API endpoints:

1. **Structured Preparation:** The module extracts your content, marks internal Foundry links (`@UUID`, `@Embed`, roll formulas) for protection, inserts relevant campaign glossary entries, and formats everything into a clean, optimized prompt.
2. **Web AI Execution:** A single click copies the prompt to your clipboard and opens your chosen AI provider in your browser (such as Gemini or ChatGPT).
3. **Execution:** The AI processes the prompt using its full conversational context window without incurring API charges.
4. **Ingestion and Verification:** You paste the response back into the studio. The module validates the JSON structure, restores special character encoding, and updates your world documents.

---

## Link and Syntax Protection

Language models can occasionally alter technical identifiers. If a model modifies the internal ID in a link like `@UUID[JournalEntry.abc123xyz]{The Crypt}`, the connection to that document is broken.

### Protection Measures:
- **Link Tagging:** Every Foundry entity link is detected and protected prior to generating the prompt.
- **Automated Repair:** The LinkProtection parser verifies all returned entity targets against original references and fixes corrupted IDs automatically.
- **Display Label Handling:** Display names within curly brackets `{...}` are translated smoothly into the target language while the technical target path remains unchanged.

---

## Automated In-World Glossary

Maintaining campaign consistency across long-running adventures requires disciplined terminology tracking:

1. **Automatic Discovery:** The AI identifies newly introduced proper nouns, locations, factions, and rules concepts during each translation run.
2. **Category Classification:** New terms are assigned to one of 12 distinct categories (Locations, Characters, Deities, Organizations, Biomes, Species, Cultures, Classes, Spells and Items, Rules, Languages, and General).
3. **Seamless Integration:** Approved terms are automatically appended to your in-world **AI Glossar** journal.
4. **Long-Term Consistency:** Subsequent translation passes reference this accumulated dictionary to ensure consistent naming across all chapters.

---

## Safety Backups

Data safety is built into every operation:
- Before any changes are committed, the module generates a complete duplicate snapshot labeled `Document Name (Backup)`.
- If an update needs to be reverted, clicking **Restore Backup** restores the document to its exact previous state immediately.
