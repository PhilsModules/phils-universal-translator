# 📖 Comprehensive Guide: Phil's Universal AI Translator (v1.0.0)

<div align="right">
  <a href="anleitung.md">🇩🇪 Zur deutschen Anleitung wechseln</a>
</div>

Welcome to the ultimate universal translation tool for Foundry Virtual Tabletop (v14 ready). This module enables you to translate journals, items, actors, entire folders, and compendium packs for any tabletop RPG system using modern AI (Gemini, ChatGPT, Claude, Copilot, Perplexity) with zero API costs, consistency, and roleplay-fitting immersion into any target language (German, English, French, Spanish, Italian, Polish, Ukrainian, Japanese, etc.).

---

## 1. Getting Started & Configuration

1. **Activate Module**: Enable the module in your Foundry VTT world under `Settings` > `Manage Modules`.
2. **Configure Module Settings**:
   - `Settings` > `Module Settings` > `Phil's Universal AI Translator`:
   - **AI Provider**: Choose your preferred AI service (Google Gemini, ChatGPT, Claude, Copilot, Perplexity).
   - **Default Target Language**: Choose your primary target language (e.g., 🇩🇪 German, 🇫🇷 French, 🇪🇸 Spanish, 🇮🇹 Italian, 🇵🇱 Polish, 🇺🇦 Ukrainian, 🇯🇵 Japanese, 🇬🇧 English, or Custom).
   - **Default Source Language**: Auto-detect or specific source language.
   - **Default Setting Profile**: Choose your primary genre (e.g., Fantasy, Grimdark, Sci-Fi, Cyberpunk, Horror, Modern).
   - **Batch Size**: Default 10 entries per batch.
   - **Max Batch Capacity**: 12,000 characters (optimized for zero truncation and reliable AI output).

---

## 2. The 4-Step Translation Studio

The module guides you through an intuitive 4-step wizard:

### Step 1: Setup & Document Selection
1. Open the studio via the **`Universal Übersetzer` / `Universal Translator`** header button in Journals, Items, Actors, or Compendiums (or right-click any folder or document).
2. Drag & drop your target document or entire folder into the drop zone.
3. Select your target language, mode (*Translate*, *Proofread*, *Glossary*), and setting profile.
4. Select the desired pages or click *"Only Unprocessed"* / *"Next Batch"*.
5. The **Live Capacity Meter** displays character count in real-time and automatically chunks oversized texts into manageable batches.
6. Click **"Generate Prompt & Continue"**.

### Step 2: Copy Prompt & Open AI
1. Click **"Copy Prompt & Open AI"**.
2. The optimized prompt is copied to your clipboard and your chosen AI web interface opens in your browser.
3. Paste the prompt into the AI with `CTRL + V` and hit send.
4. Copy the AI's generated JSON response.

### Step 3: Paste Response & Analyze
1. Return to Foundry VTT (the studio will already be waiting at Step 3).
2. Paste the response with `CTRL + V` and click **"Analyze Response & Verify"**.
3. The parser strips markdown code fences, heals UTF-8 character encoding (Mojibake protection), and validates entity links.

### Step 4: Preview & Save
1. Review the translated content in the **Side-by-Side Diff Viewer**.
2. Newly detected glossary terms are listed and automatically staged for your in-world **AI Glossar** journal.
3. Click **"Apply Changes & Save"**. A safety backup of your original document is automatically created before applying any changes.

---

## 3. Header Utility Tools

- 🛡️ **Auditor**: Full world integrity scan for all campaign documents (checks for missing text chunks, broken links, and encoding glitches with 1-click repairs).
- ⚡ **Smart-Sync**: Re-applies existing translations from the Translation Memory after official module/system updates in 1 click.
- 🔗 **Links Sync**: Remaps compendium links (@UUID/@Embed) to matching imported world documents.
- 💾 **Backup & Import**: Exports and imports the entire translation memory as a portable `.json` file.
- 🔍 **Fulltext Search**: Search and replace across all world journals with RegEx support.
- 📚 **Glossary Manager**: Search, add, edit, and alphabetically sort all glossary terms.
- 📊 **Statistics**: View translated word counts and estimated time saved.

---

## 4. Narrative Read-Aloud Translation (📢)

For spontaneous on-the-fly preparation at the virtual table:
- Every sheet and window header features a red bullhorn icon (**📢 Vorlesetext**).
- One click loads the content directly into the Translation Studio for an instant translation of the passage.
- Selecting any text in-game displays a floating widget to quickly translate selected passages.
