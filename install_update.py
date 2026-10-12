#!/usr/bin/env python3
from pathlib import Path
import re
p=Path(__file__).resolve().parent/'index.html'
if not p.exists():raise SystemExit('FEHLER: index.html fehlt. Vollständige Repository-Dateien vorher hinzufügen.')
s=p.read_text(encoding='utf-8')
for f in ('curriculum-extra.js','subjects-extra.js','examples-extra.js','update-check.js'):
 s=re.sub(r'<script\s+src="'+re.escape(f)+r'(?:\?[^\"]*)?"\s+defer></script>','',s)
for anchor,addition in [('questions.js','curriculum-extra.js'),('app.js','subjects-extra.js'),('quiz.js','examples-extra.js'),('examples-extra.js','update-check.js')]:
 pattern=r'(<script\s+src="'+re.escape(anchor)+r'(?:\?[^\"]*)?"\s+defer></script>)'
 s,count=re.subn(pattern,lambda m:m.group(1)+'<script src="'+addition+'?v=1.2.0" defer></script>',s,count=1)
 if count!=1:raise SystemExit('FEHLER: '+anchor+' nicht gefunden.')
for a,b in [('Version 1.1.0 · 150 Tests','Version 1.2.0 · 154 Tests'),('FixClever 1.1.0 enthält','FixClever 1.2.0 enthält'),('150 redaktionell erstellte Erklärungen','154 redaktionell erstellte Erklärungen'),('in fünf Fächern','in neun Fächern'),('150 Tests mit je 10 Aufgaben','154 Tests mit je 10 Aufgaben'),('5 Fächer. Klasse 1–10. Dein Tempo.','9 Fächer. Klasse 1–10. Dein Tempo.')]:s=s.replace(a,b)
p.write_text(s,encoding='utf-8')
print('OK index.html angepasst')
