# Ausführliche Anleitung: Phil's Universal Translator (v1.0.0)

<div align="right">
  <a href="guide.md">Switch to English Guide</a>
</div>

Phil's Universal Translator ermöglicht es Spielleitungen, Journale, Items, Akteure, Ordner und Kompendien jedes beliebigen Rollenspielsystems mit modernen KI-Modellen (Gemini, ChatGPT, Claude, Copilot, Perplexity) ohne laufende API-Kosten konsistent und rollenspielgerecht in beliebige Zielsprachen zu übersetzen.

---

## 1. Erste Schritte und Konfiguration

1. **Modul aktivieren:** Aktiviere das Modul in deiner Foundry VTT Welt unter **Einstellungen** > **Module verwalten**.
2. **Modul-Einstellungen anpassen:**
   - Öffne **Einstellungen** > **Modul-Einstellungen** > **Phil's Universal Translator**.
   - **KI-Anbieter:** Wähle deinen bevorzugten Dienst (Google Gemini, ChatGPT, Claude, Copilot, Perplexity).
   - **Standard-Zielsprache:** Wähle deine Haupt-Zielsprache (z. B. Deutsch, Französisch, Spanisch, Italienisch, Polnisch, Ukrainisch, Japanisch, Englisch oder Benutzerdefiniert).
   - **Standard-Quellsprache:** Automatische Erkennung oder feste Ausgangssprache.
   - **Standard Setting-Profil:** Wähle das passende Kampagnen-Genre (Fantasy, Grimdark, Sci-Fi, Cyberpunk, Horror, Modern, Post-Apocalyptic oder Benutzerdefiniert).
   - **Batch-Größe:** Anzahl der Einträge, die standardmäßig pro Durchgang markiert werden (Standard: 10).
   - **Max. Batch-Kapazität:** Zeichenlimit pro Anfrage (Standard: 12.000 Zeichen), um unvollständige Antworten zu vermeiden.

---

## 2. Das 4-Schritte Translation Studio

Das Modul führt strukturiert durch den gesamten Übersetzungsprozess:

### Schritt 1: Setup und Auswahl
1. Öffne das Studio über die Schaltfläche **Universal Übersetzer** in der Kopfleiste von Journalen, Items, Akteuren oder Kompendien (oder per Rechtsklick auf einen Ordner bzw. Eintrag).
2. Ziehe das gewünschte Dokument oder einen Ordner per Drag & Drop in das Fenster.
3. Wähle Zielsprache, Modus (*Übersetzen*, *Lektorat*, *Glossar extrahieren*) und Genre-Profil.
4. Markiere die gewünschten Seiten oder nutze die Hilfsfunktionen **Nur nicht übersetzt** oder **Nächster Batch**.
5. Die **Live-Kapazitätsanzeige** berechnet das Textvolumen in Echtzeit und unterteilt große Dokumente automatisch in Teil-Batches.
6. Klicke auf **Prompt generieren & Weiter**.

### Schritt 2: Prompt kopieren und KI aufrufen
1. Klicke auf **Prompt kopieren & KI öffnen**.
2. Der strukturierte Prompt wird in die Zwischenablage kopiert und die Weboberfläche deines KI-Anbieters öffnet sich im Browser.
3. Füge den Prompt mit `STRG + V` bei der KI ein und sende die Anfrage ab.
4. Kopiere die generierte JSON-Antwort der KI.

### Schritt 3: Antwort einfügen und analysieren
1. Wechsle zurück zu Foundry VTT (das Studio wartet bei Schritt 3).
2. Füge die Antwort mit `STRG + V` in das Textfeld ein und klicke auf **Antwort analysieren**.
3. Das Modul bereinigt Codeblöcke, repariert Zeichensatz-Konflikte (Mojibake-Schutz) und validiert Verlinkungen.

### Schritt 4: Vorschau und Speichern
1. Prüfe die übersetzten Abschnitte im **Side-by-Side Diff-Viewer**.
2. Neu erkannte Begriffe werden angezeigt und automatisch für das Journal **AI Glossar** vorbereitet.
3. Klicke auf **Änderungen anwenden & Speichern**. Vor jedem Schreibvorgang wird automatisch ein unveränderter Backup-Stand deines Originaldokuments gesichert.

---

## 3. Werkzeuge in der Kopfleiste

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
