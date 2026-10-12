# FixClever 1.0 – Webapp für GitHub

150 Erklärungen, 5 Fächer, Klassen 1–10. Keine Installation von Node, keine API-Schlüssel und kein Build notwendig.

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

Wenn nur du oder deine Familie Zugriff haben sollen: Quellcode im privaten Repository speichern und Pages NICHT aktivieren, solange kein passender Zugangsschutz eingerichtet ist. Es wird mit diesem Paket nichts automatisch veröffentlicht.

## Dateien in GitHub hochladen

1. ZIP entpacken.
2. Ein eigenes, neues Repository für FixClever verwenden; keine andere App überschreiben.
3. „Add file“ → „Upload files“ öffnen.
4. Die entpackten Dateien in die oberste Ebene hochladen. Dort müssen index.html, style.css, app.js, lessons.js und icon.svg nebeneinander liegen. Die ZIP selbst ist keine startfähige Website.
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

Lernmarkierungen bleiben im Browserprofil und werden nicht synchronisiert. Löschen von Browserdaten entfernt sie. Bei Verwendung mehrerer Apps unter derselben Domain sollten diese nicht denselben Speicher-Schlüssel „fixclever-v1“ benutzen.

Bei Updates alle zusammengehörigen Dateien ersetzen. Bleiben Adresse, Browser und Speicher-Schlüssel gleich, können lokale Markierungen weiterverwendet werden; Themen-IDs beim Erweitern stabil halten.

## Inhaltlicher Umfang

Dies ist eine erste Grundlagenbibliothek, kein vollständiger Lehrplan der Klassen 1–10. Bundesland und Schulform beeinflussen Themen und Reihenfolge. Die Zuordnung ist eine Orientierung. Politik und Erdkunde der Klassen 1–4 verwenden Sachunterrichtsthemen. Englisch in Klasse 1–2 dient dem spielerischen Einstieg. Die Erklärungen wurden auf grundlegende Konsistenz geprüft, aber nicht unabhängig fachredaktionell abgenommen.

## Technische Prüfung

JavaScript-Syntax, 150 vollständige Datensätze, alle 50 Fach/Klassen-Kombinationen, Altersdesign-Zuordnung, Suche, Merkliste, Lesemarkierungen, Zurück-Navigation, lokale Speicherung und Dateiverweise automatisiert geprüft. Keine echte Browser-Sichtprüfung in dieser Umgebung möglich; responsive CSS für Handy, Tablet und Desktop vorbereitet. Vorlesen und Drucken müssen auf dem Zielgerät geprüft werden.
