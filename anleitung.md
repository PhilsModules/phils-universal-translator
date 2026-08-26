# 📖 Ausführliche Anleitung: Phil's Universal AI Translator (v1.0.0)

Willkommen beim ultimativen, universellen Übersetzungs-Werkzeug für Foundry Virtual Tabletop (v14 ready). Dieses Modul ermöglicht es dir, Journale, Items, Akteure, ganze Ordner und Kompendium-Packs jedes beliebigen Rollenspiel-Systems mit modernster KI (Gemini, ChatGPT, Claude, Copilot, Perplexity) ohne API-Kosten konsistent und rollenspielgerecht ins Deutsche zu übersetzen.

---

## 1. Erste Schritte & Konfiguration

1. **Modul aktivieren**: Aktiviere das Modul in deiner Foundry VTT Welt unter `Einstellungen` > `Module verwalten`.
2. **Modul-Einstellungen anpassen**:
   - `Einstellungen` > `Modul-Einstellungen` > `Phil's Universal AI Translator`:
   - **KI-Anbieter**: Wähle deinen bevorzugten Dienst (Google Gemini, ChatGPT, Claude etc.).
   - **Standard-Zielsprache**: Wähle deine Haupt-Zielsprache (z.B. 🇩🇪 Deutsch, 🇫🇷 Französisch, 🇪🇸 Spanisch, 🇮🇹 Italienisch, 🇵🇱 Polnisch, 🇺🇦 Ukrainisch, 🇯🇵 Japanisch, 🇬🇧 Englisch oder Benutzerdefiniert).
   - **Standard-Quellsprache**: Automatische Erkennung oder feste Ausgangssprache.
   - **Standard Setting-Profil**: Wähle dein Haupt-Genre (z.B. Fantasy, Grimdark, Sci-Fi, Cyberpunk, Horror, Modern).
   - **Batch-Größe**: Standardmäßig 10 Einträge pro Durchgang.
   - **Max. Batch-Kapazität**: 12.000 Zeichen (optimal für fehlerfreie KI-Antworten ohne Textabbrüche).

---

## 2. Das 4-Schritte Translation Studio

Das Modul führt dich in einem intuitiven Studio durch den Übersetzungsprozess:

### Schritt 1: Setup & Auswahl
1. Öffne das Studio über den Button **`Universal Übersetzer`** in der Kopfleiste von Journalen, Items, Akteuren oder Kompendien (oder per Rechtsklick auf Ordner/Dokumente).
2. Ziehe das gewünschte Dokument oder einen ganzen Ordner per Drag & Drop in das Fenster.
3. Wähle deinen Modus:
   - **Übersetzen**: Überträgt englische Texte in stimmungsvolles Rollenspiel-Deutsch.
   - **Lektorat / Grammatik**: Prüft deutsche Texte auf Rechtschreibung, Stil und Begriffskonsistenz.
   - **Glossar extrahieren**: Liest Eigennamen und Fachbegriffe aus dem Text aus.
4. Markiere die gewünschten Seiten oder nutze *"Nur nicht übersetzt"* / *"Nächster Batch"*.
5. Die **Live-Kapazitätsanzeige** visualisiert die Zeichenmenge und teilt den Text bei Bedarf automatisch in handliche Batches auf.
6. Klicke auf **"Prompt generieren & Weiter"**.

### Schritt 2: Prompt kopieren & KI öffnen
1. Klicke auf **"Prompt kopieren & KI öffnen"**.
2. Der Prompt wird in deine Zwischenablage kopiert und dein KI-Anbieter öffnet sich automatisch im Browser.
3. Füge den Prompt bei der KI mit `STRG + V` ein und sende die Nachricht ab.
4. Kopiere die generierte Antwort der KI.

### Schritt 3: Antwort einfügen & Analysieren
1. Kehre zu Foundry VTT zurück (das Studio wartet bereits im Schritt 3).
2. Füge die Antwort mit `STRG + V` ein und klicke auf **"Antwort analysieren & Prüfen"**.
3. Das Modul bereinigt automatisch Markdown-Formatierungen, repariert Umlaute (Mojibake-Schutz) und validiert Verlinkungen.

### Schritt 4: Vorschau & Speichern
1. Prüfe die übersetzten Texte im **Side-by-Side Diff-Viewer**.
2. Neu erkannte Glossar-Begriffe werden aufgelistet und automatisch in dein in-world **AI Glossar** übernommen.
3. Klicke auf **"Änderungen anwenden & Speichern"**. Vor jedem Speichern erstellt das Modul automatisch ein sicheres Backup deines Originaldokuments.

---

## 3. Werkzeuge in der Kopfleiste

- 🛡️ **Auditor**: Führt einen weltweiten Integritätscheck für alle Kampagnendokumente durch (prüft auf fehlende Chunks, fehlerhafte Verlinkungen und Umlaute-Glitches mit 1-Klick-Reparatur).
- ⚡ **Smart-Sync**: Gleicht nach einem offiziellen Modul- oder System-Update deine Dokumente mit dem Translation Memory ab und stellt deutsche Übersetzungen blitzschnell kostenlos wieder her.
- 🔗 **Links Sync**: Biegt Kompendium-Verlinkungen (@UUID/@Embed) auf bereits existierende Welt-Dokumente um.
- 💾 **Backup & Import**: Exportiert und importiert das gesamte Übersetzungswissen als portable `.json`-Datei.
- 🔍 **Volltextsuche**: Durchsucht Journale weltweit nach Textmustern mit RegEx- und Batch-Ersetzungsfunktionen.
- 📚 **Glossar-Manager**: Ermöglicht schnelles Suchen, Hinzufügen, Bearbeiten und alphabetisches Sortieren aller Glossarbegriffe.
- 📊 **Statistik**: Zeigt übersetzte Wörter und geschätzte Zeitersparnis an.

---

## 4. Vorlesetext-Schnellübersetzung (📢)

Für die spontane Vorbereitung am Spieltisch:
- Jedes Fenster und Sheet besitzt in der oberen Kopfleiste ein rotes Vorlese-Symbol (**📢 Vorlesetext**).
- Ein Klick öffnet den Inhalt direkt im Translation Studio für eine sofortige Übersetzung der Passage.
- Beim Markieren von beliebigem Text im Spiel erscheint ein schwebendes Übersetzungs-Widget.
