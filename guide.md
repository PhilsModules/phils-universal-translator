# Comprehensive User Guide: Phil's Universal Translator (v1.0.2)

<div align="right">
  <a href="anleitung.md">Zur deutschen Anleitung wechseln</a>
</div>

Phil's Universal Translator is a local-first workflow utility for game masters to prepare, protect, and translate tabletop RPG content directly inside Foundry VTT by connecting directly to locally hosted language models (Ollama, LM Studio, LocalAI) with zero API costs and full data privacy, or consulting external reference tools in the browser.

---

> [!CAUTION]
> ### Private Use & Copyright Notice (§ 23, § 53 UrhG / Fair Use)
> Translating legitimately purchased game material strictly for personal, private gaming prep at your home game table is legally permitted in many jurisdictions (such as EU and German copyright law § 23 (1), § 53 (1) UrhG). Public redistribution, commercial exploitation, or re-hosting of proprietary material is prohibited.
> 
> *⚠️ Important Notice on External Cloud AI:* Uploading or transmitting copyrighted proprietary texts to external online AI services without permission may violate copyright laws and terms of service. For protected proprietary content, translations must be processed strictly via locally hosted offline language models (e.g. Ollama).

---

## 1. Initial Setup and Local LLM Configuration

1. **First-Run Wizard:** When you first open the module as Game Master, the **Local LLM Setup Wizard** prompts you for your local server endpoint (default: `http://localhost:11434` for Ollama) and your installed model tag (e.g. `llama3`, `mistral`, `gemma2`, `phi3`, or `qwen2.5`).
2. **Test Connection:** Click **Test Connection** to verify that your local Ollama server is responding and view loaded models.
3. **Module Settings:**
   - **Local LLM Endpoint:** Configure your local server URL (`http://localhost:11434` or LM Studio `http://localhost:1234/v1`).
   - **Local Model:** Set your local model name (`llama3`).
   - **External Web Assistant:** Select your fallback browser assistant for manual consultation (Google Gemini, ChatGPT, Claude, Copilot, Perplexity).
   - **Default Target Language:** Set your primary target language (German, English, French, Spanish, Italian, Polish, Ukrainian, Japanese, etc.).
   - **Default Setting Profile:** Select your campaign genre (Fantasy, Grimdark, Sci-Fi, Cyberpunk, Horror, Modern, Post-Apocalyptic, or Custom).

---

## 2. The Translation Studio Workflow

The module supports two workflows: **Direct Local Translation** (via Ollama) and **Web Consultation** (via Clipboard).

### Step 1: Document and Language Selection
1. Open the studio using the **Universal Translator** button in any directory header (Journals, Items, Actors, Compendiums) or via right-click on any entry or folder.
2. Drag and drop your target document or entire folder into the drop zone.
3. Select your target language, mode (*Translate*, *Proofread*, or *Extract Glossary*), and setting profile.
4. Check the desired pages or use the helper buttons **Only Unprocessed** or **Next Batch**.
5. Click **Generate Prompt & Continue**.

### Step 2: Translation Execution (Local Direct or Web Assistant)
* **Option A — Direct Local Translation (Recommended):** Click **Direct Local Translate (Ollama)**. Foundry connects directly to your local Ollama instance, processes the translation in the background, and forwards you directly to Step 4 (Diff Preview).
* **Option B — Web Assistant Consultation:** Click **Copy Prompt & Open Assistant** to copy the prompt to your clipboard and open your chosen browser tool. Paste the response into Step 3.

### Step 3: Paste Response and Analyze (Web Mode Only)
1. Paste the generated JSON output from your browser tool into the text area.
2. Click **Analyze Response**. The built-in validator verifies JSON syntax, UTF-8 character encoding, and link integrity.

### Step 4: Preview and Apply
1. Inspect the translation in the **Side-by-Side Diff Viewer**.
2. Review newly extracted terms and stage them for your in-world **AI Glossar** journal.
3. Click **Apply Changes & Save**. An automatic safety backup of your original document is preserved before saving.

---

## 3. Header Utility Tools

- **Ollama Setup:** Quick access to re-test and configure your local LLM server endpoint.
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
