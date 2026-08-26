# Funktionsweise: Phil's Universal Translator

<div align="right">
  <a href="how-it-works.md">Switch to English Overview</a>
</div>

Diese Übersicht erklärt das Funktionsprinzip von Phil's Universal Translator: wie das Modul ohne laufende API-Kosten arbeitet und wie es deine Kampagnendaten während des Übersetzungsprozesses absichert.

---

## Das Grundprinzip: Die strukturierte Pipeline

Direkte API-Schnittstellen für KI-Modelle verursachen oft laufende Kosten, Kontolimits und Sperren, wenn man umfangreiche Regel- oder Abenteuerbände verarbeitet.

Phil's Universal Translator umgeht diese Hürden durch eine intelligente lokale Vorbereitung:

1. **Strukturierte Aufbereitung:** Das Modul scannt dein Dokument, maskiert geschützte Foundry-Verlinkungen (`@UUID`, `@Embed`, Würfelformeln), setzt bisherige Glossarbegriffe ein und formuliert einen optimierten Prompt.
2. **Kopieren & KI öffnen:** Ein Klick befördert den Prompt in die Zwischenablage und öffnet die kostenlose Weboberfläche deines bevorzugten Anbieters (z. B. Gemini oder ChatGPT) im Browser.
3. **Verarbeitung:** Die KI führt die Übersetzung im vollständigen Kontextfenster durch.
4. **Prüfung und Übernahme:** Du fügst die Antwort im Studio ein. Das Modul validiert das JSON, repariert Zeichensätze und aktualisiert die Dokumente in Foundry.

---

## Link- und Syntax-Schutz

Sprachmodelle neigen gelegentlich dazu, technische Parameter abzuändern. Wenn eine KI in einem Link wie `@UUID[JournalEntry.abc123xyz]{Die Gruft}` die interne ID `abc123xyz` übersetzt, wird die Verlinkung zerstört.

### Schutzmaßnahmen des Moduls:
- **Erkennung vor dem Senden:** Alle Verlinkungen werden vor der Prompt-Erstellung erfasst und geschützt.
- **Automatische Reparatur:** Der LinkProtection-Parser gleicht die zurückgegebenen IDs mit den Originaldaten ab und korrigiert beschädigte Pfade automatisch.
- **Anzeigenamen-Übersetzung:** Der sichtbare Text in geschweiften Klammern `{...}` wird passend in die Zielsprache übersetzt, während das technische Linkziel unberührt bleibt.

---

## Automatisches In-World Glossar

Konsistente Begriffe über mehrjährige Kampagnen hinweg erfordern saubere Begriffslisten:

1. **Automatische Erkennung:** Die KI erkennt neue Eigennamen, Orte, Charaktere und Fachbegriffe bei jedem Durchgang.
2. **Kategorisierung:** Neue Begriffe werden direkt 12 thematischen Kategorien zugeordnet (Orte, Götter, Organisationen, Biome, Spezies, Klassen, Zauber, Regeln etc.).
3. **1-Klick-Übernahme:** Im Studio werden bestätigte Begriffe direkt in das Journal **AI Glossar** in Foundry eingetragen.
4. **Konsistenz:** Bei künftigen Kapiteln greift das Modul auf diese Begriffe zurück und garantiert eine einheitliche Nomenklatur.

---

## Automatische Sicherheits-Backups

Datensicherheit steht an erster Stelle:
- Vor jedem Schreibvorgang dupliziert das Modul das Originaldokument automatisch als `Dokumentname (Backup)`.
- Sollte eine Übersetzung nicht den Erwartungen entsprechen, setzt ein Klick auf **Backup wiederherstellen** das Dokument sofort auf den Ausgangszustand zurück.
