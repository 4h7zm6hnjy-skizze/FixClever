# FixClever 1.1.0 – Webapp für GitHub

150 Erklärungen und 150 zugehörige Tests mit je 10 Aufgaben (1.500 Aufgaben), 5 Fächer, Klassen 1–10. Keine Installation von Node, keine API-Schlüssel und kein Build notwendig.

## Neu in 1.1.0

- Zu jedem vorhandenen Thema ein Test mit genau zehn Aufgaben: Auswahl, Lücken, Rechnungen oder Aussagen zum Prüfen.
- Kinderprofile mit Vorname/Spitzname, eigener Klassenwahl, Merkliste und Lesemarkierungen.
- Persönliche Ansprache in Test, Ergebnis, Hinweis und Statistik.
- Auswertung: richtige Antworten, Fehler, Prozentwert und Lernnote 1–6.
- Transparenter Übungsschlüssel: 10 richtig = 1; 9 = 2; 8 = 3; 6–7 = 4; 3–5 = 5; 0–2 = 6. Keine verbindliche Schulnote.
- Unter 6 richtigen Antworten: persönlicher Hinweis „guck dir bitte nochmal die Erklärung an!“ mit direktem Link.
- Richtige Lösung und Begründung zu jeder Aufgabe nach der Abgabe.
- Persönliche Statistik mit Fach-/Themenfilter, Verlauf und Notendurchschnitt. Alle abgeschlossenen Wiederholungen zählen; abgebrochene Tests zählen nicht.
- Ergebnisdetails bleiben abrufbar. Antwortreihenfolge und Aufgabenreihenfolge werden für neue Versuche gemischt.
- JSON-Backup pro Kind exportieren und als zusätzliches Profil wiederherstellen.

## Update einspielen

Alle Dateien dieses Pakets gemeinsam in die oberste Repository-Ebene hochladen bzw. ersetzen: index.html, app.js, style.css, lessons.js, questions.js, quiz.js und icon.svg. README.md enthält diese Anleitung. Die neuen Dateien questions.js und quiz.js dürfen nicht fehlen. Bestehende Inhalte behalten ihre Themen-IDs. Vorherige gemeinsame Merkliste und Lesemarkierungen werden in das erste neu angelegte Kinderprofil übernommen. Browserdaten beim Update nicht löschen.

## Enthalten

- Deutsch, Mathe, Englisch, Politik und Erdkunde.
- Jeweils drei ausgearbeitete Themen pro Fach und Klasse: Erklärung, Beispiel, Merksatz.
- Altersdesign: 1–4 bunt und groß, 5–7 hell und frisch, 8–10 dunkel und reduziert.
- Fach- und Klassenfilter, Volltextsuche über einzelne oder alle Klassen.
- Merkliste, Lesemarkierungen, zuletzt geöffnetes Thema, lokale Speicherung.
- Vorlesefunktion des Geräts, Schriftgrößenwahl, Druckansicht und Zurück-Navigation.
- Keine Werbung, kein eigenes Tracking, keine Kontenverwaltung, keine offene KI-Fragefunktion.

## Zuerst: Was bedeutet privat?

Das Paket enthält KEINEN eingebauten Login oder Passwortschutz. Ein privates GitHub-Repository schützt den Quellcode, aber eine normale GitHub-Pages-Veröffentlichung ist öffentlich erreichbar. Für private Pages-Veröffentlichungen mit GitHubs Zugriffskontrolle wird eine passende GitHub-Enterprise-Cloud-Organisation benötigt. Alternativ muss die App bei einem Anbieter mit echtem serverseitigem Zugangsschutz gehostet werden. Ein Passwort allein im JavaScript wäre kein zuverlässiger Schutz.

Wenn nur du oder deine Familie Zugriff haben sollen: Quellcode im privaten Repository speichern und Pages NICHT aktivieren, solange kein passender Zugangsschutz eingerichtet ist. Das Hochladen in ein bereits für Pages eingerichtetes Repository kann eine Veröffentlichung auslösen. Namen und Ergebnisse werden nicht in den Quellcode geschrieben und nicht hochgeladen.

## Dateien in GitHub hochladen

