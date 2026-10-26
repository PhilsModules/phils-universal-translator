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

<br>

> [!NOTE]
> **A Quick Note / Hinweis in eigener Sache**
>
> 🇬🇧 **Hi everyone!**  
> A quick note before you start: I create these modules completely in my free time and offer them to the community for free. Since neither my partner nor I are professional graphic designers, translators, or full-time developers, maintaining these projects takes a huge amount of effort. To make these modules possible in this form, I use assistance from artificial intelligence, especially for translations and visual elements. Hiring professional designers or translators is simply something I cannot afford out of pocket.
> 
> Because of Foundry VTT's guidelines regarding artificial intelligence, several of my modules (such as *Phil's Day and Night Cycle*, *Phil's Console Doctor*, *Phil's PF2e RealDark*, and *Phil's Universal Translator*) have been removed from the official Foundry package listing. Even if a module is no longer listed there—or if others are removed in the future—do not worry: **the projects will continue!** You can always find all my modules, updates, releases, and manifest URLs directly here on [GitHub](https://github.com/PhilsModules) (see the [full module overview below](#-more-modules-by-phil--meine-weiteren-module)).
> 
> Thank you so much for your understanding and support!
> 
> ---
> 
> 🇩🇪 **Hallo zusammen!**  
> Ein kleiner Hinweis in eigener Sache, bevor ihr startet: Ich erstelle diese Module komplett in meiner Freizeit und stelle sie der Community kostenlos zur Verfügung. Da weder meine Lebensgefährtin noch ich Grafikdesigner, gelernte Übersetzer oder hauptberufliche Entwickler sind, ist die Pflege extrem aufwendig. Um die Module in dieser Form überhaupt anbieten zu können, nutze ich Unterstützung durch künstliche Intelligenz, zum Beispiel für Übersetzungen und grafische Elemente. Professionelle Designer oder Übersetzer kann ich mir privat schlicht nicht leisten.
> 
> Aufgrund der Richtlinien von Foundry VTT rund um künstliche Intelligenz wurden bereits mehrere meiner Module (wie z. B. *Phil's Day and Night Cycle*, *Phil's Console Doctor*, *Phil's PF2e RealDark* und *Phil's Universal Translator*) aus dem offiziellen Foundry-Verzeichnis entfernt. Auch wenn ein Modul dort nicht mehr gelistet ist – oder künftig noch weitere gelöscht werden sollten – müsst ihr euch keine Sorgen machen: **Das Projekt stirbt nicht!** Ihr findet alle meine Module, Updates, neue Versionen und Manifest-Links weiterhin direkt hier auf [GitHub](https://github.com/PhilsModules) (siehe die [komplette Modul-Übersicht weiter unten](#-more-modules-by-phil--meine-weiteren-module)).
> 
> Vielen Dank für euer Verständnis und eure Unterstützung!


> [!CAUTION]
> ### Private Use Only & Liability Disclaimer / Nur für den privaten Gebrauch & Haftungsausschluss
> **English:** This module is strictly intended as a workflow utility for personal, private game preparation at your own gaming table. Public redistribution, commercial exploitation, re-hosting, or sharing of translated proprietary material is strictly prohibited.
> 
> *⚠️ Important Notice on External Cloud AI:* Uploading or transmitting text to external online AI / cloud services (e.g. Gemini, ChatGPT, Claude) is strictly permitted ONLY for your own original content or if you have explicit written permission from the respective copyright holder. For protected proprietary materials, translations must be processed strictly via locally hosted offline language models (e.g. Ollama running locally on your own machine).
> 
> *⚖️ Disclaimer:* The module developer assumes no liability for copyright infringements, unauthorized data uploads, or legal consequences resulting from end-user actions.
>
> **Deutsch:** Dieses Modul ist ausschließlich als Hilfswerkzeug für die persönliche Spielvorbereitung am eigenen Spieltisch bestimmt. Die öffentliche Weitergabe, Veröffentlichung, Vervielfältigung oder kommerzielle Nutzung übersetzter geschützter Spielmaterialien ist strikt untersagt.
> 
> *⚠️ Wichtiger Hinweis zu externen Cloud-KIs:* Das Hochladen oder Übertragen von Texten an externe Online-Dienste/Cloud-KIs (z. B. Gemini, ChatGPT, Claude) ist AUSSCHLIESSLICH für eigene Inhalte oder mit ausdrücklicher schriftlicher Genehmigung des jeweiligen Rechteinhabers gestattet. Geschützte Fremdinhalte dürfen ausschließlich lokal über eigene Offline-Modelle (wie Ollama auf dem eigenen PC) verarbeitet werden.
> 
> *⚖️ Haftungsausschluss:* Der Modulentwickler übernimmt keinerlei Haftung für Urheberrechtsverletzungen, unberechtigte Uploads oder rechtliche Konsequenzen, die aus der Nutzung durch Endanwender entstehen.

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


---

## 🧩 More Modules by Phil / Meine weiteren Module

🇬🇧 **Discover all of my Foundry VTT modules!**  
Because of Foundry VTT's policies regarding AI assistance (which I use for translations and visual elements as a solo hobby developer), several of my modules have been removed from the official Foundry package directory. Below you can see which modules are still available directly on [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) and which ones are hosted exclusively on [GitHub](https://github.com/PhilsModules/). **All modules remain actively maintained** and can always be installed in Foundry VTT using their **Manifest URL**!

🇩🇪 **Entdecke alle meine Foundry VTT Module!**  
Aufgrund der Richtlinien von Foundry VTT zum Einsatz von künstlicher Intelligenz (die ich als Solo-Hobbyentwickler für Übersetzungen und Grafiken nutze) wurden einige meiner Module aus dem offiziellen Foundry-Verzeichnis entfernt. In der Tabelle siehst du auf einen Blick, welche Module noch direkt über [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) gelistet sind und welche exklusiv über [GitHub](https://github.com/PhilsModules/) bezogen werden können. **Alle Module werden aktiv weiterentwickelt** und lassen sich jederzeit über ihre **Manifest-URL** in Foundry VTT installieren!

| Module / Modul | Foundry VTT Listing | Description (🇬🇧 EN / 🇩🇪 DE) | Links |
| :--- | :---: | :--- | :---: |
| **[Phil's Day and Night Cycle](https://github.com/PhilsModules/phils-day-night-cycle)** | ❌ **GitHub Only**<br>*(Removed due to AI policy / Wegen KI-Richtlinien entfernt)* | 🇬🇧 Immersive clock widget with Solar Arc, full calendar system, and a living weather engine featuring 360° wind physics, volumetric clouds, and 4,800+ narrative weather reports.<br>🇩🇪 Immersives Uhr-Widget mit Sonnenlauf, vollwertigem Kalendersystem und lebendiger Wetter-Engine mit 360°-Windphysik, volumetrischer Wolkendecke und über 4.800 Wetterberichten. | [GitHub](https://github.com/PhilsModules/phils-day-night-cycle) · [Manifest](https://github.com/PhilsModules/phils-day-night-cycle/releases/latest/download/module.json) |
| **[Phil's Console Doctor & Task Manager](https://github.com/PhilsModules/phils-console-doctor)** | ❌ **GitHub Only**<br>*(Removed due to AI policy / Wegen KI-Richtlinien entfernt)* | 🇬🇧 Windows 11-style Task Manager & diagnostics suite for Foundry VTT with real-time CPU/GPU load breakdown, conflict detective, A/B culprit finder, and AI error analysis.<br>🇩🇪 Diagnose-Suite im Windows-11-Task-Manager-Stil mit Live-CPU/GPU-Auslastung, Konflikt-Detektiv, automatischem A/B-Problemlöser und KI-Fehleranalyse. | [GitHub](https://github.com/PhilsModules/phils-console-doctor) · [Manifest](https://github.com/PhilsModules/phils-console-doctor/releases/latest/download/module.json) |
| **[Phil's PF2e RealDark](https://github.com/PhilsModules/phils-pf2e-realdark)** | ❌ **GitHub Only**<br>*(Removed due to AI policy / Wegen KI-Richtlinien entfernt)* | 🇬🇧 A true, customizable dark mode for Pathfinder 2e with 30+ handcrafted theme presets, live preview wizard, and high-contrast readability.<br>🇩🇪 Ein echter, anpassbarer Dark Mode für Pathfinder 2e mit über 30 kuratierten Presets, Live-Vorschau-Assistent und erstklassiger Lesbarkeit. | [GitHub](https://github.com/PhilsModules/phils-pf2e-realdark) · [Manifest](https://github.com/PhilsModules/phils-pf2e-realdark/releases/latest/download/module.json) |
| **[Phil's Universal Translator](https://github.com/PhilsModules/phils-universal-translator)** | ❌ **GitHub Only**<br>*(Removed due to AI policy / Wegen KI-Richtlinien entfernt)* | 🇬🇧 System-agnostic local translation assistant for personal game prep with zero API costs, direct local LLM (Ollama) integration, LinkProtection, and 12-category lore glossary.<br>🇩🇪 Systemunabhängiger Übersetzungs-Assistent für die private Spielvorbereitung ohne API-Kosten, mit lokaler Ollama-Anbindung, LinkProtection und 12-Kategorien-Glossar. | [GitHub](https://github.com/PhilsModules/phils-universal-translator) · [Manifest](https://github.com/PhilsModules/phils-universal-translator/releases/latest/download/module.json) |
| **[Phil's UI Tweaks](https://github.com/PhilsModules/phils-foundry-ui-tweaks)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Customize, reorder, hide, and group Scene Controls (left toolbar) and Sidebar Tabs (right toolbar) into custom pop-out folders with a sleek Modern Dark UI.<br>🇩🇪 Passe die linke Werkzeugleiste und rechte Seitenleiste frei an – umsortieren, ausblenden und Tabs in eigenen Ausklapp-Ordnern im Modern Dark UI Design gruppieren. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-foundry-ui-tweaks) · [Manifest](https://github.com/PhilsModules/phils-foundry-ui-tweaks/releases/latest/download/module.json) |
| **[Phil's Quest Tracker](https://github.com/PhilsModules/phils-quest-tracker)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Immersive Quest Log in a Modern Dark UI featuring collaborative party quests, job boards, drag & drop rewards, and automatic calendar synchronization.<br>🇩🇪 Immersives Quest-Log im Modern Dark UI mit kollaborativen Gruppenquests, Auftragsbrett, Drag-&-Drop-Belohnungen und automatischer Kalender-Synchronisation. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-quest-tracker) · [Manifest](https://github.com/PhilsModules/phils-quest-tracker/releases/latest/download/module.json) |
| **[Phil's PF2e AI Translator](https://github.com/PhilsModules/phils-pf2e-ai-translator)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Next-Gen AI translation studio for Pathfinder 2e with `lang-de-pf2e` compendium integration (15,000+ official terms), LinkProtection, Smart-Sync, and zero API costs.<br>🇩🇪 KI-Übersetzungs-Studio für Pathfinder 2e mit `lang-de-pf2e`-Integration (über 15.000 offizielle Begriffe), LinkProtection, Smart-Sync und null API-Kosten. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-pf2e-ai-translator) · [Manifest](https://github.com/PhilsModules/phils-pf2e-ai-translator/releases/latest/download/module.json) |
| **[Phil's PF2e Action Colours](https://github.com/PhilsModules/phils-pf2e-action-colours)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Visualizes the Pathfinder 2e 3-Action (and 4-Action Quickened) economy on the drag ruler with dynamic condition/feat detection, smart routing, and 3 colorblind modes.<br>🇩🇪 Visualisiert die Pathfinder 2e 3-Aktionen-Ökonomie (inkl. 4. Aktion bei Hast) direkt beim Token-Ziehen – mit Zustandserkennung, Smart Routing und 3 Farbenblind-Modi. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-pf2e-action-colours) · [Manifest](https://github.com/PhilsModules/phils-pf2e-action-colours/releases/latest/download/module.json) |
| **[Phil's Random Names](https://github.com/PhilsModules/phils-random-names)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Deluxe generator suite with 5.3M+ NPC name combinations, tavern menus, treasure pouches, custom merchant shops, and 23,000+ entries with drag & drop item creation.<br>🇩🇪 Deluxe-Generator mit über 5,3 Mio. NSC-Namen, Tavernen-Menüs, Schatzbeuteln, eigenen Händler-Auslagen und über 23.000 Einträgen inkl. Drag-&-Drop-Item-Erstellung. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-random-names) · [Manifest](https://github.com/PhilsModules/phils-random-names/releases/latest/download/module.json) |
| **[Phil's AI Assistant](https://github.com/PhilsModules/phils-ai-assistant)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Connect your Foundry VTT world to Gemini, ChatGPT, Claude, Copilot, Perplexity, or local Ollama with zero API costs to write lore, edit items, and generate image prompts.<br>🇩🇪 Verbinde deine Foundry-Welt ohne API-Kosten mit Gemini, ChatGPT, Claude, Copilot, Perplexity oder lokal mit Ollama für Lore-Texte, Item-Anpassungen und Bild-Prompts. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-ai-assistant) · [Manifest](https://github.com/PhilsModules/phils-ai-assistant/releases/latest/download/module.json) |
| **[Phil's Token Studio](https://github.com/PhilsModules/phils-token-studio)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 High-performance in-game visual token editor with layer management, smart masking, 3D pop-out effects, and Foundry Dynamic Token Ring integration.<br>🇩🇪 Leistungsstarker visueller Token-Editor direkt in Foundry VTT mit Ebenensystem, intelligenter Maskierung, 3D-Pop-out-Effekten und Dynamic-Token-Ring-Unterstützung. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-token-studio) · [Manifest](https://github.com/PhilsModules/phils-token-studio/releases/latest/download/module.json) |
| **[Phil's Journal Translator](https://github.com/PhilsModules/phils-journal-translator)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 System-agnostic AI translation assistant for Foundry VTT journals using free web AI services (Gemini, ChatGPT, Claude, etc.) with automatic backups.<br>🇩🇪 Systemunabhängiger KI-Übersetzungs-Assistent für Foundry VTT Journale über kostenlose Web-KIs (Gemini, ChatGPT, Claude etc.) mit automatischen Backups. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-journal-translator) · [Manifest](https://github.com/PhilsModules/phils-journal-translator/releases/latest/download/module.json) |
| **[Phil's Random Quests](https://github.com/PhilsModules/phils-random-quests)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Instant adventure and quest idea generator for Pathfinder 2e and D&D 5e when your party goes off the rails.<br>🇩🇪 Schneller Generator für spontane Abenteuer- und Quest-Ideen in Pathfinder 2e und D&D 5e am Spieltisch. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-random-quests) · [Manifest](https://github.com/PhilsModules/phils-random-quests/releases/latest/download/module.json) |
| **[Phil's Art Replacer](https://github.com/PhilsModules/phils-art-replacer)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Scans your entire world and installed modules to automatically find and replace missing actor and token artwork with side-by-side comparison.<br>🇩🇪 Durchsucht deine gesamte Welt und installierte Module, um fehlende Bilder für Akteure und Tokens automatisch mit Vorher-Nachher-Vergleich zu ersetzen. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-art-replacer) · [Manifest](https://github.com/PhilsModules/phils-art-replacer/releases/latest/download/module.json) |
| **[Phil's Map Migrator](https://github.com/PhilsModules/phils-map-migrator)** | ✅ **Available**<br>*(Verfügbar)* | 🇬🇧 Professional scene migration tool with 1–5 point mathematical calibration, geometry failsafe, and automatic scaling for walls, lights, tokens, and pins.<br>🇩🇪 Profi-Werkzeug für präzise Szenen-Migration mit 1–5-Punkte-Kalibrierung, Geometrie-Wächter und automatischer Skalierung für Wände, Lichter, Tokens und Pins. | [Foundry VTT](https://foundryvtt.com/community/philsmodules/packages) · [GitHub](https://github.com/PhilsModules/phils-map-migrator) · [Manifest](https://github.com/PhilsModules/phils-map-migrator/releases/latest/download/module.json) |

<br>

# License & Support

Phil's Universal Translator is open-source software licensed under the [GNU General Public License v3.0](LICENSE).

<div align="center">
    <h3>Support the Project</h3>
    <p>If you find this module helpful for your gaming sessions and wish to support ongoing open-source development for Foundry VTT, visit the Patreon page:</p>
    <a href="https://www.patreon.com/PhilsModules">
        <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" width="180" />
    </a>
</div>
