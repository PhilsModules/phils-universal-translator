# Comprehensive User Guide: Phil's Universal Translator (v1.0.0)

<div align="right">
  <a href="anleitung.md">Zur deutschen Anleitung wechseln</a>
</div>

Phil's Universal Translator enables game masters to translate journals, items, actors, folders, and compendium packs for any tabletop RPG system using modern AI models (Gemini, ChatGPT, Claude, Copilot, Perplexity) with zero subscription fees, consistent terminology, and natural phrasing across any target language.

---

## 1. Initial Setup and Configuration

1. **Activate the Module:** Enable the module in your Foundry VTT world under **Settings** > **Manage Modules**.
2. **Configure Settings:**
   - Navigate to **Settings** > **Module Settings** > **Phil's Universal Translator**.
   - **AI Provider:** Select your preferred AI service (Google Gemini, ChatGPT, Claude, Copilot, Perplexity).
   - **Default Target Language:** Set your primary target language (German, French, Spanish, Italian, Polish, Ukrainian, Japanese, English, or Custom).
   - **Default Source Language:** Set to automatic detection or a specific source language.
   - **Default Setting Profile:** Select your primary campaign genre (Fantasy, Grimdark, Sci-Fi, Cyberpunk, Horror, Modern, Post-Apocalyptic, or Custom).
   - **Batch Size:** Default number of documents selected per pass (default: 10).
   - **Max Batch Capacity:** Character threshold per prompt (default: 12,000 characters) to avoid AI token truncations.

---

## 2. The 4-Step Translation Studio

The module guides you through an organized 4-step workflow:

### Step 1: Document and Language Selection
1. Open the studio using the **Universal Translator** button in any directory header (Journals, Items, Actors, Compendiums) or via right-click on any entry or folder.
2. Drag and drop your target document or entire folder into the drop zone.
3. Select the target language, mode (*Translate*, *Proofread*, or *Extract Glossary*), and setting profile.
4. Check the desired pages or use the helper buttons **Only Unprocessed** or **Next Batch**.
5. The **Live Capacity Meter** calculates the total character volume and splits large collections into clean batches automatically.
6. Click **Generate Prompt & Continue**.

### Step 2: Copy Prompt and Launch AI
1. Click **Copy Prompt & Open AI**.
2. The structured prompt is copied to your clipboard while your browser opens the selected AI provider.
3. Paste the prompt into the AI interface (`CTRL + V`) and submit it.
4. Copy the AI's generated JSON response.

### Step 3: Paste Response and Analyze
1. Return to Foundry VTT (the Translation Studio remains open at Step 3).
2. Paste the response into the text area and click **Analyze Response**.
3. The parser cleans code fences, verifies UTF-8 character encoding, and validates all internal entity links.

### Step 4: Preview and Apply
1. Inspect the translation in the **Side-by-Side Diff Viewer**.
2. Review newly extracted terms and stage them for your in-world **AI Glossar** journal.
3. Click **Apply Changes & Save**. An automatic safety backup of your original document is preserved before saving.

---

## 3. Header Utility Tools

- **Campaign Auditor:** Runs an integrity audit across all campaign journals, checking for broken links, missing text blocks, and encoding issues with one-click repair actions.
- **Smart-Sync:** Re-applies existing translations from the Translation Memory when official system or module updates overwrite world files.
- **Links Sync:** Remaps compendium links (`@UUID` and `@Embed`) to existing world documents with safety verification.
- **Backup and Import:** Exports and imports your translation memory as a portable JSON file.
- **Fulltext Search:** Performs search and replace operations across all journals with regular expression support.
- **Glossary Manager:** Search, edit, categorize, and alphabetically sort all campaign terminology.
- **Translation Statistics:** Tracks total translated words and estimated preparation time saved.

---

## 4. Narrative Read-Aloud Tool

For spontaneous translations during live sessions:
- Window headers and sheets feature a dedicated **Vorlesetext / Read-Aloud** header button.
- Clicking the button loads the active window content directly into the Translation Studio for quick translation.
- Selecting any text inside an open sheet displays a floating button to translate the highlighted snippet immediately.
