# FixClever 3.0.0 – Prüfbericht

**Datum:** 13. Oktober 2026  
**Basis:** öffentlich zugängliche FixClever-2.3.3-Repository-Dateien; neues Update als *Zusatzdateien*.

## Testergebnisse

- Syntaxprüfung mit Node.js: `fc231-tests.js`, `fc300-suite.js` und `sw.js` erfolgreich.
- Isolierter Chromium-Browsertest bei 390 × 844 Pixeln: Lerncockpit installiert; alle **neun** Reiter sichtbar und klickbar: Lernplan, Trainer, Arbeitsblätter, Statistik, Lehrplan, Eltern, Vorlesen, Sicherung, Diagnose.
- **Zwölf** Trainer-Bereiche durchgeschaltet und Antwortanzeige geprüft: Plus, Minus, Mal, Geteilt, Brüche, Prozent, Gleichungen, Flächen, Deutsch, Englisch, Geschichte, Musik.
- Wochenziel geändert und in simuliertem lokalen Browser-Speicher gespeichert.
- Backupdatei und JSON-Diagnose-Datei konnten im Testbrowser heruntergeladen werden.
- Das Testergebnis der strukturellen Selbstdiagnose im **simulierten Datensatz** lautete: 150 Lektionen, 1.500 Fragen, null Strukturfehler. Das ist **kein Ergebnis für den vollständigen produktiven Datenbestand**.
- Im isolierten Modultest keine unbehandelten JavaScript-Laufzeitfehler beobachtet.

**Testgrenze:** Der Browsertest verwendete eine synthetische Weboberfläche; eine vollständige Kopie des 3,9-MB-Produktivdatenpakets sowie ein echter Lauf auf iOS-Safari standen nicht zur Verfügung. Daher kann die Gesamt-App **nicht als fehlerfrei bescheinigt** werden. Das Update ist **noch nicht auf GitHub veröffentlicht**.

## Abgleich mit den 15 gewünschten Verbesserungen

| Nr. | Punkt | Stand | Nachweis/Grenze |
|---|---|---|---|
| 1 | Modernere Startseite | Zusatzmodul umgesetzt | Lerncockpit, Kacheln, Fortschritt, responsiv |
| 2 | Interaktive Erklärungen | Teilweise | Interaktiver Trainer und Musik-Töne, vorhandene Fachmodule erhalten; kein flächendeckender interaktiver Kurs |
| 3 | Individueller Lerntrainer | Umgesetzt, regelbasiert | Empfehlungen aus bisherigen Tests; keine KI-Auswertung |
| 4 | Schneller Start | Nur teilweise | Leichtgewichtiges Zusatzmodul; bestehender 3,9-MB-Kern weiterhin im synchronen Ladepfad |
| 5 | Navigation und Stabilität | Teilweise getestet | Neun neue Reiter getestet; kompletter Alt-App-Klicktest offen |
| 6 | Fachlich geprüfte Quizfragen | Strukturschutz | Originalfragen und Antworten erhalten; fachliche Einzelprüfung noch offen |
| 7 | Fünf erklärte Beispiele | Teilweise | Bis zu fünf vorhandene Erklärung/Quiz-Beispiele; Qualität und Vollständigkeit nicht einzeln bestätigt |
| 8 | NRW-Lehrplan | Übersicht umgesetzt | Links und Klassenstatistik; amtlicher Einzelabgleich offen |
| 9 | Offline-Modus | Verbessert | 3.0-Service-Worker mit kontrolliertem Cache; Fachpakete einzeln herunterladen noch nicht umgesetzt |
| 10 | Menschlichere Sprachausgabe | Bedienelemente umgesetzt | Geräte-Stimme, Tempo, Tonhöhe; natürliches Sprachmodell nicht enthalten |
| 11 | Lernstatistik | Umgesetzt | Fachbezogene Aggregation, Fehler und Fortschritt; Profile lokal |
| 12 | Lernplan | Umgesetzt, regelbasiert | Priorisierte Themen und Wiederholungshinweise |
| 13 | Elternbereich | Umgesetzt | Wochenziel und Profilübersicht; keine PIN |
| 14 | Arbeitsblätter | Umgesetzt mit Browserdruck | Antworten auf separater Seite, PDF über Druckdialog; kein unabhängiger PDF-Server |
| 15 | Sicherung und Diagnose | Umgesetzt | Lokal-JSON-Backup, Wiederherstellung mit Bestätigung, Fehlerdiagnose |

## Bestandschutz

Keine Änderung an `app.js`, `quiz.js`, `lessons.js`, `questions.js` oder `fc231-inhalte.js` ist in diesem Paket vorgesehen. Die bisher gespeicherten Lernstände werden nicht absichtlich gelöscht. Der neue Service Worker leert ausschließlich alte App-Caches, wenn die neue Installation vollständig ist. Die Cache-Reparatur löscht **nicht** `localStorage` oder `indexedDB`.

**Zu beachten:** Bei Import einer älteren Sicherung können vorhandene Lernstände nach ausdrücklicher Bestätigung überschrieben werden. Vorher selbst eine frische Sicherung exportieren.

## Offene Tests vor einer Freigabe für Kinder

1. Echte Startzeit auf einem iPhone bei sauberem Online-Start und nach Cache-Reparatur messen.
2. Je Klassenstufe und Fach mindestens einen Lese-/Quiz-Durchlauf im vollständigen Datenbestand durchführen.
3. Zufallsstichproben der historischen, mathematischen und sprachlichen Lösungsschlüssel fachlich prüfen.
4. Profilwechsel, Löschen, Neustart, Backups und Wiederherstellung auf demselben Gerät prüfen.
5. Offline-Start nach vollständiger Speicherung im Flugmodus ausprobieren.
6. PDF-Druck auf iOS, Android und Desktop und Barrierefreiheit manuell prüfen.
