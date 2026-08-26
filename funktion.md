# 🧙‍♂️ Phil's Universal AI Translator – Das "Grimoire der Faulheit"

<div align="right">
  <a href="how-it-works.md">🇬🇧 Switch to English: Grimoire of Laziness</a>
</div>

Moin! Willkommen im Club der entspannten Spielleiter. Du hast dich also für **Phil's Universal AI Translator** entschieden. Exzellente Wahl.

Vielleicht sitzt du gerade da, trinkst einen Kaffee und fragst dich: *"Wie zur Hölle funktioniert dieses Zauberwerk eigentlich ohne teure API-Keys, und warum explodiert meine Foundry-Welt dabei nicht?"*

Hier ist der Deep Dive unter die Haube – erklärt für Leute, die gerne epische Kampagnen leiten, aber bei JSON-Dateien und API-Rechnungen Schweißausbrüche bekommen.

---

## 🏗️ Das Prinzip: Die biologische Daten-Pipeline

Moderne KI-Modelle wie Google Gemini, ChatGPT oder Claude sind genial im Übersetzen von Fantasy- und Sci-Fi-Texten. Aber: Direkte API-Schnittstellen kosten Geld, erfordern Kreditkarten und sperren Konten, wenn man mal ein dickes Regelbuch durchjagt.

Die Lösung: **Du bist die Schnittstelle!**

1. **Das Modul bereitet alles mundgerecht vor:** Es scannt dein Dokument, maskiert geschützte Foundry-Links (`@UUID`, `@Embed`, Würfelformeln), setzt Glossarbegriffe ein und schnürt ein perfekt optimiertes Prompt-Paket.
2. **Kopieren & KI öffnen:** 1 Klick auf *"Kopieren & KI öffnen"* befördert den Prompt in deine Zwischenablage und öffnet deinen Browser.
3. **Einfügen (`STRG + V`):** Die KI erledigt die Denkarbeit.
4. **Antwort zurückholen:** Du kopierst die Antwort, fügst sie im Studio ein – und das Modul parst das JSON, heilt Umlaute und aktualisiert deine Welt in Millisekunden!

---

## 🛡️ Das "Keuschheitsgürtel-Protokoll" (Link- & Syntax-Schutz)

KIs lieben es, "kreativ" zu sein. Bei Foundry-Links wie `@UUID[JournalEntry.abc123xyz]{Die Gruft}` ist Kreativität jedoch tödlich. Wenn die KI versucht, die interne ID `abc123xyz` ins Deutsche zu übersetzen, zerschießt es die Verlinkung.

### Wie das Modul deine Verlinkungen schützt:
- **LinkProtection-Engine:** Vor dem Senden an die KI werden Verlinkungen erkannt.
- **Intelligente Rekonstruktion:** Falls die KI trotz aller Anweisungen eine ID beschädigt hat, erkennt der LinkProtection-Parser das Ziel und repariert die Verlinkung automatisch auf das korrekte Ziel-Dokument.
- **Anzeigenamen-Übersetzung:** Der optionale Text in den geschweiften Klammern `{...}` darf übersetzt werden, während das Link-Ziel unantastbar bleibt.

---

## 📚 Das In-World Glossar: Buchhaltung auf Autopilot

Niemand pflegt gerne manuell Vokabellisten. Deshalb zwingt das Modul die KI, diese Arbeit automatisch bei jeder Übersetzung mitzuerledigen:

1. **Erkennung:** Bei jeder Übersetzung scannt die KI nach neuen Eigennamen, Orten, Charakteren oder Fachbegriffen.
2. **Kategorisierung:** Die Begriffe werden direkt 12 Themenkategorien zugeordnet (Orte, Götter, Organisationen, Biome, Spezies, Zauber etc.).
3. **1-Klick Import:** Im Schritt 4 des Studios landen alle neuen Begriffe mit einem Klick in deinem Journal **`AI Glossar`** in Foundry.
4. **Konsistenz:** Beim nächsten Kapitel kennt das Modul alle bisherigen Begriffe und garantiert absolute Namenskonsistenz über die gesamte Kampagne!

---

## 🔒 Der Fallschirm: 100% Verlässliche Backups

Weil Sicherheit an erster Stelle steht:
- Bevor auch nur ein Buchstabe in deiner Welt geändert wird, dupliziert das Modul das Original automatisch als `Dokumentname (Backup)`.
- Sollte jemals etwas schiefgehen, klickst du einfach auf **"Backup wiederherstellen"** – und dein Originalstand ist unversehrt wieder da.
