# Changelog & Updates: Phil's Universal Translator

All notable changes and version milestones for the module will be documented here.

---

## [1.0.2] - 2026-08-27
### 🦙 Local-First LLM Architecture & Privacy Compliance
- **First-Run Local LLM Setup Wizard**:
  - Automatically guides the Game Master through setting up their local Ollama/LocalAI endpoint (`http://localhost:11434`) and model selection (`llama3`).
  - Includes a live connection test button with status feedback.
  - Re-accessible at any time via the top toolbar or module settings.
- **Direct Local Translation via Ollama REST API**:
  - Step 2 now features a **Direct Local Translate** button to send prompts directly to the locally running LLM without leaving Foundry VTT.
  - Displays live loading states and automatically forwards responses into the Step 4 Diff Preview.
- **Discreet Web Assistant Settings**:
  - Reframed the AI provider setting to *"External Web Assistant / Reference Consultation (Browser)"* to distinguish between offline local execution and web-based consultation.
- **Copyright & Private Use Notice (§ 23, § 53 UrhG)**:
  - Integrated explicit legal disclaimers regarding personal, private tabletop gaming preparation across the setup wizard, Studio footer, and store documentation.
- **Full Dual-Language Support (DE & EN)**:
  - All new setup wizard interfaces, settings, error messages, tooltips, and documentation are 100% localized in German and English.

---

## [1.0.1] - 2026-08-26
### 🛠️ Bug Fixes & Improvements
- **Target Language Selection Fixed**: Fixed an error when selecting a target language in the dropdown menu.
- **Language Switching & Translation**:
  - The module interface now automatically switches to English if Foundry is set to English or any other language besides German.
  - When Foundry is set to German, the entire interface displays in German.
- **Header Icon & Quick Translation Fixed**:
  - Fixed the red translation icon in window headers to display properly across all themes and systems.
  - Clicking the translation icon on journals and journal pages now correctly opens them directly in the Translation Studio.
- **Clean Universal Starter Glossary**:
  - Removed pre-filled rules terms in favor of a clean, neutral template with one simple example per category.
- **Settings Initialization**:
  - Fixed a startup error related to quick selection settings.

---

## [1.0.0] - 2026-08-26
### 🚀 Initial Release
- **Universal Translation**: Translate content between any languages supported by your AI.
- **System Agnostic**: Works with every game system on Foundry VTT.
- **Dynamic Prompts & Setting Profiles**: Automatic system detection with selectable genre presets (Fantasy, Sci-Fi, Horror, Cyberpunk, and more).
- **Lore Glossary**: Automatically creates and manages a world glossary with categories and alphabetical sorting.
- **Core Starter Terms**: Neutral starter categories for lore and terminology.
- **4-Step Translation Studio**:
  - Drag and drop journals, items, actors, folders, or compendiums.
  - Live character meter with automatic splitting for large documents.
  - 1-Click prompt copying and direct button to open your AI.
  - Side-by-side comparison before saving changes.
- **Narrative Read-Aloud Button**: Translate boxed text and descriptions with one click.
- **Campaign Integrity Auditor**: Scans the world for missing text, broken links, or broken special characters and fixes them automatically.
- **Runtime Overlay**: Easily switch between translated text and original text.
- **Smart Link Remapper**: Updates compendium links to point to your existing world documents.
- **World-Wide Search & Replace**: Search and replace text across all journals.
- **Translation Memory & Statistics**: Saves previous translations and calculates saved working hours.