1. ZIP entpacken.
2. Ein eigenes, neues Repository für FixClever verwenden; keine andere App überschreiben.
3. „Add file“ → „Upload files“ öffnen.
4. Die entpackten Dateien in die oberste Ebene hochladen. Dort müssen index.html, style.css, app.js, lessons.js, questions.js, quiz.js und icon.svg nebeneinander liegen. Die ZIP selbst ist keine startfähige Website.
5. Änderungen mit „Commit changes“ speichern. Die .nojekyll-Datei nach Möglichkeit ebenfalls übertragen; bei diesen Dateinamen funktioniert die einfache statische Seite auch ohne sie.

## Optional: Öffentliche GitHub-Pages-Veröffentlichung

Nur ausführen, wenn öffentliche Erreichbarkeit gewünscht ist oder separat passende private Pages-Zugriffskontrolle besteht.

1. „Settings“ → „Pages“ öffnen.
2. Unter „Build and deployment“ als Quelle „Deploy from a branch“ wählen.
3. Branch „main“ und Verzeichnis „/(root)“ auswählen, dann „Save“.
4. GitHub zeigt nach Bereitstellung unter Pages die echte Adresse an. Diese Adresse hängt vom Konto und Repository ab; es wurde hier keine Adresse erfunden.

Pages-Verfügbarkeit hängt vom Tarif und der Repository-Sichtbarkeit ab. Offizielle Hinweise:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site
Stand der Prüfung: 13.10.2026.

## Nutzung und Updates

Die App läuft im Browser und benötigt zum Laden vom Webserver Internet. Es gibt keinen Service Worker und keine zugesicherte Offline-Installation. Alle Inhaltsdateien liegen im Paket; keine externen Schriftarten oder Skriptbibliotheken werden geladen. Vorlesen hängt von den Stimmen des Geräts ab und kann einen externen Sprachdienst nutzen. Englische Beispiele können von der deutschen Stimme ungewohnt ausgesprochen werden.

Namen, Testergebnisse und Lernmarkierungen bleiben im Browserprofil und werden nicht synchronisiert. Kinderprofile sind keine gesicherten Benutzerkonten: Wer denselben Browser verwendet, kann die Profile wechseln und Ergebnisse lesen. Ein Vorname oder Spitzname genügt. Backup-Dateien enthalten Namen und Ergebnisse; sie nicht in ein öffentliches Repository hochladen. Löschen von Browserdaten entfernt sie. Bei Verwendung mehrerer Apps unter derselben Domain sollten diese nicht denselben Speicher-Schlüssel „fixclever-v1“ bzw. „fixclever-profiles-v1“ benutzen.

Bei Updates alle zusammengehörigen Dateien ersetzen. Bleiben Adresse, Browser und Speicher-Schlüssel gleich, können lokale Markierungen weiterverwendet werden; Themen-IDs beim Erweitern stabil halten.

## Inhaltlicher Umfang

Dies ist eine erste Grundlagenbibliothek, kein vollständiger Lehrplan der Klassen 1–10. Bundesland und Schulform beeinflussen Themen und Reihenfolge. Die Zuordnung ist eine Orientierung. Politik und Erdkunde der Klassen 1–4 verwenden Sachunterrichtsthemen. Englisch in Klasse 1–2 dient dem spielerischen Einstieg. Die Erklärungen wurden auf grundlegende Konsistenz geprüft, aber nicht unabhängig fachredaktionell abgenommen.

## Technische Prüfung

JavaScript-Syntax, 150 Themen und 1.500 Fragen geprüft. Tests laufen automatisiert durch alle 150 Tests; geprüft werden alle 11 möglichen Punktzahlen, Notengrenzen, Rückverweis unter 6 Punkten, vollständige Beantwortung, Schutz vor Doppelzählung, Profiltrennung, Migration, Statistiken, lokale Speicherung, Backup-Validierung und Dateiverweise. Die Prüfungen verwenden eine simulierte DOM-Umgebung und ersetzen keinen echten Browser-Test. Keine echte Browser-Sichtprüfung in dieser Umgebung möglich; responsive CSS für Handy, Tablet und Desktop vorbereitet. Vorlesen und Drucken müssen auf dem Zielgerät geprüft werden.
