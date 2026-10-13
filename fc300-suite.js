/* FixClever 3.0.0 – integriertes Qualitäts- und Lernupdate.
   Zusatzmodul zur bestehenden App. Keine Cloud, keine fremden Bibliotheken,
   keine Veränderung an vorhandenen Lernfragen, Profilen oder Testergebnissen. */
(()=>{
'use strict';
const VERSION='3.0.0', CONFIG='fixclever-300-settings', LOG='fixclever-300-errors';
const ui={};let installed=false,activeTab='plan',task=null,taskNum=0,answers={},lastDiagnostic=null;
const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=v=>Number.isFinite(Number(v))?Number(v):0;
const iso=d=>new Date(d).toLocaleDateString('de-DE');
const bounded=(v,min,max)=>Math.max(min,Math.min(max,number(v)));
const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
const safePut=(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}};
const readConfig=()=>{try{return {...{weeklyGoal:5,voice:'',rate:0.88,pitch:1,grade:5},...JSON.parse(safeGet(CONFIG)||'{}')}}catch{return{weeklyGoal:5,voice:'',rate:.88,pitch:1,grade:5}}};
let cfg=readConfig();
const saveCfg=()=>safePut(CONFIG,JSON.stringify(cfg));
const reportError=(area,e)=>{
 const err={date:new Date().toISOString(),area:String(area).slice(0,80),message:String(e?.message||e).slice(0,220)};
 try{const logs=JSON.parse(safeGet(LOG)||'[]');safePut(LOG,JSON.stringify([...logs.slice(-24),err]));}catch{}
 console.warn('FixClever 3:',area,e);
};
const lessons=()=>typeof LESSONS!=='undefined'&&Array.isArray(LESSONS)?LESSONS:[];
const banks=()=>typeof QUESTIONS!=='undefined'?QUESTIONS:{};
const profile=()=>typeof child==='function'?child():null;
const profiles=()=>typeof profileData!=='undefined'&&profileData?.profiles||[];
const grade=()=>typeof state==='object'&&state?.grade||5;
const row=id=>lessons().find(l=>l.id===id);
const attempts=()=>Array.isArray(profile()?.attempts)?profile().attempts.filter(a=>a&&a.total===10&&Number.isInteger(a.correct)):[];
const getSubjects=()=>[...new Set(lessons().map(l=>l.subject))].sort((a,b)=>a.localeCompare(b,'de'));
const weekStart=()=>{const now=new Date();now.setHours(0,0,0,0);now.setDate(now.getDate()-(now.getDay()+6)%7);return now;};
const weekCount=()=>attempts().filter(a=>new Date(a.date)>=weekStart()).length;
const results=()=>{const a=attempts();let correct=0;for(const t of a)correct+=t.correct;return{count:a.length,correct,total:a.length*10,avg:a.length?Math.round(correct/a.length*10):null};};
const isQuestionOK=q=>!!q&&typeof q.prompt==='string'&&Array.isArray(q.options)&&q.options.length>=2&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length&&typeof q.options[q.answer]==='string';
const verifiedBank=id=>Array.isArray(banks()[id])?banks()[id].filter(isQuestionOK):[];
const pickLearning=()=>{
 const l=lessons(),attemptMap=new Map();
 for(const a of attempts().sort((a,b)=>new Date(a.date)-new Date(b.date)))attemptMap.set(a.lessonId,a);
 return l.filter(x=>x.grade===grade()).map(x=>{
  const a=attemptMap.get(x.id);let due=0,priority=0;
  if(a){const days=[0,1,3,7,14,30][Math.min(5,Math.floor(a.correct/2))];due=new Date(a.date).getTime()+days*86400000-Date.now();priority=(10-a.correct)*10+(due<=0?35:0);}else priority=15;
  return {lesson:x,attempt:a,due,priority};
 }).sort((a,b)=>b.priority-a.priority||a.lesson.title.localeCompare(b.lesson.title,'de'));
};
function updateVersion(){
 const meta=$('meta[name="fixclever-version"]');if(meta)meta.content=VERSION;
 const version=$('#fc-current-version');if(version)version.textContent='FixClever · Version '+VERSION;
 const side=$('.sidebar .version');if(side)side.textContent='Version '+VERSION+' · '+lessons().length+' Themen';
 document.documentElement.dataset.fc300Version=VERSION;
}
function addStyles(){if($('#fc300-style'))return;const link=document.createElement('link');link.id='fc300-style';link.rel='stylesheet';link.href='./fc300-style.css?v='+VERSION;document.head.append(link);}
function createUI(){
 const dialog=document.createElement('dialog');dialog.id='fc300-hub';dialog.className='fc300-hub';dialog.setAttribute('aria-label','FixClever Lerncockpit');
 dialog.innerHTML='<header class="fc300-hub-head"><div><p>FIXCLEVER · VERSION '+VERSION+'</p><h2>Dein Lerncockpit</h2></div><button class="fc300-close" data-fc300="close" aria-label="Schließen">×</button></header><nav class="fc300-hub-tabs" id="fc300-tabs" aria-label="Lernbereiche"></nav><div class="fc300-hub-content" id="fc300-content"></div>';
 document.body.append(dialog);ui.dialog=dialog;
 const action=document.createElement('button');action.type='button';action.className='fc300-button primary';action.id='fc300-launch';action.textContent='Lerncockpit 3.0';action.dataset.fc300='open';
 const top=$('.top-actions')||$('.sidebar nav');if(top)top.append(action);else document.body.prepend(action);
 dialog.addEventListener('cancel',e=>{e.preventDefault();dialog.close();stopVoice();});
 document.addEventListener('click',handleClick);
 document.addEventListener('change',handleChange);
 const captureError=e=>reportError('Browser',e?.message||'Unbekannter Fehler');
 window.addEventListener('error',captureError);
 window.addEventListener('unhandledrejection',e=>reportError('Promise',e.reason));
 const check=$('#fc-update-check');if(check){check.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();await checkUpdate();},true);}
}
function dashboard(){
 const overview=$('#overview');if(!overview)return;
 let node=$('#fc300-dashboard');if(!node){node=document.createElement('section');node.id='fc300-dashboard';node.className='fc300-dashboard';const hero=overview.querySelector('.hero');hero?.after(node);if(!hero)overview.prepend(node);}
 const p=profile(),s=results(),weekly=weekCount(),today=pickLearning()[0],goal=bounded(cfg.weeklyGoal,1,35)||5;
 node.innerHTML='<span class="fc300-eyebrow">DEIN LERNWEG</span><h2>'+esc(p?.name?p.name+', dein Lernfortschritt':'Wissen entdecken – in deinem Tempo')+'</h2><p>'+esc(today?.lesson?'Vorschlag für heute: '+today.lesson.title:'Wähle ein Thema und beginne mit einer Erklärung.')+'</p><div class="fc300-kpis"><div class="fc300-kpi"><strong>'+s.count+'</strong><small>Tests insgesamt</small></div><div class="fc300-kpi"><strong>'+(s.avg===null?'–':s.avg+'%')+'</strong><small>Antworten richtig</small></div><div class="fc300-kpi"><strong>'+weekly+'/'+goal+'</strong><small>Wochenziel</small></div></div><div class="fc300-progress" aria-label="Wochenfortschritt"><span style="width:'+Math.min(100,weekly/goal*100)+'%"></span></div><div class="fc300-actions" style="margin-top:14px"><button class="fc300-button primary" data-fc300="open" data-tab="plan">Mein Lernplan</button><button class="fc300-button" data-fc300="open" data-tab="trainer">Interaktiv üben</button><button class="fc300-button" data-fc300="open" data-tab="worksheets">Arbeitsblatt</button></div>';
}
const tabs=[['plan','Lernplan'],['trainer','Trainer'],['worksheets','Arbeitsblätter'],['stats','Statistik'],['curriculum','Lehrplan'],['parents','Eltern'],['voice','Vorlesen'],['backup','Sicherung'],['diagnostics','Diagnose']];
function open(tab='plan'){activeTab=tabs.some(x=>x[0]===tab)?tab:'plan';render();if(!ui.dialog.open)ui.dialog.showModal();}
function render(){
 const nav=$('#fc300-tabs'),body=$('#fc300-content');if(!nav||!body)return;
 nav.innerHTML=tabs.map(([id,name])=>'<button type="button" data-fc300-tab="'+id+'" role="tab" aria-selected="'+String(activeTab===id)+'">'+name+'</button>').join('');
 const sections={plan:renderPlan,trainer:renderTrainer,worksheets:renderWorksheets,stats:renderStats,curriculum:renderCurriculum,parents:renderParents,voice:renderVoice,backup:renderBackup,diagnostics:renderDiagnostics};
 try{body.innerHTML=sections[activeTab]();}catch(e){reportError('Lerncockpit '+activeTab,e);body.innerHTML='<div class="fc300-panel" role="alert">Dieser Lernbereich konnte nicht angezeigt werden. Bitte Diagnose ausführen.</div>';}
}
function openLesson300(id){ui.dialog?.close();if(typeof openLesson==='function')openLesson(id);else reportError('Navigation','openLesson ist nicht vorhanden');}
function renderPlan(){
 const p=profile(),items=pickLearning().slice(0,8),s=results();
 return '<h3>Dein persönlicher Lernplan</h3><p class="fc300-muted">Regelbasierte Wiederholungen aus bisherigen Testergebnissen. Keine KI und keine Übermittlung deiner Daten.</p>'+(p?'<p>Profil: <b>'+esc(p.name)+'</b> · Klasse '+grade()+'</p>':'<div class="fc300-panel" role="alert">Lege oben in der App ein Kinderprofil an, damit der Lernplan deine Testergebnisse berücksichtigen kann.</div>')+'<div class="fc300-grid">'+items.map(x=>{
 const low=x.attempt&&x.attempt.correct<=5;
 return '<article class="fc300-panel"><h4>'+esc(x.lesson.title)+'</h4><p class="fc300-small">'+esc(x.lesson.subject)+' · Klasse '+x.lesson.grade+(x.attempt?' · letztes Ergebnis '+x.attempt.correct+'/10':' · noch nicht getestet')+'</p><p>'+(low?'Erklärung noch einmal anschauen.':x.attempt?'Geübtes Wissen festigen.':'Neues Thema entdecken.')+'</p><button class="fc300-button '+(low?'primary':'')+'" data-fc300-lesson="'+esc(x.lesson.id)+'">Thema öffnen</button></article>';
 }).join('')+'</div><p class="fc300-muted fc300-small">'+s.count+' abgeschlossene Tests · Wiederholungsvorschläge sind keine amtlichen Leistungsbewertungen.</p>';
}
const rand=(lo,hi)=>Math.floor(Math.random()*(hi-lo+1))+lo;
const mathModes=['Plus','Minus','Mal','Geteilt','Brüche','Prozent','Gleichungen','Flächen'];
function generateMath(mode){
 let a,b,c,question,answer,explanation;
 switch(mode){
 case 'Minus':a=rand(12,99);b=rand(1,a);question=`${a} − ${b} = ?`;answer=String(a-b);explanation=`${a} − ${b} = ${answer}. Kontrolle: ${answer} + ${b} = ${a}.`;break;
 case 'Mal':a=rand(2,12);b=rand(2,12);question=`${a} × ${b} = ?`;answer=String(a*b);explanation=`${a} Gruppen mit je ${b} ergeben ${answer}.`;break;
 case 'Geteilt':a=rand(2,12);b=rand(2,12);question=`${a*b} : ${b} = ?`;answer=String(a);explanation=`${b} × ${a} = ${a*b}.`;break;
 case 'Brüche':a=rand(1,4);b=rand(a+1,9);question=`Ein Kuchen hat ${b} gleich große Stücke. ${a} sind markiert. Schreibe den Bruch als Zähler/Nenner.`;answer=`${a}/${b}`;explanation=`${a} Teile von ${b} gleich großen Teilen ergeben ${a}/${b}.`;break;
 case 'Prozent':a=rand(1,9)*10;b=rand(1,12)*10;question=`Wie viel sind ${a} % von ${b}?`;answer=String(a*b/100);explanation=`${a} % von ${b} sind ${a*b/100}.`;break;
 case 'Gleichungen':a=rand(2,19);b=rand(1,15);question=`x + ${b} = ${a+b}. Wie groß ist x?`;answer=String(a);explanation=`Ziehe ${b} auf beiden Seiten ab: x = ${a}.`;break;
 case 'Flächen':a=rand(2,15);b=rand(2,10);question=`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist seine Fläche in cm²?`;answer=String(a*b);explanation=`Fläche = Länge × Breite = ${a} × ${b} = ${answer} cm².`;break;
 default:a=rand(1,90);b=rand(1,90);question=`${a} + ${b} = ?`;answer=String(a+b);explanation=`${a} + ${b} = ${answer}. Kontrolle: ${answer} − ${b} = ${a}.`;
 }
 return {question,answer,explanation,subject:'Mathe',visual:mode==='Brüche'?{selected:a,total:b}:null};
}
const languageTasks={
 Deutsch:[['Welche Wortart ist „laufen“ in „Wir laufen“?','Verb','„Laufen“ bezeichnet hier eine Tätigkeit und ist ein Verb.'],['Was ist die Mehrzahl von „Buch“?','Bücher','Der Plural lautet „Bücher“.'],['Welches Satzzeichen gehört hinter „Wie geht es dir“?','?','Eine direkte Frage endet mit einem Fragezeichen.'],['Was ist das Subjekt in „Die Kinder spielen“?','Die Kinder','Das Subjekt beantwortet „Wer oder was spielt?“'],['Wie lautet das Präteritum von „ich gehe“?','ich ging','Die Vergangenheitsform im Präteritum heißt „ich ging“.']],
 Englisch:[['Was heißt „apple“ auf Deutsch?','Apfel','Apple bedeutet Apfel.'],['Was heißt „window“ auf Deutsch?','Fenster','Window bedeutet Fenster.'],['Setze richtig ein: „She ___ a dog“ (have/has)','has','Bei she verwendest du has.'],['Was heißt „gestern“ auf Englisch?','yesterday','Yesterday bedeutet gestern.'],['Wie lautet die Vergangenheit von „go“?','went','Go ist unregelmäßig: go – went – gone.']]
};
const history=[['Altes Ägypten: Cheops-Pyramide (ungefähr)',-2560],['Rom: traditionelle Gründung',-753],['Karl der Große wird Kaiser',800],['Französische Revolution beginnt',1789],['Deutsche Wiedervereinigung',1990]];
const musicNotes=[['C',261.63],['D',293.66],['E',329.63],['F',349.23],['G',392.00],['A',440],['H',493.88],['C′',523.25]];
function generateTask(mode){
 if(mathModes.includes(mode))return generateMath(mode);
 if(languageTasks[mode]){const arr=languageTasks[mode],q=arr[taskNum%arr.length];return {question:q[0],answer:q[1],explanation:q[2],subject:mode};}
 if(mode==='Geschichte'){
  const i=rand(0,history.length-2);return{question:`Was geschah früher: „${history[i][0]}“ oder „${history[i+1][0]}“?`,answer:history[i][0],explanation:`${history[i][0]} liegt zeitlich vor ${history[i+1][0]}.`,subject:'Geschichte'};
 }
 if(mode==='Musik'){
  const i=rand(0,7),note=musicNotes[i];return{question:'Welcher Ton erklingt? Spiele den gesuchten Ton ab und bestimme seinen Namen.',answer:note[0],explanation:`Auf der dargestellten Klaviatur ist es die Note ${note[0]}.`,subject:'Musik',midiIndex:i};
 }
 return generateMath('Plus');
}
let trainerMode='Plus';
function renderTrainer(){
 if(!task)task=generateTask(trainerMode);
 const visual=task.visual?'<div class="fc300-fraction" role="img" aria-label="'+task.visual.selected+' von '+task.visual.total+' Teilen markiert">'+Array.from({length:task.visual.total},(_,i)=>'<span class="'+(i<task.visual.selected?'selected':'')+'"></span>').join('')+'</div><p class="fc300-small">Die markierten Felder zeigen den Anteil.</p>':'';
 return '<h3>Interaktiver Lerntrainer</h3><p>Mathe, Deutsch, Englisch, Musik und Geschichte – mit Erklärungen statt bloßen Punkten.</p><label class="fc300-field">Lernbereich<select id="fc300-mode">'+[...mathModes,'Deutsch','Englisch','Musik','Geschichte'].map(s=>'<option value="'+s+'" '+(trainerMode===s?'selected':'')+'>'+s+'</option>').join('')+'</select></label><div class="fc300-panel"><h4>'+esc(task.question)+'</h4>'+(trainerMode==='Musik'?'<button class="fc300-button primary" data-fc300="play-question-tone">Gesuchten Ton abspielen</button><div class="fc300-note-keys">'+musicNotes.map(([name],i)=>'<button type="button" data-fc300-note="'+i+'">'+esc(name)+'</button>').join('')+'</div><p class="fc300-small">Vergleiche die Töne der Klaviatur und wiederhole die Hörprobe.</p>':'')+'<label class="fc300-field">Deine Antwort<input id="fc300-answer" autocomplete="off" spellcheck="false" inputmode="'+(mathModes.includes(trainerMode)?'decimal':'text')+'" placeholder="Antwort eingeben"></label><div class="fc300-hub-actions"><button class="fc300-button primary" data-fc300="check-task">Antwort prüfen</button><button class="fc300-button" data-fc300="next-task">Neue Aufgabe</button></div><p id="fc300-task-message" aria-live="polite"></p></div>';
}
const norm=s=>String(s||'').trim().normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[.!?]+$/,'').replace(/\s+/g,' ');
function checkTask(){const input=$('#fc300-answer'),status=$('#fc300-task-message');if(!task||!input||!status)return;
 const expected=norm(task.answer),given=norm(input.value).replace(',','.');const ok=given===expected.replace(',','.');
 status.className='fc300-result'+(ok?'':' bad');status.textContent=(ok?'Richtig. ':'Noch nicht richtig. ')+'Lösung: '+task.answer+'. '+task.explanation;
}
let audio=null;
function playNote(index){try{
 const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx){alert('Tonwiedergabe wird nicht unterstützt.');return;}
 audio=audio||new Ctx();if(audio.state==='suspended')audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=musicNotes[index][1];gain.gain.setValueAtTime(.001,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.14,audio.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.55);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.6);
 }catch(e){reportError('Tonwiedergabe',e);}
}
function renderWorksheets(){
 const list=getSubjects().filter(s=>lessons().some(l=>l.grade===grade()&&l.subject===s&&verifiedBank(l.id).length));return '<h3>Arbeitsblätter zum Drucken oder als PDF speichern</h3><p>Erstellt mit vorhandenen, strukturell geprüften Quizfragen. Die fachliche Prüfung aller Fragen ist noch nicht abgeschlossen. Ein separates Lösungsblatt wird eingefügt.</p><div class="fc300-grid"><label class="fc300-field">Fach<select id="fc300-print-sub">'+list.map(s=>'<option>'+esc(s)+'</option>').join('')+'</select></label><label class="fc300-field">Klasse<select id="fc300-print-grade">'+Array.from({length:10},(_,i)=>'<option value="'+(i+1)+'" '+(grade()===i+1?'selected':'')+'>Klasse '+(i+1)+'</option>').join('')+'</select></label></div><label class="fc300-field">Anzahl Aufgaben<select id="fc300-print-count"><option value="5">5</option><option value="10" selected>10</option><option value="15">15</option><option value="20">20</option></select></label><button class="fc300-button primary" data-fc300="print">Arbeitsblatt mit Lösungen erstellen</button><p class="fc300-small fc300-muted">Im Druckfenster kannst du „Als PDF sichern“ auswählen. Nicht für jede Fach-Klassen-Kombination gibt es ausreichend geprüfte Fragen.</p>';
}
function refreshWorksheetSubjects(){
 const target=$('#fc300-print-sub'),year=Number($('#fc300-print-grade')?.value);
 if(!target)return;
 const current=target.value;
 const list=getSubjects().filter(s=>lessons().some(l=>l.grade===year&&l.subject===s&&verifiedBank(l.id).length));
 target.replaceChildren(...list.map(name=>{const opt=document.createElement('option');opt.value=name;opt.textContent=name;return opt;}));
 if(list.includes(current))target.value=current;
}
function printWorksheet(){
 const subject=$('#fc300-print-sub')?.value,g=Number($('#fc300-print-grade')?.value),n=Number($('#fc300-print-count')?.value)||10;
 const pool=lessons().filter(l=>l.grade===g&&l.subject===subject).flatMap(l=>verifiedBank(l.id).map(q=>({l,q})));
 if(!pool.length){alert('Für diese Auswahl liegen keine Fragen vor. Bitte ein anderes Fach oder eine andere Klasse wählen.');return;}
 if(pool.length<n)alert('Für diese Auswahl stehen nur '+pool.length+' Fragen bereit. Es wird ein kürzeres Arbeitsblatt erstellt.');
 const shuffled=[...pool];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}const picked=shuffled.slice(0,n);
 const css='body{font:15px/1.5 system-ui;color:#172922;margin:20mm}h1{font-size:25px}h2{font-size:19px}.q{break-inside:avoid;margin:16px 0}.q p{margin:6px 0}.opts{padding-left:20px}.opts li{margin:3px 0}.answer{font-size:13px;color:#405348}.page{break-before:page}@media print{.screen{display:none}}';
 const questions=picked.map(({l,q},i)=>'<div class="q"><b>'+(i+1)+'. '+esc(q.prompt)+'</b><p class="answer">'+esc(l.title)+'</p><ol class="opts" type="A">'+q.options.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ol></div>').join('');
 const solutions=picked.map(({q},i)=>'<div class="q"><b>'+(i+1)+'. '+esc(q.options[q.answer])+'</b><p>'+esc(q.explanation||'Lösung aus dem vorhandenen Fragenkatalog.')+'</p></div>').join('');
 const html='<!doctype html><html lang="de"><head><meta charset="utf-8"><title>FixClever '+esc(subject)+' '+g+'</title><style>'+css+'</style></head><body><h1>FixClever · '+esc(subject)+'</h1><p>Klasse '+g+' · '+picked.length+' Aufgaben · Name: ____________________ Datum: ______________</p>'+questions+'<section class="page"><h2>Lösungsblatt</h2>'+solutions+'</section><button class="screen" onclick="print()">Drucken / Als PDF sichern</button></body></html>';
 const popup=window.open('','_blank');if(!popup){alert('Bitte Pop-up-Fenster für FixClever erlauben. Anschließend erneut auf Arbeitsblatt klicken.');return;}
 popup.document.open();popup.document.write(html);popup.document.close();popup.focus();setTimeout(()=>{try{popup.print()}catch{}},350);
}
function renderStats(){
 const a=attempts().sort((x,y)=>new Date(x.date)-new Date(y.date)),s=results();const groups=new Map();
 for(const item of a){const l=row(item.lessonId);if(!l)continue;const group=groups.get(l.subject)||{correct:0,count:0,errors:0};group.correct+=item.correct;group.count++;group.errors+=10-item.correct;groups.set(l.subject,group);}
 const bars=a.slice(-18).map(x=>'<div title="'+esc(iso(x.date)+' · '+x.correct+'/10')+'" style="height:'+x.correct*10+'%"></div>').join('');
 return '<h3>Lernstatistik und Fehleranalyse</h3><p>Auswertung des aktuell ausgewählten Kinderprofils. Alle Zahlen stammen ausschließlich aus gespeicherten Tests.</p><div class="fc300-grid"><div class="fc300-panel"><h4>Abgeschlossene Tests</h4><div class="fc300-kpi"><strong>'+s.count+'</strong><small>Tests mit zehn Aufgaben</small></div></div><div class="fc300-panel"><h4>Antworten richtig</h4><div class="fc300-kpi"><strong>'+(s.avg===null?'–':s.avg+'%')+'</strong><small>'+s.correct+' von '+s.total+' Fragen</small></div></div></div><h4>Ergebnisse nach Fach</h4><table class="fc300-table"><thead><tr><th>Fach</th><th>Tests</th><th>Richtig</th><th>Fehler</th></tr></thead><tbody>'+([...groups].map(([name,v])=>'<tr><td>'+esc(name)+'</td><td>'+v.count+'</td><td>'+Math.round(v.correct/v.count*10)+'%</td><td>'+v.errors+'</td></tr>').join('')||'<tr><td colspan="4">Noch keine Testdaten vorhanden.</td></tr>')+'</tbody></table><h4>Die letzten '+Math.min(18,a.length)+' Tests</h4><div class="fc300-panel"><div class="fc300-chart-bars" aria-label="Richtige Antworten der letzten Tests">'+bars+'</div><p class="fc300-small fc300-muted">Jede Säule entspricht einem Test. 100 % bedeutet zehn richtige Antworten.</p></div><p class="fc300-small">Lernnoten sind Übungswerte und ersetzen keine Schulnoten.</p>';
}
function renderCurriculum(){
 const list=lessons(),subjects=getSubjects(),byGrade=Array.from({length:10},(_,i)=>{
 const g=i+1;return{g,subCount:new Set(list.filter(l=>l.grade===g).map(l=>l.subject)).size,count:list.filter(l=>l.grade===g).length};});
 return '<h3>Lehrplan und Inhalte – Klassen 1 bis 10</h3><div class="fc300-panel" role="alert"><strong>Prüfstatus: noch keine amtlich bestätigte Vollständigkeit.</strong><p>Die folgende Übersicht zählt vorhandene Lerninhalte. Sie bescheinigt ausdrücklich keine Übereinstimmung sämtlicher Kompetenzen mit den Lehrplänen von Nordrhein-Westfalen oder den schulinternen Plänen der Gesamtschule Kierspe.</p></div><p>Aktuell: '+list.length+' registrierte Lerninhalte in '+subjects.length+' Fachbereichen.</p><table class="fc300-table"><thead><tr><th>Klasse</th><th>Fächer mit Inhalten</th><th>Themen</th></tr></thead><tbody>'+byGrade.map(r=>'<tr><td>'+r.g+'</td><td>'+r.subCount+'</td><td>'+r.count+'</td></tr>').join('')+'</tbody></table><p>Offizielle Quellen:</p><p><a href="https://lehrplannavigator.nrw.de/" target="_blank" rel="noopener noreferrer">Lehrplannavigator NRW – alle Lehrpläne ↗</a></p><p><a href="https://lehrplannavigator.nrw.de/sekundarstufe-i/kernlehrplaene-fuer-die-gesamtschule" target="_blank" rel="noopener noreferrer">Kernlehrpläne Gesamtschule NRW ↗</a></p><p class="fc300-small">Für eine amtlich genaue Zuordnung sind fachbezogene Lehrpläne und schulinterne Unterrichtsvorgaben einzeln zu prüfen.</p>';
}
function renderParents(){const p=profile();return '<h3>Elternbereich und Wochenziel</h3><p>Gemeinsamer Überblick über Lernzeit und Fortschritt. Der Bereich ist nicht passwortgeschützt.</p><label class="fc300-field">Ziel: Tests pro Woche<input type="number" id="fc300-goal" min="1" max="35" value="'+bounded(cfg.weeklyGoal,1,35)+'"></label><button class="fc300-button primary" data-fc300="save-goal">Wochenziel speichern</button><p>Diese Woche: '+weekCount()+' Test(s) von '+bounded(cfg.weeklyGoal,1,35)+'.</p><h4>Profile auf diesem Gerät</h4><table class="fc300-table"><thead><tr><th>Name</th><th>Klasse</th><th>Tests</th></tr></thead><tbody>'+profiles().map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+x.grade+'</td><td>'+x.attempts.length+'</td></tr>').join('')+'</tbody></table>'+(p?'<p class="fc300-small">Aktuelles Profil: '+esc(p.name)+'</p>':'<p>Es gibt noch kein Kinderprofil.</p>')+'<p class="fc300-small">Profile enthalten personenbezogene Informationen und sind für Personen mit Zugriff auf dieses Gerät sichtbar. Es gibt keinen Server-Login.</p>';
}
function voices(){try{return speechSynthesis.getVoices().filter(v=>v.lang.toLocaleLowerCase().startsWith('de'))}catch{return[]}}
let voiceState=null;
function stopVoice(){try{speechSynthesis.cancel();}catch{} voiceState=null;}
function speak(text,lang='de-DE'){
 try{if(!('speechSynthesis'in window))throw Error('Sprachausgabe wird auf diesem Gerät nicht unterstützt.');stopVoice();const message=new SpeechSynthesisUtterance(text);message.lang=lang;message.rate=bounded(cfg.rate,.65,1.35)||.88;message.pitch=bounded(cfg.pitch,.7,1.3)||1;const v=voices().find(x=>x.voiceURI===cfg.voice);if(v&&lang==='de-DE')message.voice=v;voiceState=message;message.onerror=e=>reportError('Vorlesen',e.error||'Abbruch');speechSynthesis.speak(message);}catch(e){reportError('Vorlesen',e);alert(String(e.message||e));}
}
function renderVoice(){return '<h3>Vorlesen mit Geräte-Stimmen</h3><p>Du kannst Stimme, Tempo und Tonhöhe anpassen. Die Qualität hängt von den auf iPhone, Android oder Computer vorhandenen Systemstimmen ab; eine menschliche Stimme ist nicht garantiert.</p><label class="fc300-field">Deutsche Stimme<select id="fc300-voice"><option value="">Automatisch auswählen</option>'+voices().map(v=>'<option value="'+esc(v.voiceURI)+'" '+(cfg.voice===v.voiceURI?'selected':'')+'>'+esc(v.name)+' · '+esc(v.lang)+'</option>').join('')+'</select></label><div class="fc300-grid"><label class="fc300-field">Lesetempo (0,65–1,35)<input type="range" min="0.65" max="1.35" step="0.05" id="fc300-rate" value="'+bounded(cfg.rate,.65,1.35)+'"></label><label class="fc300-field">Tonhöhe (0,7–1,3)<input type="range" min="0.7" max="1.3" step="0.05" id="fc300-pitch" value="'+bounded(cfg.pitch,.7,1.3)+'"></label></div><div class="fc300-hub-actions"><button class="fc300-button primary" data-fc300="voice-test">Stimme testen</button><button class="fc300-button" data-fc300="voice-current">Aktuelle Erklärung vorlesen</button><button class="fc300-button" data-fc300="voice-stop">Stopp</button></div><p class="fc300-small fc300-muted">Vorlesen kann je nach installierter Stimme eine Internetverbindung benötigen.</p>';
}
const localKeys=()=>{const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('fixclever'))out.push(k);}}catch{}return out;};
function download(filename,text,mime='application/json'){
 const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function backupAll(){
 const values={};for(const k of localKeys())values[k]=safeGet(k);
 const payload={format:'FixClever-v3-backup',createdAt:new Date().toISOString(),appVersion:VERSION,items:values};
 download('FixClever_Sicherung_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(payload,null,2));
}
async function restoreAll(file){
 if(!file||file.size>7*1024*1024){alert('Bitte eine FixClever-Sicherung mit maximal 7 MB auswählen.');return;}
 try{
  const data=JSON.parse(await file.text());
  if(data.format!=='FixClever-v3-backup'||!data.items||typeof data.items!=='object'||Array.isArray(data.items))throw Error('Dateiformat ist ungültig');
  const entries=Object.entries(data.items);
  if(entries.length>100||entries.some(([k,v])=>!k.startsWith('fixclever')||typeof v!=='string'||v.length>6*1024*1024))throw Error('Ungültige Einträge in der Sicherung');
  if(!confirm('Bestehende lokale FixClever-Daten können durch diese Sicherung überschrieben werden. Vorher eine aktuelle Sicherung herunterladen. Möchtest du fortfahren?'))return;
  const previous=new Map(entries.map(([k])=>[k,safeGet(k)]));
  try{for(const [k,v] of entries){if(!safePut(k,v))throw Error('Browserspeicher konnte nicht beschrieben werden');}}
  catch(err){for(const [k,v] of previous){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch{}}throw err;}
  alert('Sicherung übernommen. Die App wird neu geladen.');location.reload();
 }catch(e){reportError('Sicherung wiederherstellen',e);alert('Sicherung nicht importiert: '+e.message);}
}
function renderBackup(){return '<h3>Datensicherung und Wiederherstellung</h3><p>Sichere alle lokalen FixClever-Daten, darunter Profile, Testergebnisse, Einstellungen und Lernmarkierungen. Es erfolgt kein Upload an einen Server.</p><button class="fc300-button primary" data-fc300="export-all">Komplette Sicherung herunterladen</button><label class="fc300-field">Vorhandene Sicherung importieren<input type="file" id="fc300-import" accept="application/json,.json"></label><p class="fc300-small">Beim Import wirst du vor einem möglichen Überschreiben gefragt. Sichere vor jedem größeren Update deine Daten.</p><div class="fc300-panel">Lokale FixClever-Datenbereiche: '+localKeys().length+' · Kinderprofile: '+profiles().length+'</div>';
}
function runAudit(){
 const l=lessons(),q=banks(),ids=new Set(),problems=[],knownSubjects=new Set(getSubjects());let banksCount=0,questionCount=0;
 for(const lesson of l){if(!lesson||!lesson.id){problems.push('Lerninhalt ohne ID');continue;}if(ids.has(lesson.id))problems.push('Doppelte Lektion: '+lesson.id);ids.add(lesson.id);if(!lesson.title||!Array.isArray(lesson.explain)||!lesson.explain.length)problems.push('Unvollständige Erklärung: '+lesson.id);if(!knownSubjects.has(lesson.subject))problems.push('Fachname unbekannt: '+lesson.id);}
 for(const [id,qs] of Object.entries(q)){banksCount++;if(!ids.has(id))problems.push('Fragen ohne Lektion: '+id);if(!Array.isArray(qs)||qs.length!==10)problems.push('Test hat nicht zehn Fragen: '+id);if(!Array.isArray(qs))continue;const used=new Set();for(const item of qs){questionCount++;if(!isQuestionOK(item))problems.push('Ungültige Antwort: '+id+'/'+item?.id);if(item?.id&&used.has(item.id))problems.push('Doppelte Frage: '+id+'/'+item.id);used.add(item?.id);}}
 for(const id of ids){if(!Object.hasOwn(q,id))problems.push('Kein Zehn-Aufgaben-Test: '+id);}
 const result={version:VERSION,date:new Date().toISOString(),lessons:l.length,subjects:getSubjects().length,questionBanks:banksCount,questions:questionCount,problems:problems.length,examples:problems.slice(0,60),boot:window.FC233_BOOT?{ready:window.FC233_BOOT.ready,errors:window.FC233_BOOT.errors}:null,offlineSupported:'serviceWorker'in navigator,connection:navigator.onLine,errorLog:JSON.parse(safeGet(LOG)||'[]').slice(-10)};
 lastDiagnostic=result;return result;
}
function renderDiagnostics(){const r=lastDiagnostic||runAudit();return '<h3>Technische Selbstdiagnose</h3><p>Prüft Datenstruktur, Fragenanzahl, bekannte Fehler und den Ladezustand der App. Die fachliche Richtigkeit aller Schulaufgaben wird dadurch nicht bestätigt.</p><div class="fc300-grid"><div class="fc300-panel"><b>Lerninhalte</b><p>'+r.lessons+'</p></div><div class="fc300-panel"><b>Fragen</b><p>'+r.questions+'</p></div><div class="fc300-panel"><b>Fächer</b><p>'+r.subjects+'</p></div><div class="fc300-panel"><b>Auffälligkeiten</b><p>'+r.problems+'</p></div></div>'+(r.examples.length?'<div class="fc300-panel" role="alert"><h4>Erkannte Probleme</h4><ol>'+r.examples.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>':'<p class="fc300-result">Keine strukturellen Fehler im geprüften Datenbestand erkannt.</p>')+'<p>Startstatus: '+(r.boot?.ready?'bereit':'noch nicht vollständig bestätigt')+'</p><div class="fc300-hub-actions"><button class="fc300-button" data-fc300="run-audit">Erneut prüfen</button><button class="fc300-button primary" data-fc300="export-audit">Bericht herunterladen</button><button class="fc300-button" data-fc300="repair">Cache-Reparatur öffnen</button></div>';
}
async function checkUpdate(){
 const status=$('#fc-update-message');if(status)status.textContent='Neue Version wird geprüft …';
 if(navigator.onLine===false){if(status)status.textContent='Zur Update-Prüfung ist Internet nötig.';return;}
 try{const ctl=new AbortController(),id=setTimeout(()=>ctl.abort(),12000);let res;try{res=await fetch('./version.json?check='+Date.now(),{cache:'no-store',signal:ctl.signal});}finally{clearTimeout(id);}if(!res.ok)throw Error('HTTP '+res.status);
 const data=await res.json(),remote=String(data.version||'');if(!/^\d+\.\d+\.\d+$/.test(remote))throw Error('Versionsdatei ist ungültig');
 const v=s=>s.split('.').map(Number);const A=v(remote),B=v(VERSION);const newer=A.some((n,i)=>n!==B[i]&&A.slice(0,i).every((m,j)=>m===B[j])&&n>B[i]);
 if(status)status.textContent=newer?'Neue Version '+remote+' verfügbar.':'Du verwendest FixClever '+VERSION+'.';
 if(newer){const url=new URL('./repair.html',location.href);if(confirm('Update '+remote+' gefunden. Möchtest du den Cache auffrischen?'))location.assign(url.href);}
 }catch(e){if(status)status.textContent='Update-Prüfung derzeit nicht möglich: '+e.message;reportError('Updateprüfung',e);}
}
function enhancedExamples(){
 const root=$('#reader');if(!root||root.hidden||!state?.lesson)return;const l=state.lesson;const container=root.querySelector('.reader-body')||root;
 let holder=container.querySelector('#fc300-worked-examples');if(!holder){holder=document.createElement('section');holder.id='fc300-worked-examples';holder.className='fc300-reader-extra';const existing=container.querySelector('.example-box');existing?.after(holder);if(!existing)container.append(holder);}
 const provided=[...(Array.isArray(l.examples)?l.examples:[]),l.example].filter(x=>typeof x==='string'&&x.trim());const seen=new Set(),examples=[];
 for(const e of provided){const k=norm(e);if(!seen.has(k)){examples.push({title:'Beispiel aus der Erklärung',text:e});seen.add(k);}}
 const bank=verifiedBank(l.id);for(const q of bank){if(examples.length>=5)break;const detail=q.explanation||'Überprüfe den Lösungsweg anhand der Erklärung.';const text=q.prompt+' Richtige Antwort: '+q.options[q.answer]+'. '+detail;const k=norm(q.prompt);if(!seen.has(k)){examples.push({title:'Gelöstes Übungsbeispiel',text});seen.add(k);}}
 holder.innerHTML='<h3>Beispiele zum Nachvollziehen</h3><p>Konkrete Beispiele aus der Erklärung und den vorhandenen Testfragen. Die Lösungen werden zum Nachlernen sichtbar gemacht.</p><ol>'+examples.slice(0,5).map(x=>'<li><strong>'+esc(x.title)+'</strong><p>'+esc(x.text)+'</p></li>').join('')+'</ol>'+(examples.length<5?'<p class="fc300-alert">Für dieses Thema sind bisher nur '+examples.length+' geeignete Beispiele verfügbar. Weitere fachliche Beispiele müssen ergänzt werden.</p>':'')+'<div class="fc300-voicebar"><button class="fc300-button" data-fc300="read-lesson">Erklärung vorlesen</button><button class="fc300-button" data-fc300="read-stop">Vorlesen stoppen</button></div>';
}
function handleChange(ev){const id=ev.target?.id;if(id==='fc300-mode'){trainerMode=ev.target.value;taskNum=0;task=generateTask(trainerMode);render();}
 else if(id==='fc300-print-grade'){refreshWorksheetSubjects();}
 else if(id==='fc300-import'){restoreAll(ev.target.files?.[0]);ev.target.value='';}
 else if(id==='fc300-voice'){cfg.voice=ev.target.value;saveCfg();}
 else if(id==='fc300-rate'){cfg.rate=bounded(ev.target.value,.65,1.35);saveCfg();}
 else if(id==='fc300-pitch'){cfg.pitch=bounded(ev.target.value,.7,1.3);saveCfg();}
}
function handleClick(ev){
 const b=ev.target.closest('[data-fc300],[data-fc300-tab],[data-fc300-lesson],[data-fc300-note]');if(!b)return;
 try{
 if(b.dataset.fc300Tab){activeTab=b.dataset.fc300Tab;render();return;}
 if(b.dataset.fc300Lesson){openLesson300(b.dataset.fc300Lesson);return;}
 if(b.dataset.fc300Note!==undefined){playNote(bounded(b.dataset.fc300Note,0,musicNotes.length-1));return;}
 switch(b.dataset.fc300){
 case'open':open(b.dataset.tab||'plan');break;
 case'close':ui.dialog.close();stopVoice();break;
 case'check-task':checkTask();break;
 case'play-question-tone':if(task?.midiIndex!==undefined)playNote(task.midiIndex);break;
 case'next-task':taskNum++;task=generateTask(trainerMode);render();break;
 case'print':printWorksheet();break;
 case'save-goal':cfg.weeklyGoal=bounded($('#fc300-goal')?.value||5,1,35);saveCfg();render();dashboard();break;
 case'voice-test':speak('Hallo! Hier ist FixClever. Ich erkläre dir deine Aufgaben Schritt für Schritt.');break;
 case'voice-current':case'read-lesson':if(state?.lesson)speak([state.lesson.title,...(state.lesson.explain||[]),state.lesson.example||''].join('. '));else alert('Öffne zuerst ein Lernthema.');break;
 case'voice-stop':case'read-stop':stopVoice();break;
 case'export-all':backupAll();break;
 case'offline-prepare':if('serviceWorker'in navigator){navigator.serviceWorker.ready.then(r=>{(r.active||r.waiting)?.postMessage({type:'FC_PREPARE_OFFLINE'});alert('Offline-Vorbereitung angestoßen. Der Status wird auf der Startseite angezeigt.');}).catch(e=>reportError('Offline',e));}else alert('Offline-Speicherung wird von diesem Browser nicht unterstützt.');break;
 case'run-audit':lastDiagnostic=runAudit();render();break;
 case'export-audit':download('FixClever_Diagnose_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(runAudit(),null,2));break;
 case'repair':location.assign('./repair.html');break;
 }
 }catch(e){reportError('Aktion '+(b.dataset.fc300||''),e);alert('Die Aktion konnte nicht ausgeführt werden. Die Diagnose enthält Details.');}
}
function install(){
 if(installed||typeof LESSONS==='undefined'||typeof QUESTIONS==='undefined'||typeof renderHome!=='function'||!$('#overview'))return false;
 if(window.FC233_BOOT&&!window.FC233_BOOT.ready)return false;
 installed=true;addStyles();updateVersion();createUI();
 const oldHome=renderHome;
 renderHome=function(){const value=oldHome.apply(this,arguments);dashboard();updateVersion();return value;};
 const oldReader=renderReader;
 renderReader=function(){const value=oldReader.apply(this,arguments);enhancedExamples();return value;};
 const oldResult=typeof showResult==='function'?showResult:null;
 if(oldResult)showResult=function(){const value=oldResult.apply(this,arguments);dashboard();return value;};
 dashboard(); // Die umfangreiche Datensatzdiagnose nur auf Anforderung starten, damit der Erststart nicht blockiert.
 window.FixClever300={version:VERSION,diagnose:runAudit,open,backup:backupAll,stopVoice};
 return true;
}
// Im alten Loader laufen die schweren Inhalte und zusätzliche Module nacheinander.
// Erst nach erfolgreichem Gesamtstart einhängen; sonst entstehen verfrühte DOM-Zugriffe.
let checks=0;function wait(){if(install())return;if(++checks<=600)setTimeout(wait,500);else reportError('Start','Das Hauptprogramm wurde nicht innerhalb von 5 Minuten bereit.');}
wait();
})();
