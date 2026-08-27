# Ausführliche Anleitung: Phil's Universal Translator (v1.0.2)

<div align="right">
  <a href="guide.md">Switch to English Guide</a>
</div>

Phil's Universal Translator ist ein lokales Vorbereitungs- und Workflow-Werkzeug für Spielleitungen, um Spielmaterialien direkt in Foundry VTT mit lokal gehosteten Sprachmodellen (Ollama, LM Studio, LocalAI) ohne laufende API-Kosten und mit vollem Datenschutz vorzubereiten und zu übersetzen, oder externe Referenz-Assistenten im Browser zu konsultieren.

---

> [!CAUTION]
> ### Hinweis zum privaten Gebrauch (§ 23, § 53 UrhG)
> Die Erstellung von Übersetzungen rechtmäßig erworbener Spielmaterialien ist für die rein persönliche, private Spielvorbereitung am heimischen Spieltisch urheberrechtlich zulässig (§ 23 Abs. 1, § 53 Abs. 1 UrhG). Eine öffentliche Weitergabe, Veröffentlichung oder kommerzielle Verwertung der erstellten Übersetzungen ist untersagt.
> 
> *⚠️ Wichtiger Hinweis zu externen Cloud-KIs:* Das Hochladen oder Übertragen urheberrechtlich geschützter Originaltexte an externe Online-Dienste/Cloud-KIs kann Urheberrechte und Nutzungsbedingungen verletzen. Für geschützte Inhalte sollte die Übersetzung daher stets ausschließlich lokal über eigene Offline-Modelle (wie Ollama auf dem eigenen PC) durchgeführt werden.

---

## 1. Erste Schritte und Lokales LLM-Setup

1. **Setup-Wizard beim Erststart:** Beim ersten Start des Moduls als Spielleitung öffnet sich automatisch der **Setup-Wizard für lokale LLMs**.
2. **Server & Modell konfigurieren:**
   - **Lokale Server-Adresse:** Standard für Ollama ist `http://localhost:11434` (für LM Studio `http://localhost:1234/v1`).
   - **Installiertes Modell:** Modellname deines geladenen Modells (z. B. `llama3`, `mistral`, `gemma2`, `phi3` oder `qwen2.5`).
   - Klicke auf **Verbindung prüfen**, um die Verbindung zu testen und installierte Modelle abzufragen.
3. **Modul-Einstellungen:**
   - **Lokaler LLM-Server Endpunkt:** Basis-URL deines Sprachmodell-Servers.
   - **Lokales Modell:** Modell-Tag für die lokale Generierung.
   - **Web-Assistent für Nachfragen:** Wähle den Web-Assistenten für manuelle Nachfragen oder Recherchen im Browser (Google Gemini, ChatGPT, Claude, Copilot, Perplexity).
   - **Standard-Zielsprache:** Wähle deine Haupt-Zielsprache (z. B. Deutsch, Englisch, Französisch, Spanisch, Italienisch, Polnisch, Japanisch etc.).
   - **Standard Setting-Profil:** Wähle das passende Kampagnen-Genre (Fantasy, Grimdark, Sci-Fi, Cyberpunk, Horror, Modern, Post-Apocalyptic oder Benutzerdefiniert).

---

## 2. Der Workflow im Translation Studio

Das Modul bietet zwei Arbeitsweisen: **Direkte lokale Übersetzung** (über Ollama) und **Web-Konsultation** (über die Zwischenablage).

### Schritt 1: Setup und Dokumentauswahl
1. Öffne das Studio über die Schaltfläche **Universal Übersetzer** in der Kopfleiste von Journalen, Items, Akteuren oder Kompendien (oder per Rechtsklick auf einen Ordner bzw. Eintrag).
2. Ziehe das gewünschte Dokument oder einen Ordner per Drag & Drop in das Fenster.
3. Wähle Zielsprache, Modus (*Übersetzen*, *Lektorat*, *Glossar extrahieren*) und Genre-Profil.
4. Markiere die gewünschten Seiten oder nutze die Hilfsfunktionen **Nur nicht übersetzt** oder **Nächster Batch**.
5. Klicke auf **Prompt generieren & Weiter**.

### Schritt 2: Übersetzung ausführen (Lokal oder Web-Assistent)
* **Option A — Direkt lokal übersetzen (Empfohlen):** Klicke auf **Direkt lokal übersetzen (Ollama)**. Foundry sendet die Anfrage direkt an deinen lokalen Ollama-Server, übersetzt im Hintergrund und springt automatisch direkt zu Schritt 4 (Diff-Vorschau).
* **Option B — Web-Assistent konsultieren:** Klicke auf **Prompt kopieren & Web-Assistent öffnen**. Der strukturierte Prompt landet in der Zwischenablage und dein Browser öffnet den gewählten Assistenten.

### Schritt 3: Antwort einfügen und analysieren (nur bei Web-Konsultation)
1. Füge die vom Web-Assistenten generierte JSON-Antwort in das Textfeld ein.
2. Klicke auf **Antwort analysieren**. Das Modul validiert die Syntax, repariert Zeichensätze (Mojibake-Schutz) und prüft alle Verlinkungen.

### Schritt 4: Vorschau und Speichern
1. Prüfe die übersetzten Abschnitte im **Side-by-Side Diff-Viewer**.
2. Neu erkannte Begriffe werden angezeigt und automatisch für das Journal **AI Glossar** vorbereitet.
3. Klicke auf **Änderungen anwenden & Speichern**. Vor jedem Schreibvorgang wird automatisch ein unveränderter Backup-Stand gesichert.

---

## 3. Werkzeuge in der Kopfleiste

- **Ollama Setup:** Schneller Zugriff zum erneuten Prüfen und Konfigurieren deines lokalen LLM-Servers.
- **Kampagnen-Auditor:** Prüft alle Journale der Welt auf Vollständigkeit, tote Verlinkungen und Zeichensatzfehler mit 1-Klick-Reparaturfunktionen.
- **Smart-Sync:** Stellt bestehende Übersetzungen aus dem Translation Memory nach offiziellen Modul- oder System-Updates automatisch wieder her.
- **Links Sync:** Biegt Kompendium-Verlinkungen (`@UUID` und `@Embed`) auf bestehende Welt-Dokumente um.
- **Backup & Import:** Exportiert und importiert das gesamte Übersetzungswissen als portable JSON-Datei.
- **Volltextsuche:** Durchsucht Journale weltweit nach Textmustern mit Unterstützung für reguläre Ausdrücke (RegEx).
- **Glossar-Manager:** Ermöglicht das Suchen, Hinzufügen, Bearbeiten und alphabetische Sortieren aller Glossarbegriffe.
- **Statistik:** Zeigt übersetzte Wörter und die geschätzte Zeitersparnis an.

---

## 4. Vorlesetext-Schnellübersetzer

Für die spontane Vorbereitung am Spieltisch:
- Jedes Fenster und Sheet besitzt in der oberen Kopfleiste die Schaltfläche **Vorlesetext**.
- Ein Klick lädt den Inhalt direkt in das Translation Studio zur schnellen Übersetzung.
- Beim Markieren von Textpassagen im Spiel erscheint ein schwebendes Symbol zur direkten Übersetzung des markierten Abschnitts.
