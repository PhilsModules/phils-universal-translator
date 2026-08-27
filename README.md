<div align="center">

# Phil's Universal Translator

![Foundry v12 Compatible](https://img.shields.io/badge/Foundry-v12-green)
![Foundry v13 Compatible](https://img.shields.io/badge/Foundry-v13-brightgreen)
![Foundry v14 Compatible](https://img.shields.io/badge/Foundry-v14-brightgreen)
![System](https://img.shields.io/badge/System-Universal-blue)
![License](https://img.shields.io/badge/License-GPLv3-blue)
[![Version](https://img.shields.io/badge/version-v1.0.1-blue)](https://github.com/PhilsModules/phils-universal-translator/releases)
[![Patreon](https://img.shields.io/badge/SUPPORT-Patreon-ff424d?logo=patreon)](https://www.patreon.com/PhilsModules)

<br>

**A local translation assistant and workflow utility for personal Foundry VTT game preparation with zero API costs, connecting directly to local LLMs (Ollama/LocalAI) or external consultation tools.**
<br>
*Ein lokaler Übersetzungs-Assistent für die private Spielvorbereitung in Foundry VTT ohne API-Kosten, mit direkter Anbindung an lokale LLMs (Ollama/LocalAI) und externer Konsultation.*

<br>

[English User Guide](guide.md) | [Deutsche Anleitung](anleitung.md)

<br>

<a href="#english-documentation">English Documentation</a> | <a href="#deutsche-dokumentation">Deutsche Dokumentation</a>
</div>

> [!CAUTION]
> ### Private Use Only / Nur für den privaten Gebrauch (UrhG § 23, § 53)
> **English:** Translations of legitimately acquired game material created with this tool are intended strictly for personal, private gaming preparation. Public redistribution, commercial exploitation, or re-hosting of proprietary material is prohibited.
> 
> *⚠️ Important Notice on External Cloud AI:* Uploading or transmitting copyrighted text to external online LLMs (such as cloud AI providers) without authorization may violate copyright laws and terms of service. For protected proprietary content, translations must be processed strictly via locally hosted offline language models (e.g. Ollama running on your own machine).
>
> **Deutsch:** Die mit diesem Modul erstellten Übersetzungen rechtmäßig erworbener Spielmaterialien dienen ausschließlich der persönlichen Spielvorbereitung am heimischen Spieltisch (§ 23 Abs. 1, § 53 Abs. 1 UrhG). Eine öffentliche Weitergabe, Veröffentlichung oder kommerzielle Verwertung ist untersagt.
> 
> *⚠️ Wichtiger Hinweis zu externen Cloud-KIs:* Das Hochladen oder Übertragen urheberrechtlich geschützter Originaltexte an externe Online-Dienste/Cloud-KIs kann Urheberrechte und Nutzungsbedingungen verletzen. Für geschützte Inhalte sollte die Übersetzung daher stets ausschließlich lokal über eigene Offline-Modelle (wie Ollama auf dem eigenen PC) durchgeführt werden.

---

# English Documentation

Phil's Universal Translator provides game masters with a structured, reliable local workflow to prepare and translate tabletop RPG content directly inside Foundry VTT without subscription fees or API billing. Operating as a local bridge between your world data and private language models (such as locally hosted Ollama, LM Studio, or LocalAI instances), the module prepares, protects, and restores your adventure content with zero data leakage.

Detailed references:
* [User Guide (guide.md)](guide.md) - Step-by-step tutorial for all features.
* [Functional Overview (how-it-works.md)](how-it-works.md) - Conceptual explanation of the translation workflow and data protections.
* [System Architecture (architecture.md)](architecture.md) - Detailed technical documentation of the software architecture.

## Core Features

* **Local-First & Privacy Assured:** Connects directly to local offline LLMs (Ollama, LM Studio, LocalAI) via REST API with zero external data sharing.
* **Dual Translation Workflow:** Translate in 1-click via your local Ollama instance or copy structured prompts to consult external browser assistants (Google Gemini, ChatGPT, Claude, Copilot, Perplexity).
* **True Multilingual Support:** Translate between any language pair supported by your chosen model (English to German, French, Spanish, Italian, Portuguese, Polish, Ukrainian, Japanese, Chinese, or vice versa).
* **System-Agnostic Engine:** Works natively with any system in Foundry VTT (Pathfinder 2e, D&D 5e, Shadowrun, Call of Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20, Savage Worlds, or custom systems).
* **Foundry v14 Ready:** Built on modern ApplicationV2 foundations with compatibility spanning Foundry v12, v13, and v14.
* **LinkProtection Protocol:** Guarantees that internal entity links (`@UUID`, `@Embed`, `@Check`, `@Damage`), roll syntax (`[[/r ...]]`), and HTML tags are preserved without corruption.
* **12-Category Lore Glossary:** Automatically builds and updates an in-world journal (*AI Glossar*) categorized into locations, characters, deities, factions, biomes, species, cultures, classes, items, rules, languages, and general terms.
* **Campaign Integrity Auditor:** Scans world documents for broken links, missing text chunks, and character encoding issues, offering one-click batch repairs.
* **Narrative Read-Aloud Tool:** Trigger on-the-fly translations directly from sheet headers or via a floating selection tool for instant table narration.
* **Non-Destructive Runtime Overlay:** Switch between translated text and original source content directly in document sheets without altering underlying database files.
* **Smart-Sync and Translation Memory:** Re-applies past translations automatically when adventure modules or system packages receive official updates.
* **Live Capacity Meter:** Tracks character counts in real time and automatically splits large texts into optimal batch sizes.
* **Safety Backups:** Automatically generates an immutable duplicate of every document before changes are written.

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

1. **Setup Local LLM (First Run):** On first launch, the wizard prompts you for your local Ollama/LLM endpoint (default: `http://localhost:11434`) and model tag (`llama3`).
2. **Open the Studio:** Click **Universal Translator** in the header of any directory or right-click an entry.
3. **Select Content:** Drag and drop your document or folder into the drop zone.
4. **Translate:** Click **Direct Local Translate (Ollama)** for automatic 1-click processing, or copy the prompt for browser consultation.
5. **Review & Save:** Inspect the side-by-side diff preview, review newly discovered glossary terms, and apply updates safely.

---

# Deutsche Dokumentation

Phil's Universal Translator ermöglicht hochwertige, kontextsensitive Übersetzungen für Foundry VTT ohne laufende API-Kosten oder Abonnements. Das Modul verbindet deine Spielwelt direkt mit lokalen Sprachmodellen (Ollama, LM Studio, LocalAI) oder externen Referenzassistenten, schützt alle internen Verlinkungen und fügt übersetzte Inhalte präzise wieder in deine Welt ein.

Weiterführende Handbücher:
* [Ausführliche Anleitung (anleitung.md)](anleitung.md) - Schritt-für-Schritt-Handbuch für alle Werkzeuge.
* [Funktionsweise (funktion.md)](funktion.md) - Verständliche Erklärung der Daten-Pipeline und Schutzmechanismen.
* [Technische Exegese (funktionen.md)](funktionen.md) - Detaillierte Dokumentation der Softwarearchitektur.

## Wichtigste Funktionen

* **100% Lokal & Datenschutzkonform:** Direkte REST-Verbindung zu lokalen Offline-Modellen (Ollama / LocalAI) auf deinem Rechner.
* **Duales Übersetzungssystem:** Wahl zwischen 1-Klick-Direktübersetzung über Ollama oder manuellem Copy-Paste-Workflow zur Web-Konsultation (Google Gemini, ChatGPT, Claude etc.).
* **Echte Mehrsprachigkeit:** Übersetze flexibel zwischen beliebigen Sprachpaaren (z. B. Englisch nach Deutsch, Französisch, Spanisch, Italienisch, Polnisch, Japanisch oder umgekehrt).
* **Systemunabhängige Architektur:** Kompatibel mit allen Foundry-Systemen (Pathfinder 2e, D&D 5e, Shadowrun, Cthulhu, Crucible, Cyberpunk, Alien, Tormenta20 etc.).
* **Foundry v14 Kompatibilität:** Entwickelt auf Basis moderner ApplicationV2-Standards für Foundry v12, v13 und v14.
* **LinkProtection-Sicherheitsnetz:** Schützt `@UUID`-Verlinkungen, Würfelformeln und HTML-Strukturen vor fehlerhafter Veränderung.
* **Strukturiertes 12-Kategorien-Glossar:** Verwaltet ein In-World-Journal (*AI Glossar*) mit automatischer Einordnung in Orte, NSCs, Götter, Fraktionen, Zauber, Regeln und weitere Bereiche.
* **Kampagnen-Auditor:** Erkennt fehlende Textabschnitte, fehlerhafte Links und Zeichensatz-Probleme mit 1-Klick-Reparaturfunktion.
* **Vorlesetext-Schnellübersetzer:** Schnelle Übersetzung fokussierter Passagen direkt aus der Fensterleiste oder per Textmarkierung am Spieltisch.
* **Nicht-destruktives Runtime-Overlay:** Ermöglicht das Umschalten zwischen Originaltext und Übersetzung im Sheet, ohne Quelldaten zu überschreiben.
* **Smart-Sync und Translation Memory:** Stellt bestehende Übersetzungen nach offiziellen System- oder Modul-Updates automatisch wieder her.
* **Automatische Sicherheits-Backups:** Erstellt vor jedem Speichervorgang automatisch einen unveränderten Snapshot des Ausgangsdokuments.

## 4-Schritte Schnellstart

1. **Setup-Wizard:** Beim Erststart fragt der Wizard nach deiner Ollama-Adresse (`http://localhost:11434`) und Modell (`llama3`).
2. **Studio öffnen:** Klicke in der Kopfleiste von Journalen, Items, Akteuren oder Kompendien auf **Universal Übersetzer**.
3. **Dokument wählen:** Ziehe das Dokument oder den Ordner per Drag & Drop in das Fenster.
4. **Übersetzen:** Klicke auf **Direkt lokal übersetzen (Ollama)** oder nutze **Prompt kopieren** zur Web-Konsultation.
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
