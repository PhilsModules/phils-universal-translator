<div align="center">

# Phil's Universal Translator

![Foundry v12 Compatible](https://img.shields.io/badge/Foundry-v12-green)
![Foundry v13 Compatible](https://img.shields.io/badge/Foundry-v13-brightgreen)
![Foundry v14 Compatible](https://img.shields.io/badge/Foundry-v14-brightgreen)
![System](https://img.shields.io/badge/System-Universal-blue)
![License](https://img.shields.io/badge/License-GPLv3-blue)
[![Version](https://img.shields.io/badge/version-v1.0.0-blue)](https://github.com/PhilsModules/phils-universal-translator/releases)
[![Patreon](https://img.shields.io/badge/SUPPORT-Patreon-ff424d?logo=patreon)](https://www.patreon.com/PhilsModules)

<br>

**A universal, multilingual AI-assisted translation tool for Foundry VTT (v14 ready) across any tabletop RPG system, with zero API costs and full local control.**
<br>
*Ein universelles, mehrsprachiges KI-Übersetzungswerkzeug für Foundry VTT (v14 ready) für alle Rollenspielsysteme, ohne API-Kosten und mit voller lokaler Kontrolle.*

<br>

[English User Guide](guide.md) | [Deutsche Anleitung](anleitung.md)

<br>

<a href="#english-documentation">English Documentation</a> | <a href="#deutsche-dokumentation">Deutsche Dokumentation</a>
</div>

> [!CAUTION]
> ### Private Use Only / Nur für den privaten Gebrauch
> **English:** Translations of copyrighted material created with this tool are intended strictly for personal, private gaming use. Public redistribution or commercial sale is not permitted.
>
> **Deutsch:** Die mit diesem Modul erstellten Übersetzungen urheberrechtlich geschützter Werke dürfen ausschließlich für den privaten Spieltisch verwendet werden. Eine Veröffentlichung, Weitergabe oder kommerzielle Nutzung ist nicht gestattet.

---

# English Documentation

Phil's Universal Translator brings high-quality, context-aware translations to your Foundry VTT world without subscription fees or API billing. By acting as a structured bridge between your game data and modern large language models (such as Google Gemini, ChatGPT, Claude, Microsoft Copilot, and Perplexity), the module prepares, protects, and restores your adventure content seamlessly.

Detailed references:
* [User Guide (guide.md)](guide.md) - Step-by-step tutorial for all features.
* [Functional Overview (how-it-works.md)](how-it-works.md) - Conceptual explanation of the translation workflow and data protections.
* [System Architecture (architecture.md)](architecture.md) - Detailed technical documentation of the software architecture.

## Core Features

* **True Multilingual Support:** Translate between any language pair supported by your chosen AI model (English to German, French, Spanish, Italian, Portuguese, Polish, Ukrainian, Japanese, Chinese, or vice versa).
* **System-Agnostic Engine:** Works natively with any system in Foundry VTT (Pathfinder 2e, D&D 5e, Shadowrun, Call of Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20, Savage Worlds, or custom systems).
* **Foundry v14 Ready:** Built on modern ApplicationV2 foundations with compatibility spanning Foundry v12, v13, and v14.
* **Narrative Read-Aloud Tool:** Trigger on-the-fly translations directly from sheet headers or via a floating selection tool for instant table narration.
* **Non-Destructive Runtime Overlay:** Switch between translated text and original source content directly in document sheets without altering underlying database files.
* **12-Category Lore Glossary:** Automatically builds and updates an in-world journal (*AI Glossar*) categorized into locations, characters, deities, factions, biomes, species, cultures, classes, items, rules, languages, and general terms.
* **LinkProtection Protocol:** Guarantees that internal entity links (`@UUID`, `@Embed`, `@Check`, `@Damage`), roll syntax (`[[/r ...]]`), and HTML tags are preserved without corruption.
* **Campaign Integrity Auditor:** Scans world documents for broken links, missing text chunks, and character encoding issues, offering one-click batch repairs.
* **Smart-Sync and Translation Memory:** Re-applies past translations automatically when adventure modules or system packages receive official updates.
* **Live Capacity Meter:** Tracks character counts in real time and automatically splits large adventure texts into optimal batch sizes to prevent truncation.
* **Safety Backups:** Automatically generates an immutable duplicate of every document before changes are written to the database.

## Installation

1. Open Foundry VTT.
2. Navigate to the **Add-on Modules** tab.
3. Click **Install Module**.
4. Paste the following **Manifest URL** into the bottom field:
   ```text
   https://github.com/PhilsModules/phils-universal-translator/releases/latest/download/module.json
   ```
5. Click **Install**.

## Quickstart Workflow

1. **Open the Studio:** Click **Universal Translator** in the header of any directory (Journals, Items, Actors, Compendiums) or right-click an entry.
2. **Select Target & Content:** Drag and drop your document or folder into the window. Choose your target language, translation mode, and setting profile.
3. **Generate & Copy Prompt:** Click **Copy Prompt & Open AI** to place the structured prompt on your clipboard and launch your preferred AI web interface.
4. **Paste Response:** Paste the generated JSON output back into Step 3 and click **Analyze Response**.
5. **Review & Save:** Inspect the side-by-side diff preview, review newly discovered glossary terms, and click **Apply Changes & Save**.

---

# Deutsche Dokumentation

Phil's Universal Translator ermöglicht hochwertige, kontextsensitive Übersetzungen für Foundry VTT ohne laufende API-Kosten oder Abonnements. Das Modul bereitet Abenteuerinhalte strukturiert für Web-KIs (Google Gemini, ChatGPT, Claude, Copilot, Perplexity) vor, schützt alle internen Verlinkungen und fügt übersetzte Inhalte präzise wieder in deine Welt ein.

Weiterführende Handbücher:
* [Ausführliche Anleitung (anleitung.md)](anleitung.md) - Schritt-für-Schritt-Handbuch für alle Werkzeuge.
* [Funktionsweise (funktion.md)](funktion.md) - Verständliche Erklärung der Daten-Pipeline und Schutzmechanismen.
* [Technische Exegese (funktionen.md)](funktionen.md) - Detaillierte Dokumentation der Softwarearchitektur.

## Wichtigste Funktionen

* **Echte Mehrsprachigkeit:** Übersetze flexibel zwischen beliebigen Sprachpaaren (z. B. Englisch nach Deutsch, Französisch, Spanisch, Italienisch, Polnisch, Japanisch oder umgekehrt).
* **Systemunabhängige Architektur:** Kompatibel mit allen Foundry-Systemen (Pathfinder 2e, D&D 5e, Shadowrun, Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20 etc.).
* **Foundry v14 Kompatibilität:** Entwickelt auf Basis moderner ApplicationV2-Standards für Foundry v12, v13 und v14.
* **Vorlesetext-Schnellübersetzer:** Schnelle Übersetzung fokussierter Passagen direkt aus der Fensterleiste oder per Textmarkierung am Spieltisch.
* **Nicht-destruktives Runtime-Overlay:** Ermöglicht das Umschalten zwischen Originaltext und Übersetzung im Sheet, ohne Quelldaten zu überschreiben.
* **Strukturiertes 12-Kategorien-Glossar:** Verwaltet ein In-World-Journal (*AI Glossar*) mit automatischer Einordnung in Orte, NSCs, Götter, Fraktionen, Zauber, Regeln und weitere Bereiche.
* **LinkProtection-Sicherheitsnetz:** Schützt `@UUID`-Verlinkungen, Würfelformeln und HTML-Strukturen vor fehlerhafter KI-Veränderung.
* **Kampagnen-Auditor:** Erkennt fehlende Textabschnitte, fehlerhafte Links und Zeichensatz-Probleme mit 1-Klick-Reparaturfunktion.
* **Smart-Sync und Translation Memory:** Stellt bestehende Übersetzungen nach offiziellen System- oder Modul-Updates automatisch wieder her.
* **Echtzeit-Kapazitätskontrolle:** Zeigt die Zeichenmenge live an und unterteilt umfangreiche Texte automatisch in passende Teil-Batches.
* **Automatische Sicherheits-Backups:** Erstellt vor jedem Speichervorgang automatisch einen unveränderten Snapshot des Ausgangsdokuments.

## Installation

1. Öffne Foundry VTT.
2. Wechsle zum Reiter **Zusatzmodule** (Add-on Modules).
3. Klicke auf **Modul installieren** (Install Module).
4. Füge folgende **Manifest URL** unten ein:
   ```text
   https://github.com/PhilsModules/phils-universal-translator/releases/latest/download/module.json
   ```
5. Klicke auf **Installieren**.

## 4-Schritte Schnellstart

1. **Studio öffnen:** Klicke in der Kopfleiste von Journalen, Items, Akteuren oder Kompendien auf **Universal Übersetzer** (oder nutze den Rechtsklick).
2. **Dokument & Zielsprache wählen:** Ziehe das Dokument oder den Ordner per Drag & Drop in das Fenster. Wähle Zielsprache, Modus und Genre-Profil.
3. **Prompt kopieren & KI öffnen:** Klicke auf **Prompt kopieren & KI öffnen**. Der Prompt landet in der Zwischenablage und die KI öffnet sich im Browser.
4. **Antwort einfügen:** Füge die JSON-Antwort der KI in Schritt 3 ein und klicke auf **Antwort analysieren**.
5. **Prüfen & Speichern:** Kontrolliere die Gegenüberstellung im Diff-Viewer und klicke auf **Änderungen anwenden & Speichern**.

---

# License & Support

Phil's Universal Translator is open-source software licensed under the [GNU General Public License v3.0](LICENSE).

<div align="center">
    <h3>Support the Project</h3>
    <p>If you find this module helpful for your gaming sessions and wish to support ongoing open-source development for Foundry VTT, visit the Patreon page:</p>
    <a href="https://www.patreon.com/PhilsModules">
        <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" width="180" />
    </a>
</div>
