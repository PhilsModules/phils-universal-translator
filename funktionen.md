# Systemarchitektur: Phil's Universal AI Translator

<div align="right">
  <a href="architecture.md">Switch to English Architecture</a>
</div>

Eine detaillierte Dokumentation der Softwarearchitektur, Datenstrukturen und Verarbeitungs-Pipelines von **Phil's Universal AI Translator** für Foundry Virtual Tabletop (v14 ready).

---

## 1. Systemübersicht & Modul-Architektur

Das Modul ist nach modernen modularen ES-Module-Standards und der Foundry `ApplicationV2`-Architektur aufgebaut. Es entkoppelt die Benutzeroberfläche vollständig von den zugrunde liegenden Datenverarbeitungs- und Übersetzungs-Engines.

```
phils-universal-translator/
├── module.json                      # Modul-Manifest (v14 ready)
├── README.md                        # Hauptdokumentation (EN & DE)
├── guide.md / anleitung.md          # Ausführliches Handbuch (EN / DE)
├── how-it-works.md / funktion.md    # Funktionsübersicht (EN / DE)
├── architecture.md / funktionen.md  # Technische Architektur (EN / DE)
├── Updates.md                       # Changelog & Versionshistorie
├── LICENSE                          # GPL-3.0 Lizenz
├── languages/                       # Lokalisierungsdateien & KI-Prompts
│   ├── de.json                      # Deutsche UI-Strings & Prompts
│   └── en.json                      # Englische UI-Strings & Prompts
├── glossary/                        # Starter-Glossar
│   └── universal-core-glossary.json # Universelles TTRPG-Basisglossar
├── translations/                    # Lokaler Translation-Store
│   └── universal-de.json            # Bundled JSON Cache
├── templates/                       # Handlebars Templates (v14 / AppV2)
│   ├── translation-studio.hbs       # Hauptfenster Translation Studio
│   ├── campaign-auditor.hbs         # Integritäts-Auditor
│   ├── journal-search.hbs           # Globale Volltextsuche
│   ├── glossary-search.hbs          # Interaktiver Glossar-Manager
│   └── translation-stats.hbs        # Statistik-Modal
├── styles/                          # Stylesheet
│   └── universal-translator.css     # Dark Theme & Responsive Layout
└── scripts/                         # JavaScript Quellcode
    ├── main.js                      # Hooks, Menüs & Initialisierung
    ├── TranslationLogic.js          # Core Pipeline, Normalisierung, Parser
    ├── UniversalGlossary.js         # In-World Glossar-Management
    ├── TranslationDatabase.js       # Non-Destructive In-Memory Store
    ├── TranslationMemory.js         # Snapshots, Sync & JSON-Backups
    ├── LinkProtection.js            # Foundry-Link & Embed Maskierung
    ├── TermReplacer.js              # Token-basierte Wortersetzung
    ├── RuntimeTranslationEngine.js  # Live Sheet Language Switcher
    ├── QuickSelectionTranslator.js  # Textmarkierungs-Widget & Vorlesetext
    ├── SmartLinkRemapper.js         # Compendium-to-World Link Rewriting
    ├── CampaignAuditorApp.js        # Health-Scanner & 1-Klick Reparaturen
    ├── JournalSearchApp.js          # Globale Volltext-Ersetzung
    ├── GlossarySearchApp.js         # Such- & Bearbeitungs-App
    ├── TranslationStatsApp.js       # Wortzähler & Zeitersparnis
    └── TranslationStudioApp.js      # 4-Schritte Haupt-Assistent
```

---

## 2. Die Datenverarbeitungs-Pipeline

1. **Dokument-Normalisierung (`getCleanData`)**:
   - Extrahiert relevante Text- und Systemfelder (`name`, `text.content`, `system.description`, `system.overview`, etc.) aus beliebigen Dokumenttypen (`JournalEntry`, `JournalEntryPage`, `Item`, `Actor`, `RollTable`).
   - Bereinigt interne Foundry-Artefakte und Flag-Rauschen, um Token-Effizienz zu maximieren.

2. **Glossar-Präparierung (`TermReplacer` & `UniversalGlossary`)**:
   - Lädt dynamisch alle definierten Übersetzungen aus dem in-world Journal `AI Glossar` und dem Core-Glossar.
   - Setzt Glossarbegriffe im Format `ZielÜbersetzung %%Original%%` ein, ohne geschützte HTML-Tags oder Verlinkungs-Targets zu tangieren.

3. **Batch-Segmentierung (`createChunkedBatches`)**:
   - Berechnet die Byte- und Zeichenkapazität jedes Eintrags.
   - Teilt umfangreiche Dokumente automatisch entlang des konfigurierten Zeichenlimits (z.B. 12.000 Zeichen) auf, um Abschneidungen durch Token-Limits externer KI-Modelle zu verhindern.

4. **Resilientes Response-Parsing (`smartParseAiResponse`)**:
   - Entfernt Markdown-Codeblöcke (` ```json ... ``` `) und Einleitungssätze.
   - Repariert unvollständige JSON-Klammern und trailing commas.
   - Heilt automatisch UTF-8 Doppelenkodierungen (Mojibake wie `Ã¤` zu `ä`).

5. **Link-Integrität & LinkProtection**:
   - Vergleicht extrahierte `@UUID[...]`, `@Embed[...]`, `@Check[...]`, `@Damage[...]` und Würfelformeln mit den Ausgangsdaten.
   - Repariert fehlerhafte Zielpfade automatisch und erhält übersetzte Anzeigetexte in `{...}`.

6. **Transaktionales Speichern & Sicherheits-Backup**:
   - Erstellt vor Schreibvorgängen einen vollständigen Snapshot des Dokuments (`Dokumentname (Backup)`).
   - Schreibt die übersetzten Felder und persistiert das Ergebnis im `TranslationMemory`.
