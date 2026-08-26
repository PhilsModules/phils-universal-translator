# System Architecture: Phil's Universal Translator

<div align="right">
  <a href="funktionen.md">Zur deutschen Systemarchitektur wechseln</a>
</div>

A detailed technical specification of the software architecture, data structures, and processing pipelines of **Phil's Universal Translator** for Foundry Virtual Tabletop (v14 ready).

---

## 1. System Overview & Module Architecture

The module is engineered according to modern modular ES-Module specifications and Foundry's `ApplicationV2` framework. It strictly decouples user interface layers from the underlying data processing, glossary caching, and translation pipelines.

```
phils-universal-translator/
├── module.json                      # Module Manifest (v14 ready)
├── README.md                        # Primary Documentation (EN & DE)
├── guide.md / anleitung.md          # Comprehensive User Manual (EN / DE)
├── how-it-works.md / funktion.md    # Functional Overview (EN / DE)
├── architecture.md / funktionen.md  # Technical Architecture (EN / DE)
├── Updates.md                       # Changelog & Version History
├── LICENSE                          # GPL-3.0 License
├── languages/                       # Localization & Dynamic AI Prompts
│   ├── de.json                      # German UI Strings & System Prompts
│   └── en.json                      # English UI Strings & System Prompts
├── glossary/                        # Starter Core Glossary
│   └── universal-core-glossary.json # Universal TTRPG Baseline Glossary
├── translations/                    # Local Translation Store
│   └── universal-de.json            # Bundled JSON Cache
├── templates/                       # Handlebars Templates (v14 / AppV2)
│   ├── translation-studio.hbs       # Main Translation Studio Window
│   ├── campaign-auditor.hbs         # Campaign Integrity Auditor
│   ├── journal-search.hbs           # Global Fulltext Search & Replace
│   ├── glossary-search.hbs          # Interactive Glossary Manager
│   └── translation-stats.hbs        # Statistics & Metrics Modal
├── styles/                          # Stylesheet
│   └── universal-translator.css     # Dark Theme & Responsive Layout
└── scripts/                         # JavaScript Core Engine
    ├── main.js                      # Lifecycle Hooks, Menus & Settings
    ├── TranslationLogic.js          # Core Pipeline, Normalizer, Parser
    ├── UniversalGlossary.js         # In-World Glossary Management
    ├── TranslationDatabase.js       # Non-Destructive In-Memory Store
    ├── TranslationMemory.js         # Snapshots, Sync & JSON Backups
    ├── LinkProtection.js            # Foundry Link & Entity Masking
    ├── TermReplacer.js              # Tokenized Term Replacement
    ├── RuntimeTranslationEngine.js  # Live Sheet Language Switcher
    ├── QuickSelectionTranslator.js  # Floating Selection Widget & Read-Aloud
    ├── SmartLinkRemapper.js         # Compendium-to-World Link Rewriting
    ├── CampaignAuditorApp.js        # Health Scanner & 1-Click Repairs
    ├── JournalSearchApp.js          # Global Fulltext Search App
    ├── GlossarySearchApp.js         # Term Search & Editor App
    ├── TranslationStatsApp.js       # Word Counter & Metrics
    └── TranslationStudioApp.js      # 4-Step Main Translation Studio
```

---

## 2. The Data Processing Pipeline

1. **Document Normalization (`getCleanData`)**:
   - Systematically extracts translatable text and schema fields (`name`, `text.content`, `system.description`, `system.overview`, etc.) from arbitrary document types (`JournalEntry`, `JournalEntryPage`, `Item`, `Actor`, `RollTable`).
   - Strips ephemeral Foundry runtime flags and metadata noise to maximize LLM token efficiency.

2. **Glossary Tokenization (`TermReplacer` & `UniversalGlossary`)**:
   - Dynamically loads all registered terminology from the in-world journal `AI Glossar` and the core baseline glossary.
   - Injects pre-translated terms using the syntax `TargetTranslation %%Original%%`, while guaranteeing HTML tags and link targets remain completely untouched.

3. **Batch Segmentation (`createChunkedBatches`)**:
   - Calculates the exact character and byte footprint of every entry.
   - Automatically segments extensive documents along configurable thresholds (e.g. 12,000 characters) to prevent output truncation by external AI context windows.

4. **Resilient Response Parsing (`smartParseAiResponse`)**:
   - Strips conversational preamble, markdown code blocks (` ```json ... ``` `), and trailing commas.
   - Automatically corrects invalid brackets and repairs UTF-8 Mojibake encoding artifacts (e.g., `Ã¤` to `ä`).

5. **Link Integrity & LinkProtection**:
   - Cross-verifies extracted `@UUID[...]`, `@Embed[...]`, `@Check[...]`, `@Damage[...]`, `@Item[...]`, and inline rolls against original references.
   - Automatically heals malformed IDs while preserving translated display labels inside `{...}`.

6. **Transactional Persistence & Safety Backup**:
   - Automatically creates an immutable duplicate snapshot of the target document (`Document Name (Backup)`) prior to any write operations.
   - Persists translated structures and records snapshots into the world's `TranslationMemory`.
