/* FixClever 2.3.1 – lokal zwischengespeicherte Programmdatei; keine Netzwerk-Abhaengigkeiten. */

/* Lesefreundliche Darstellung sämtlicher fünf Beispiele. */
(()=>{
 const previous=renderReader;
 renderReader=function(){
  previous();
  const container=document.querySelector('#reader .example-box');
  if(!container||!state.lesson)return;
  container.classList.add('fc15-examples');
  const h=container.querySelector('h3');
  if(h)h.textContent='Fünf Beispiele zum Nachvollziehen';
  const items=state.lesson.examples||[];
  const list=document.createElement('ol');
  for(const example of items.slice(0,5)){
   const li=document.createElement('li');li.textContent=example;list.appendChild(li);
  }
  container.replaceChildren(...(h?[h]:[]),list);
 };
})();

;

/* FixClever 2.3.1: update check accessible in all school grades. */
(()=>{
  'use strict';
  const meta=document.querySelector('meta[name="fixclever-version"]');
  const current=meta?.content||'2.3.1';
  const currentText=document.getElementById('fc-current-version');
  const status=document.getElementById('fc-update-message');
  const check=document.getElementById('fc-update-check');
  const open=document.getElementById('fc-update-open');
  const aside=document.querySelector('.version');
  if(currentText)currentText.textContent='FixClever · Version '+current;
  if(aside)aside.textContent='Version '+current+' · '+LESSONS.length+' Lernthemen';
  if(!check||!open||!status)return;
  let pending=null;
  function compare(a,b){
    const A=a.split('.').map(Number),B=b.split('.').map(Number);
    for(let i=0;i<3;i++){if(A[i]!==B[i])return A[i]-B[i];}
    return 0;
  }
  check.addEventListener('click',async()=>{
    check.disabled=true;
    check.textContent='Prüfe …';
    open.hidden=true;pending=null;
    status.textContent='Prüfe veröffentlichte Version …';
    try{
      const address=new URL('./index.html',document.baseURI);
      address.searchParams.set('fc-update-check',String(Date.now()));
      const controller=typeof AbortController==='function'?new AbortController():null;
      const response=await fetch(address.href,{cache:'no-store',signal:controller?.signal});
      if(!response.ok)throw Error('Die App-Datei ist nicht erreichbar (HTTP '+response.status+').');
      const html=await response.text();
      const match=html.match(/<meta\s+name=["']fixclever-version["']\s+content=["'](\d+\.\d+\.\d+)["']/i);
      if(!match)throw Error('Die veröffentlichte Version konnte nicht gelesen werden.');
      if(compare(match[1],current)>0){
        pending=match[1];
        status.textContent='Neue Version '+pending+' verfügbar.';
        open.hidden=false;open.textContent='Update '+pending+' öffnen';
      }else if(compare(match[1],current)===0){
        status.textContent='Version '+current+' ist aktuell.';
      }else{
        status.textContent='Du verwendest bereits Version '+current+'.';
      }
    }catch(error){
      status.textContent='Update-Prüfung fehlgeschlagen. Prüfe deine Internetverbindung.';
      console.warn('FixClever Updatecheck',error);
    }finally{
      check.disabled=false;
      check.innerHTML='Update suchen <span aria-hidden="true">↻</span>';
    }
  });
  open.addEventListener('click',()=>{
    if(!pending)return;
    const url=new URL('./index.html',document.baseURI);
    url.searchParams.set('v',pending);
    url.searchParams.set('t',String(Date.now()));
    window.location.assign(url.href);
  });
})();

;

/* Sources refer to official NRW navigator pages; mapping is explicitly not verified for completeness. */
(()=>{
const officialSources=[["Primarstufe","Lehrpläne Primarstufe (Sammelband)","https://lehrplannavigator.nrw.de/system/files/media/document/file/ps_lp_sammelband_2021_08_02.pdf"],["Primarstufe","Deutsch","https://lehrplannavigator.nrw.de/primarstufe-neu/lehrplannavigator-primarstufe-richtlinien-und-lehrplaene/deutsch-primarstufe"],["Primarstufe","Mathematik","https://lehrplannavigator.nrw.de/primarstufe-neu/lehrplannavigator-primarstufe-richtlinien-und-lehrplaene/mathematik"],["Primarstufe","Sachunterricht","https://lehrplannavigator.nrw.de/primarstufe-neu/lehrplannavigator-primarstufe-richtlinien-und-lehrplaene/sachunterricht-primarstufe"],["Gesamtschule 5–10","Deutsch","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/deutsch-neu-ab-20222023-gesamtschule"],["Gesamtschule 5–10","Englisch","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/englisch-neu-ab-20222023-gesamtschule"],["Gesamtschule 5–10","Mathematik","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/mathematik-neu-ab-20222023"],["Gesamtschule 5–10","Gesellschaftslehre","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/gesellschaftslehre-wirtschaft-politik-erdkunde-geschichte-neu-ab"],["Gesamtschule 5–10","Naturwissenschaften","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/naturwissenschaften"],["Gesamtschule 5–10","Informatik 5/6","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/informatik-neu-ab-20212022-gesamtschule"],["Gesamtschule 5–10","Kunst","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/kunst-gesamtschule"],["Gesamtschule 5–10","Musik","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/musik-gesamtschule"],["Gesamtschule 5–10","Sport","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/sport-gesamtschule"],["Gesamtschule 5–10","Praktische Philosophie","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/praktische-philosophie-neu-ab-20242025-gesamtschule"],["Gesamtschule 5–10","Technik","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/technik-neu-ab-20202021-gesamtschule"],["Gesamtschule 5–10","Französisch","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/franzoesisch-neu-ab-20212022-gesamtschule"],["Gesamtschule 5–10","Spanisch","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/spanisch-neu-ab-20212022-gesamtschule"],["Gesamtschule 5–10","Latein","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/latein-neu-ab-20212022-gesamtschule"],["Wahlpflicht","Naturwissenschaften","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/wp-naturwissenschaften-gesamtschule"],["Wahlpflicht","Darstellen und Gestalten","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/wp-darstellen-und-gestalten-gesamtschule"],["Wahlpflicht","Wirtschaft und Arbeitswelt","https://lehrplannavigator.nrw.de/sekundarstufe-i/gesamtschule/wp-wirtschaft-und-arbeitswelt-neu-ab-20222023"],["Schule","Gesamtschule Kierspe – Fächerangebot","https://gesamtschule-kierspe.de/leitsaetze-unserer-schule/abschluesse-der-gesamtschule-kierspe/"]];
const coverageRecords=[{"subject":"Deutsch","grade":3,"area":"Sprache und Sprachgebrauch untersuchen","lesson":"nrw14_1","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Mathe","grade":4,"area":"Zahlen und Operationen","lesson":"nrw14_2","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Englisch","grade":5,"area":"Schreiben und Grammatik","lesson":"nrw14_3","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Politik","grade":6,"area":"Demokratie und Mitbestimmung","lesson":"nrw14_4","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Erdkunde","grade":6,"area":"Klima und Naturräume","lesson":"nrw14_5","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Biologie","grade":7,"area":"Zellbiologie","lesson":"nrw14_6","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Chemie","grade":7,"area":"Stoffe und ihre Eigenschaften","lesson":"nrw14_7","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Physik","grade":8,"area":"Elektrizität","lesson":"nrw14_8","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Informatik","grade":6,"area":"Information und Daten","lesson":"nrw14_9","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Sachunterricht","grade":2,"area":"Natur und Leben","lesson":"nrw14_10","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Gesellschaftslehre","grade":7,"area":"Wirtschaftliches Handeln","lesson":"nrw14_11","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Geschichte","grade":8,"area":"Wandel der Arbeitswelt","lesson":"nrw14_12","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Kunst","grade":5,"area":"Räumliche Gestaltung","lesson":"nrw14_13","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Musik","grade":6,"area":"Musikalische Parameter","lesson":"nrw14_14","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Sport","grade":5,"area":"Gesundheit und Bewegung","lesson":"nrw14_15","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Praktische Philosophie","grade":7,"area":"Argumentieren und Urteilen","lesson":"nrw14_16","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Religion","grade":6,"area":"Religionen und Weltanschauungen","lesson":"nrw14_17","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Technik","grade":8,"area":"Herstellen und Bewerten","lesson":"nrw14_18","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Arbeitslehre","grade":7,"area":"Berufsorientierung","lesson":"nrw14_19","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Wirtschaft","grade":9,"area":"Wirtschaftliches Handeln","lesson":"nrw14_20","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Hauswirtschaft","grade":7,"area":"Ernährung und Gesundheit","lesson":"nrw14_21","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Darstellen und Gestalten","grade":7,"area":"Darstellende Ausdrucksformen","lesson":"nrw14_22","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Französisch","grade":7,"area":"Kommunikation","lesson":"nrw14_23","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Spanisch","grade":8,"area":"Kommunikation","lesson":"nrw14_24","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Latein","grade":8,"area":"Grammatik","lesson":"nrw14_25","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Mathe","grade":7,"area":"Arithmetik/Algebra","lesson":"nrw14_26","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Mathe","grade":9,"area":"Funktionen","lesson":"nrw14_27","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Mathe","grade":10,"area":"Stochastik","lesson":"nrw14_28","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Deutsch","grade":8,"area":"Lesen und Medien","lesson":"nrw14_29","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Englisch","grade":9,"area":"Grammatik und Schreiben","lesson":"nrw14_30","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Sachunterricht","grade":4,"area":"Demokratie und Gesellschaft","lesson":"nrw14_31","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Deutsch","grade":1,"area":"Schriftspracherwerb","lesson":"nrw14_32","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"},{"subject":"Mathe","grade":2,"area":"Größen und Messen","lesson":"nrw14_33","status":"Ausgearbeitet – Zuordnung noch nicht einzeln gegen amtliche Kompetenzformulierungen geprüft"}];
for(const lesson of LESSONS.filter(l=>l.id.startsWith('fc15_')))coverageRecords.push({subject:lesson.subject,grade:lesson.grade,area:lesson.title,lesson:lesson.id,status:'Übungsmaterial – amtliche Kompetenzzuordnung noch zu prüfen'});
const panel=document.getElementById('nrw-curriculum');
const select=document.getElementById('nrw-filter');
const sourceGrid=document.getElementById('nrw-sources');
const records=document.getElementById('nrw-entries');
for(let n=1;n<=10;n++){const o=document.createElement('option');o.value=String(n);o.textContent='Klasse '+n;select.appendChild(o);}
const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function showRecords(){
 const grade=select.value;
 const filtered=coverageRecords.filter(r=>grade==='all'||String(r.grade)===grade);
 records.innerHTML=filtered.map(r=>`<article class="nrw-entry"><strong>${safe(r.subject)} · Klasse ${r.grade}</strong><p>${safe(r.area)}: ${safe(LESSONS.find(l=>l.id===r.lesson)?.title||'')}</p><small>Einheit vorhanden · amtliche Einzelzuordnung offen</small><button type="button" data-nrw-lesson="${safe(r.lesson)}">Lektion öffnen</button></article>`).join('')||'<p>Für diese Klasse sind in diesem Update noch keine neuen Zuordnungsprüfungen erfasst.</p>';
}
sourceGrid.innerHTML=officialSources.map(([group,title,url])=>`<a class="nrw-source" href="${safe(url)}" target="_blank" rel="noopener noreferrer"><strong>${safe(title)} ↗</strong><span>${safe(group)} · Quelle: NRW-Lehrplannavigator bzw. Schule</span></a>`).join('');
document.getElementById('nrw-total').textContent=String(LESSONS.length);
document.getElementById('nrw-new').textContent=String(coverageRecords.length);
select.addEventListener('change',showRecords);
showRecords();
function openCurriculum(){
 if(typeof stopSpeech==='function')stopSpeech();
 state.lesson=null;
 document.getElementById('overview').hidden=true;
 document.getElementById('topics').hidden=true;
 document.getElementById('reader').hidden=true;
 document.getElementById('quiz-area').hidden=true;
 panel.hidden=false;
 document.getElementById('breadcrumb').textContent='NRW-Lehrplan';
 document.title='NRW-Lehrplan · FixClever';
 window.scrollTo({top:0,behavior:'instant'});
 panel.focus({preventScroll:true});
}
for(const id of ['nrw-curriculum-nav','nrw-curriculum-head'])document.getElementById(id)?.addEventListener('click',openCurriculum);
document.getElementById('nrw-curriculum-back').addEventListener('click',()=>{panel.hidden=true;routeHome();});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-nrw-lesson]');if(b){panel.hidden=true;openLesson(b.dataset.nrwLesson);}});
const prevHome=renderHome;renderHome=function(){panel.hidden=true;return prevHome();};
const prevReader=renderReader;renderReader=function(){panel.hidden=true;return prevReader();};
if(typeof prepareView==='function'){const prevPrepare=prepareView;prepareView=function(title){panel.hidden=true;return prevPrepare(title);};}
document.getElementById('nrw-export').addEventListener('click',()=>{
 const rows=[['Fach','Klasse','Kompetenzbereich','Lektionen-ID','Prüfstatus'], ...coverageRecords.map(r=>[r.subject,String(r.grade),r.area,r.lesson,r.status])];
 const csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='FixClever_NRW_Pruefmatrix_2.3.1.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
});
})();

;


/* Lernübersicht auf den Fachkacheln, bestehende Fächer/Verknüpfungen bleiben gleich. */
(()=>{
 const previous=renderHome;
 renderHome=function(){
   previous();
   for(const card of document.querySelectorAll('.subject-card[data-subject]')){
     const sub=card.dataset.subject;
     const classLessons=LESSONS.filter(l=>l.grade===state.grade&&l.subject===sub);
     if(!classLessons.length)continue;
     const done=classLessons.filter(l=>state.read.includes(l.id)).length;
     const label=card.querySelector('small');
     if(label)label.textContent=`${classLessons.length} Themen · ${done} gelesen`;
     card.setAttribute('aria-label',`${sub}: ${classLessons.length} Themen in Klasse ${state.grade}, davon ${done} gelesen`);
   }
 };
 renderHome();
})();


;

/* FixClever 2.3.1: Zweifelhafte Quizfragen lokal markieren. Keine Netzwerkübertragung. */
(()=>{
 'use strict';
 const KEY='fixclever-question-flags-v1';
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.slice(-300):[]}catch{return []}};
 const write=items=>{try{localStorage.setItem(KEY,JSON.stringify(items.slice(-300)));return true}catch{return false}};
 function exportFlags(){const list=read();if(!list.length){alert('Noch keine Fragen markiert.');return;}
  const blob=new Blob([JSON.stringify({app:'FixClever',version:'2.3.1',flags:list},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='FixClever_Fragen_pruefen.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const oldRender=renderQuiz;
 renderQuiz=function(){oldRender();const shell=document.querySelector('#quiz-area .question-box');if(!shell||!quiz||quiz.finished)return;
  const button=document.createElement('button');button.type='button';button.className='fc16-flag';button.textContent='Frage zur Prüfung markieren';
  button.addEventListener('click',()=>{const question=quiz?.questions?.[quiz.index];if(!question)return;
    const flags=read(),key=quiz.lessonId+'|'+question.id;
    if(flags.some(x=>x.key===key)){toast('Diese Frage ist bereits markiert.');return;}
    const item={key,lessonId:quiz.lessonId,questionId:question.id,prompt:question.prompt,date:new Date().toISOString(),note:'Bitte die fachliche Eindeutigkeit der zehn Antworten prüfen.'};
    const success=write([...flags,item]);toast(success?'Frage markiert. Die Meldung bleibt auf diesem Gerät.':'Meldung konnte auf diesem Gerät nicht gespeichert werden.');
  });shell.append(button);
 };
 const exportButton=document.createElement('button');exportButton.type='button';exportButton.className='fc16-export';exportButton.textContent='Markierte Fragen exportieren';
 const footer=document.querySelector('footer');if(footer)footer.append(exportButton);
 exportButton.addEventListener('click',exportFlags);
})();

;

/* FixClever 2.3.1 – Offline-Status only green after the core cache is verified. */
(()=>{
 'use strict';
 const VERSION='2.3.1';
 const status=document.getElementById('fc-offline-status');
 const dot=document.getElementById('fc-offline-dot');
 const button=document.getElementById('fc-offline-action');
 if(!status||!dot||!button)return;
 let registration=null, busy=false;
 const set=(message,state='busy')=>{status.textContent=message;dot.dataset.status=state;};
 function queryServiceWorker(sw){return new Promise((resolve,reject)=>{
   if(!sw){reject(new Error('Kein aktiver Offline-Dienst'));return;}
   const channel=new MessageChannel();
   const timeout=setTimeout(()=>{channel.port1.close();reject(new Error('Offline-Prüfung nicht beantwortet'));},15000);
   channel.port1.onmessage=e=>{clearTimeout(timeout);channel.port1.close();resolve(e.data);};
   try{sw.postMessage({type:'FC_CHECK_OFFLINE'},[channel.port2]);}catch(e){clearTimeout(timeout);reject(e);}
 });}
 async function updateStatus(force=false){
   if(busy)return;busy=true;button.disabled=true;set('Offline-Inhalte werden geprüft …');
   try{
     if(!('serviceWorker' in navigator)){set('Dieser Browser unterstützt das Offline-Speichern nicht.','error');return;}
     if(!window.isSecureContext){set('Offline-Nutzung benötigt HTTPS (GitHub Pages).','error');return;}
     const existing=await navigator.serviceWorker.getRegistration('./');
     registration=(navigator.onLine===false && existing)?existing:
        await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
     if(force&&navigator.onLine!==false)await registration.update();
     const worker=registration.active || (await Promise.race([
       navigator.serviceWorker.ready.then(r=>r.active),
       new Promise((_,reject)=>setTimeout(()=>reject(new Error('Offline-Installation dauert zu lange')),45000))
     ]));
     const reply=await queryServiceWorker(worker);
     if(reply?.version===VERSION&&reply.ready){
       const label=navigator.onLine===false?'Offline-Modus aktiv':'Offline bereit';
       set(`${label} · ${reply.count} App-Dateien gespeichert. Ohne Internet nutzbar.`,'ready');
     }else if(reply?.version!==VERSION){
       set('Neuer Offline-Speicher noch nicht aktiviert. Bitte die Seite neu öffnen.','error');
     }else{
       set(`Offline-Speicherung unvollständig (${reply?.missing?.length??'?'} Dateien fehlen). Erneut prüfen.`, 'error');
     }
   }catch(e){
     set('Offline-Speicherung fehlgeschlagen. Einmal online erneut versuchen.','error');
     console.warn('FixClever offline initialization',e);
   }finally{busy=false;button.disabled=false;}
 }
 button.addEventListener('click',()=>updateStatus(true));
 window.addEventListener('online',()=>updateStatus(false));
 window.addEventListener('offline',()=>{if(dot.dataset.status==='ready')set('Offline-Modus aktiv · Inhalte lokal gespeichert.','ready');else set('Keine vollständige Offline-Speicherung bestätigt.','error');});
 navigator.serviceWorker?.addEventListener('controllerchange',()=>updateStatus(false));
 // An offline update check must never claim that an offline-cached page is the latest online version.
 const check=document.getElementById('fc-update-check');
 check?.addEventListener('click',event=>{
   if(navigator.onLine===false){event.stopImmediatePropagation();event.preventDefault();
     const message=document.getElementById('fc-update-message');if(message)message.textContent='Für Updates ist Internet erforderlich.';
   }
 },true);
 window.addEventListener('load',()=>updateStatus(false),{once:true});
})();

;


/* FixClever 2.3.1 – Lernhilfen. Aus bestehenden Themen generierte Struktur und speziell erstellte Darstellungen. */
(()=>{
'use strict';
const KEY='fixclever-learning-aid-v1';
const defaultSettings={mode:'easy',large:false,space:true,line:false};
let settings={...defaultSettings};
try{const a=JSON.parse(localStorage.getItem(KEY));if(a&&typeof a==='object'){
 if(['easy','normal'].includes(a.mode))settings.mode=a.mode;
 for(const k of ['large','space','line'])if(typeof a[k]==='boolean')settings[k]=a[k];
}}catch{}
const keep=()=>{try{localStorage.setItem(KEY,JSON.stringify(settings))}catch{}};
let currentStep=0;
const plain=x=>String(x??'').replace(/\s+/g,' ').trim();
const html=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sentence=x=>{let t=plain(x);return t && !/[.!?…]$/.test(t)?t+'.':t};
const trim=txt=>plain(txt).replace(/[.!?]$/,'');
const splitExample=txt=>{
 txt=plain(txt);
 // Some examples use a colon or dash for the interpretation; do not divide punctuation used in ratios or prose.
 let n=txt.indexOf(': '),length=2;
 if(n<1){n=txt.indexOf(' – ');length=3;}
 if(n<1)return{case:txt,meaning:''};
 return {case:txt.slice(0,n),meaning:txt.slice(n+length)};
};
const studySubjects={
 'Mathe':{ask:'Was ist gegeben? Was soll herauskommen?',steps:['Schreibe die gegebenen Zahlen und Einheiten ordentlich auf.','Wähle die passende Rechenregel. Rechne in kleinen, prüfbaren Schritten.','Kontrolliere durch eine Umkehraufgabe oder einen Überschlag.'],mistake:'Achte auf Vorzeichen, Stellenwerte und Maßeinheiten. Eine Rechnung ist nicht automatisch richtig, nur weil eine Zahl herauskommt.'},
 'Deutsch':{ask:'Was genau verlangt die Aufgabe: erkennen, lesen, erklären oder selbst schreiben?',steps:['Lies den Satz oder Text zunächst vollständig.','Markiere die Wörter oder Textstellen, die für die Aufgabe wichtig sind.','Formuliere die Lösung in deinen eigenen Worten und prüfe sie am Original.'],mistake:'Ein Beispiel ist noch keine allgemeine Regel. Vergleiche die Wörter und den Zusammenhang.'},
 'Englisch':{ask:'Wer macht etwas, was passiert und wann?',steps:['Lies oder höre den ganzen englischen Satz.','Finde die handelnde Person und die passende Verbform.','Vergleiche die englische Form mit der deutschen Bedeutung und übe einen eigenen Satz.'],mistake:'Eine wörtliche Übersetzung kann falsch sein. Prüfe die englische Wortstellung und die Verbendung.'},
 'Sachunterricht':{ask:'Was kann ich in meiner Umgebung beobachten?',steps:['Beobachte zuerst genau, was du sehen oder messen kannst.','Beschreibe den Vorgang mit einfachen Wörtern.','Erkläre, wie das Beispiel zum Thema passt.'],mistake:'Vermutungen und Beobachtungen sind nicht dasselbe. Frage: Was weiß ich wirklich?'},
 'Politik':{ask:'Wer ist betroffen, welche Regeln gelten und wer entscheidet?',steps:['Erkenne die unterschiedlichen Interessen.','Suche nach Rechten, Pflichten und möglichen Entscheidungen.','Begründe deine Meinung und beachte auch andere Sichtweisen.'],mistake:'Eine Meinung und eine überprüfbare Tatsache sind nicht dasselbe.'},
 'Erdkunde':{ask:'Wo findet etwas statt, und warum gerade dort?',steps:['Bestimme den Ort oder die Region.','Nutze eine Karte, Legende oder passende geografische Begriffe.','Erkläre die Ursachen und mögliche Folgen.'],mistake:'Wetter ist das aktuelle Geschehen, Klima beschreibt langfristige Verhältnisse – verwechsle beides nicht.'},
 'Gesellschaftslehre':{ask:'Wie hängen Menschen, Orte und Geschichte zusammen?',steps:['Kläre, um welche Zeit und welchen Ort es geht.','Unterscheide Beobachtungen, Interessen und Veränderungen.','Beschreibe Folgen für verschiedene Gruppen.'],mistake:'Früher und heute sind nicht gleich. Achte auf Zeit und Quelle.'},
 'Geschichte':{ask:'Wann geschah es und woher wissen wir das?',steps:['Ordne Ereignisse zeitlich ein.','Prüfe, was eine historische Quelle zeigt und was offenbleibt.','Erkläre Ursachen und Folgen ohne heutige Vorstellungen ungeprüft zu übertragen.'],mistake:'Eine Quelle erzählt nur einen bestimmten Ausschnitt; sie ist nicht automatisch die ganze Wahrheit.'},
 'Biologie':{ask:'Welches Lebewesen oder Körperteil ist beteiligt?',steps:['Benennen: Was ist zu sehen?','Beschreiben: Welche Aufgabe oder Eigenschaft hat es?','Erklären: Wie hängt das mit dem Lebewesen und der Umwelt zusammen?'],mistake:'Eine Vermutung über die Funktion sollte durch Beobachtungen oder Wissen geprüft werden.'},
 'Chemie':{ask:'Welche Stoffe sind vor und nach dem Vorgang vorhanden?',steps:['Benenne Stoffe und erkennbare Eigenschaften.','Unterscheide Mischen, Trennen und eine chemische Reaktion.','Beschreibe die Veränderung und nutze die passenden Fachbegriffe.'],mistake:'Nicht jede sichtbare Veränderung erzeugt einen neuen Stoff.'},
 'Physik':{ask:'Was lässt sich beobachten oder messen?',steps:['Zeichne bei Bedarf eine einfache Skizze.','Bestimme Größen, Einheiten und Zusammenhänge.','Erkläre das Ergebnis und prüfe, ob es zur Beobachtung passt.'],mistake:'Kraft, Energie und Geschwindigkeit sind unterschiedliche Begriffe.'},
 'Informatik':{ask:'Welche Daten kommen hinein und was soll herauskommen?',steps:['Beschreibe Eingaben, Verarbeitung und Ergebnis.','Ordne die nötigen Schritte in eine klare Reihenfolge.','Teste mit einem einfachen Beispiel und suche mögliche Fehler.'],mistake:'Eine Anweisung muss so eindeutig sein, dass sie ohne Raten ausführbar ist.'},
 'Kunst':{ask:'Was ist im Bild zu sehen und wie wird es gestaltet?',steps:['Beschreibe Formen, Farben, Linien und Anordnung.','Erkenne, mit welchen Mitteln eine Wirkung erzeugt wird.','Probiere die Methode selbst aus und vergleiche die Wirkung.'],mistake:'Beschreiben und Bewerten sind verschiedene Tätigkeiten.'},
 'Musik':{ask:'Was hörst du genau?',steps:['Höre zuerst bewusst auf Tempo und Klang.','Achte auf Rhythmus, Melodie oder Instrumente.','Probiere einen Ausschnitt durch Klatschen, Singen oder Spielen aus.'],mistake:'Puls und Rhythmus können zusammenpassen, sind aber nicht identisch.'},
 'Sport':{ask:'Wie führe ich die Bewegung sicher aus?',steps:['Lies die Sicherheitsregeln.','Zerlege die Bewegung in kleine Schritte.','Übe ruhig, beobachte die Wirkung und verbessere dich schrittweise.'],mistake:'Eine gute Technik ist wichtiger als unnötig viel Tempo oder Kraft.'},
 'Praktische Philosophie':{ask:'Welche Werte stehen sich gegenüber?',steps:['Beschreibe das Problem ohne vorschnelles Urteil.','Sammle verschiedene Gründe und Perspektiven.','Begründe deine Entscheidung und berücksichtige mögliche Folgen.'],mistake:'Ein starkes Gefühl kann ein Grund zum Nachdenken sein, ersetzt aber keine Begründung.'},
 'Religion':{ask:'Was bedeutet die Aussage oder Tradition für die Menschen?',steps:['Lies die Beschreibung sorgfältig.','Unterscheide religiöse Überzeugung und sachliche Beobachtung.','Vergleiche respektvoll und vermeide pauschale Aussagen.'],mistake:'Innerhalb einer Religion können Menschen unterschiedlich denken und handeln.'},
 'Technik':{ask:'Welches Problem soll die technische Lösung lösen?',steps:['Beschreibe die gewünschte Funktion.','Vergleiche Materialien, Maße und Sicherheit.','Zeichne eine Skizze und überprüfe die Lösung.'],mistake:'Schönes Aussehen allein reicht nicht: Eine Konstruktion muss sicher und zweckmäßig sein.'},
 'Arbeitslehre':{ask:'Welche Tätigkeit wird gebraucht und welche Fähigkeiten passen dazu?',steps:['Lies die Aufgabe und ihre Anforderungen.','Verbinde Wissen mit einem Beispiel aus Alltag oder Beruf.','Prüfe Vor- und Nachteile und beschreibe deinen Lösungsweg.'],mistake:'Eine Berufsbeschreibung ist nicht automatisch auf jeden Betrieb übertragbar.'},
 'Wirtschaft':{ask:'Wer entscheidet über Geld, Waren oder Dienstleistungen?',steps:['Erkenne die beteiligten Personen und ihre Ziele.','Unterscheide Kosten, Nutzen und mögliche Risiken.','Vergleiche verschiedene Handlungen, bevor du dich entscheidest.'],mistake:'Ein günstiger Preis ist nicht immer das günstigste Gesamtangebot.'},
 'Hauswirtschaft':{ask:'Was soll gesund, sicher und praktisch erledigt werden?',steps:['Plane Arbeitsschritte und benötigte Materialien.','Achte auf Hygiene, Sicherheit und passende Mengen.','Prüfe das Ergebnis und überlege, was du verbessern kannst.'],mistake:'Eine saubere Oberfläche bedeutet nicht automatisch, dass alle Keime entfernt sind.'},
 'Darstellen und Gestalten':{ask:'Welche Wirkung sollen Stimme, Körper und Raum haben?',steps:['Kläre die Szene und die Rolle.','Übe Mimik, Gestik, Haltung und Sprechweise einzeln.','Spiele die Szene und besprecht anschließend ihre Wirkung.'],mistake:'Laut sprechen bedeutet nicht unbedingt verständlich oder überzeugend spielen.'},
 'Französisch':{ask:'Wer spricht und welche Aussage wird gemacht?',steps:['Finde Subjekt und gebeugtes Verb.','Achte auf Artikel, Geschlecht und Satzstellung.','Sprich den Satz langsam und verändere ein Wort zum Üben.'],mistake:'Deutsche Wortstellung und französische Artikel passen nicht immer genau zusammen.'},
 'Spanisch':{ask:'Welche Person spricht und welche Verbform passt?',steps:['Erkenne das Verb und die Person.','Achte auf Artikel, Adjektive und Satzstellung.','Baue nach dem Muster einen eigenen kurzen Satz.'],mistake:'Eine vertraute Wortendung kann täuschen; prüfe Person, Zahl und Zeitform.'},
 'Latein':{ask:'Welche Endungen zeigen die Aufgaben der Wörter?',steps:['Finde das Prädikat und bestimme die Verbform.','Prüfe Wortendungen und Fälle.','Ordne Satzglieder zu und übersetze danach sinnvoll ins Deutsche.'],mistake:'Übersetze nicht einfach Wort für Wort in derselben Reihenfolge.'}
};
const authored=[
 {sub:'Mathe',keys:['bruch','brüche'],text:'Bei einem Bruch ist das Ganze in gleich große Teile aufgeteilt. Der Nenner unten sagt, wie viele gleich große Teile es insgesamt gibt. Der Zähler oben sagt, wie viele dieser Teile gemeint sind. Wichtig: Vier ungleich große Stücke sind keine vier gleich großen Viertel.',steps:['Sieh dir das ganze Rechteck oder den ganzen Kreis an.','Teile es in gleich große Stücke.','Zähle zuerst alle Stücke für den Nenner und danach die markierten Stücke für den Zähler.'],mistake:'3/4 bedeutet drei von vier gleich großen Teilen. Es bedeutet nicht: 3 durch 4 einzelne Dinge nebeneinander.'},
 {sub:'Mathe',keys:['prozent'],text:'Prozent bedeutet „von hundert“. 25 % sind 25 von 100 gleich großen Teilen, also ein Viertel. Um einen Prozentsatz zu verstehen, frage zuerst, was die 100 % darstellen.',steps:['Finde den Grundwert: Das ist das Ganze mit 100 %.','Bestimme, welchen Anteil du suchst.','Nutze ein Hunderterfeld oder rechne Schritt für Schritt.'],mistake:'25 % von 80 sind nicht 25, sondern 20. Der Grundwert ist entscheidend.'},
 {sub:'Mathe',keys:['addition','addieren','plusrechnen','plusaufgaben'],text:'Beim Addieren legst du Mengen zusammen. Das Pluszeichen + sagt: Eine Menge kommt zu einer anderen dazu. Wenn du mit einer Zahl beginnst, gehst du auf dem Zahlenstrahl nach rechts.',steps:['Beginne mit der ersten Zahl.','Gehe so viele Schritte nach rechts, wie die zweite Zahl zeigt.','Lies die Zahl am Ziel ab und prüfe durch Zurückzählen.'],mistake:'Der Startpunkt zählt nicht als erster zusätzlicher Schritt.'},
 {sub:'Mathe',keys:['subtraktion','subtrahieren','minusrechnen','minusaufgaben'],text:'Beim Subtrahieren nimmst du etwas weg oder suchst den Unterschied zwischen zwei Zahlen. Das Minuszeichen − zeigt: Die Menge wird kleiner. Auf dem Zahlenstrahl gehst du bei positiven ganzen Zahlen nach links.',steps:['Beginne bei der ersten Zahl.','Gehe so viele Schritte nach links, wie du abziehen sollst.','Lies das Ergebnis ab und kontrolliere durch Addition.'],mistake:'Wenn du bei 8 drei Schritte nach links gehst, landest du bei 5 – nicht bei 6.'},
 {sub:'Mathe',keys:['einmaleins','multiplikation','malnehmen'],text:'Multiplizieren bedeutet bei natürlichen Zahlen oft: Du hast mehrere gleich große Gruppen. Drei Gruppen mit je vier Gegenständen sind 4 + 4 + 4 = 12. Das kannst du kurz als 3 · 4 = 12 schreiben.',steps:['Finde die Anzahl der Gruppen.','Zähle, wie viele Elemente in jeder Gruppe sind.','Rechne durch wiederholtes Addieren oder mit einer bekannten Malaufgabe.'],mistake:'Bei gleich großen Gruppen zählt jede Gruppe genau einmal.'},
 {sub:'Mathe',keys:['stellenwert','zehner','einer'],text:'Der Wert einer Ziffer hängt von ihrer Stelle ab. In der Zahl 34 bedeutet die 3 drei Zehner und die 4 vier Einer. Drei Zehner sind dreißig, nicht drei.',steps:['Lies die ganze Zahl langsam.','Zerlege sie in Hunderter, Zehner und Einer.','Setze die Teile wieder zusammen und prüfe die Summe.'],mistake:'Die Ziffer 3 in 34 steht nicht für 3 Einer, sondern für 30.'},
 {sub:'Deutsch',keys:['satzglieder','subjekt','prädikat','satzbau'],text:'Ein Satz besteht aus Wörtern mit unterschiedlichen Aufgaben. Das Subjekt sagt oft, wer oder was etwas tut. Das Prädikat enthält das gebeugte Verb. Andere Satzteile ergänzen die Information.',steps:['Lies den ganzen Satz laut.','Frage „Wer oder was?“ nach dem Subjekt.','Frage „Was tut die Person?“ nach dem Verb und untersuche die übrigen Wörter.'],mistake:'Ein Satzteil kann aus mehreren Wörtern bestehen. Trenne nicht jedes einzelne Wort automatisch ab.'},
 {sub:'Deutsch',keys:['nomen','naming words','namenwörter','hauptwörter'],text:'Nomen sind Wörter für Menschen, Tiere, Dinge und auch Gedanken oder Gefühle. Im Deutschen schreibt man Nomen groß. Häufig passt ein Artikel wie der, die oder das davor.',steps:['Suche Wörter, mit denen du etwas benennen kannst.','Probiere einen Artikel davor: der, die oder das.','Prüfe die Großschreibung im Satz.'],mistake:'Nicht jedes großgeschriebene Wort ist ein Nomen: Auch am Satzanfang schreibt man groß.'},
 {sub:'Deutsch',keys:['adjektiv','eigenschaftswort'],text:'Adjektive beschreiben Eigenschaften: wie etwas aussieht, sich anfühlt oder ist. In „der schnelle Hund“ beschreibt „schnelle“ den Hund. Adjektive helfen, genauer zu erzählen.',steps:['Finde das Wort, das etwas näher beschreibt.','Frage „Wie ist es?“','Probiere einen Vergleich: schnell – schneller – am schnellsten.'],mistake:'Nicht jedes Wort mit -e am Ende ist ein Adjektiv.'},
 {sub:'Englisch',keys:['simple present','he she it'],text:'Das Simple Present beschreibt häufig Gewohnheiten und allgemeine Tatsachen. Bei he, she und it bekommt das Vollverb in bejahten Aussagesätzen oft ein -s, zum Beispiel: She plays.',steps:['Bestimme das Subjekt.','Prüfe, ob es he, she oder it ist.','Bilde die passende Verbform und lies den Satz laut.'],mistake:'Bei Fragen und Verneinungen mit does steht das Vollverb in der Grundform: Does she play?'},
 {sub:'Englisch',keys:['simple past','past tense'],text:'Das Simple Past drückt abgeschlossene Ereignisse in der Vergangenheit aus. Regelmäßige Verben bilden die Vergangenheit meist mit -ed. Manche wichtige Verben verändern sich unregelmäßig: go – went.',steps:['Erkenne, dass die Handlung vergangen und abgeschlossen ist.','Prüfe, ob das Verb regelmäßig oder unregelmäßig ist.','Nutze die passende Form: I played. / I went.'],mistake:'Mit did in Fragen und Verneinungen verwendest du das Vollverb in der Grundform: Did you go?'},
 {sub:'Erdkunde',keys:['klima','wetter'],text:'Wetter ist das, was gerade draußen passiert, zum Beispiel Regen oder Sonnenschein. Klima beschreibt dagegen typische Wetterverhältnisse einer Region über viele Jahre. Eine einzelne kalte Woche zeigt noch keinen Klimatrend.',steps:['Prüfe, ob von heute oder von vielen Jahren die Rede ist.','Suche eine konkrete Wetterbeobachtung oder einen langfristigen Durchschnitt.','Entscheide, ob Wetter oder Klima gemeint ist.'],mistake:'Ein sehr kalter Tag widerlegt nicht, dass sich das Klima langfristig erwärmt.'},
 {sub:'Informatik',keys:['algorithm'],text:'Ein Algorithmus ist eine klare Folge von Anweisungen. Die Schritte müssen in einer Reihenfolge stehen, die ein Mensch oder Computer eindeutig ausführen kann. Ein Rezept ist ein gutes Alltagsbeispiel.',steps:['Beschreibe das Ziel.','Schreibe jede Anweisung kurz und eindeutig auf.','Prüfe die Reihenfolge mit einem konkreten Testfall.'],mistake:'„Mach es richtig“ ist zu ungenau. Eine brauchbare Anweisung sagt, was genau zu tun ist.'},
 {sub:'Physik',keys:['stromkreis','elektrisch'],text:'Damit eine Lampe mit einer Batterie leuchtet, müssen die Bauteile einen geschlossenen elektrischen Stromkreis bilden. Öffnet ein Schalter den Stromkreis, kann kein dauerhafter Strom fließen.',steps:['Suche Batterie, Leitungen, Schalter und Lampe.','Zeichne die Verbindungen und prüfe, ob der Weg geschlossen ist.','Überlege, was geschieht, wenn du den Schalter öffnest.'],mistake:'Eine Batterie neben einer Lampe reicht nicht. Die Anschlüsse müssen richtig verbunden sein.'},
 {sub:'Biologie',keys:['zelle','zellen'],text:'Zellen sind die kleinsten lebenden Baueinheiten von Lebewesen. Zellen besitzen unterschiedliche Bestandteile mit Aufgaben. In Pflanzenzellen kann man unter anderem eine Zellwand finden; viele Pflanzenzellen enthalten auch Chloroplasten.',steps:['Benennen: Welcher Zellbestandteil ist gemeint?','Zuordnen: Was macht dieser Bestandteil?','Vergleichen: Worin unterscheiden sich pflanzliche und tierische Zellen?'],mistake:'Nicht jede Pflanzenzelle enthält Chloroplasten, beispielsweise die meisten Wurzelzellen nicht.'},
 {sub:'Geschichte',keys:['quelle','quellen'],text:'Eine historische Quelle ist eine Spur aus der untersuchten Vergangenheit, zum Beispiel ein Brief oder ein Gegenstand. Sie zeigt, was jemand damals hinterlassen hat. Um etwas daraus zu lernen, musst du fragen, wer sie erstellt hat und mit welchem Ziel.',steps:['Prüfe, aus welcher Zeit die Quelle stammt.','Frage nach der Urheberin oder dem Urheber.','Trenne, was die Quelle zeigt, von deiner eigenen Deutung.'],mistake:'Eine Quelle kann einseitig sein. Deshalb sind Vergleiche mit weiteren Quellen wichtig.'},
 {sub:'Chemie',keys:['gemisch','trennen','stoff'],text:'Ein Gemisch enthält mehrere Stoffe. Manche Gemische kannst du trennen, indem du Eigenschaften der Bestandteile ausnutzt. Bei Sand und Wasser hilft zum Beispiel Filtern, bei Salzwasser hingegen nicht.',steps:['Bestimme die Bestandteile des Gemisches.','Überlege, wie sich die Eigenschaften unterscheiden.','Wähle das passende Trennverfahren und erkläre warum.'],mistake:'Ein Filter trennt gelöstes Salz nicht einfach aus Salzwasser.'}
];
const visualType=l=>{
 if(l.subject==='Mathe'){
 const t=l.title.toLowerCase();
 if(/bruch|brüche/.test(t))return 'fraction';
 if(/prozent/.test(t))return 'percent';
 if(/addition|addier|plus|subtraktion|subtrahier|minus|zahlenstrahl|zahlengerade/.test(t))return 'number';
 if(/einmaleins|multiplikation|malnehmen/.test(t))return 'mult';
 }
 if(['Deutsch','Englisch','Französisch','Spanisch','Latein'].includes(l.subject)&&/satz|grammatik|subjekt|prädikat|verb|wortart|sprache/i.test(l.title))return 'sentence';
 return '';
};
function visual(l){
 const type=visualType(l);if(!type)return '';
 let title='',content='',description='';
 if(type==='fraction'){
 // Use the fraction from THIS lesson's actual example so that words and picture agree.
 const raw=[...(l.examples||[]),l.example||''].join(' ');
 const found=raw.match(/(?:^|[^0-9])(\d{1,2})\s*[\/⁄]\s*(\d{1,2})(?=[^0-9]|$)/);
 let num=3,den=4;
 if(found){const a=Number(found[1]),b=Number(found[2]);if(b>=2&&b<=16&&a>=0&&a<=b){num=a;den=b;}}
 title='Bruch mit gleich großen Teilen';content=`<div class="fc-fraction" role="img" aria-label="${den} gleich große Felder; ${num} davon sind markiert">`+Array.from({length:den},(_,i)=>`<div class="${i<num?'fc-on':''}"></div>`).join('')+'</div>';
 description=`${num} von ${den} gleich großen Feldern sind markiert. Das ist ${num}/${den}. Oben steht ${num} (Zähler); unten steht ${den} (Nenner).${found?' Das Bild zeigt den Bruch aus einem der Beispiele.':' Das ist ein zusätzliches Anschauungsbeispiel.'}`;
 }else if(type==='percent'){
 title='Prozentfeld als Anschauung';content='<div class="fc-grid-cells" role="img" aria-label="100 Felder, davon sind 25 markiert">'+Array.from({length:100},(_,i)=>`<span class="${i<25?'fc-on':''}"></span>`).join('')+'</div>';
 description='100 kleine Felder stellen 100 % dar. Hier sind 25 Felder markiert – das entspricht 25 %. Das ist ein zusätzliches Beispiel, nicht die Lösung jeder Prozentaufgabe.';
 }else if(type==='number'){
 const minus=/subtraktion|subtrahier|minus/.test(l.title.toLowerCase());
 const mark=minus?5:7;
 title='Zahlenstrahl als zusätzliche Lernhilfe';content=`<div class="fc-numberline" role="img" aria-label="Zahlenstrahl von null bis zehn mit der Zahl ${mark} markiert">`+Array.from({length:11},(_,i)=>`<span class="${i===mark?'fc-mark':''}">${i}</span>`).join('')+'</div>';
 description=minus?'Zusatzbeispiel: Starte bei 8. Gehe für 8 − 3 drei Schritte nach links. Du landest bei 5.':'Zusatzbeispiel: Starte bei 4. Gehe für 4 + 3 drei Schritte nach rechts. Du landest bei 7.';
 }else if(type==='mult'){
 title='Malaufgabe als Punktefeld';content='<div class="fc-grid-cells" style="grid-template-columns:repeat(4,1fr);max-width:200px" role="img" aria-label="Drei Reihen mit jeweils vier markierten Kästchen">'+Array.from({length:12},()=>'<span class="fc-on"></span>').join('')+'</div>';
 description='Drei Reihen mit je vier Kästchen sind 3 · 4 = 12. Das Bild zeigt, warum die Malaufgabe dieselbe Menge wie 4 + 4 + 4 beschreibt.';
 }else if(type==='sentence'){
 title='Satzteile mit Farben und Aufgaben';
 const lang=l.subject;
 const words=lang==='Englisch'?['She','reads','a book.']:lang==='Französisch'?['Je','lis','un livre.']:lang==='Spanisch'?['Yo','leo','un libro.']:lang==='Latein'?['Puella','legit','librum.']:['Das Kind','liest','ein Buch.'];
 content='<div class="fc-colored-sentence">'+words.map((w,i)=>`<span>${html(w)}<small style="display:block;font-size:.68em">${['Wer?','Was tut die Person?','Was?'][i]}</small></span>`).join('')+'</div>';
 description='Blau zeigt, wer handelt. Grün zeigt die Tätigkeit. Gelb zeigt eine Ergänzung. Wichtig: Diese Farbanordnung ist ein Anschauungsbeispiel und passt nicht unverändert zu allen Satzarten.';
 }
 return `<div class="fc-visual"><h4>Visuelle Hilfe: ${html(title)}</h4>${content}<p>${html(description)}</p></div>`;
}
const guidesFor=l=>{
 const strategy=studySubjects[l.subject]||studySubjects.Sachunterricht;
 const title=plain(l.title);
 const low=title.toLocaleLowerCase('de');
 const custom=authored.find(x=>x.sub===l.subject&&x.keys.some(k=>low.includes(k)));
 const chunks=(Array.isArray(l.explain)?l.explain:[]).map(plain).filter(Boolean);
 const examples=(Array.isArray(l.examples)&&l.examples.length?l.examples:[l.example]).map(plain).filter(Boolean);
 const tip=plain(l.tip);
 let intro=custom?.text||chunks[0]||`Hier lernst du das Thema ${title}.`;
 // Never present arbitrary text as an official curriculum requirement.
 const words=chunks.slice(1).filter(x=>x!==intro);
 const first=splitExample(examples[0]||l.example||'');
 const second=splitExample(examples[1]||examples[0]||'');
 const allSteps=custom?.steps||strategy.steps;
 const panels=[];
 panels.push({tone:'blue',heading:'1. Worum geht es?',content:`<p>${html(sentence(intro))}</p><p>Du musst nicht alles sofort auswendig wissen. Lies zuerst den Grundgedanken. Danach schauen wir uns die Wörter, ein Beispiel und den Lösungsweg einzeln an. Wenn du die Leselinie einschaltest, kannst du auf einen Absatz tippen, um ihn zu markieren.</p>`});
 const terms=words.slice(0,3).map(x=>`<p class="fc-studyline">${html(sentence(x))}</p>`).join('')||`<p>Das wichtigste Wort in dieser Lektion ist <strong>${html(title)}</strong>. Wiederhole den Begriff langsam und versuche, ihn anhand der Beispiele zu erklären.</p>`;
 panels.push({tone:'blue',heading:'2. Wörter und Regeln verstehen',content:`${terms}<p class="fc-tiny-note">Tipp: Wenn du ein Wort nicht verstehst, lies es einzeln und schaue dir erst danach das Beispiel an. Du darfst denselben Abschnitt mehrmals lesen.</p>`});
 panels.push({tone:'green',heading:'3. Ein Beispiel ganz genau',content:`<div class="fc-sample-pair"><div><strong>Das sehen oder lesen wir:</strong><p>${html(sentence(first.case))}</p></div><div><strong>Das bedeutet es:</strong><p>${html(sentence(first.meaning||tip||chunks[0]||'Vergleiche diese Situation mit der Regel aus Schritt 1.'))}</p></div></div>${visual(l)}<p>Gehe zurück zu Schritt 1: Welche Regel erkennst du in diesem Beispiel wieder? Markiere das wichtigste Wort mit deiner Leselinie.</p>`});
 panels.push({tone:'purple',heading:'4. So löst du eine ähnliche Aufgabe',content:`<p><strong>Bevor du anfängst, frage dich:</strong> ${html(strategy.ask)}</p><ol>${allSteps.map(x=>`<li>${html(sentence(x))}</li>`).join('')}</ol><p>Schreibe jeden Schritt möglichst einzeln auf. Wenn ein Schritt noch unklar ist, lies ihn erneut, bevor du weitermachst.</p>`});
 panels.push({tone:'orange',heading:'5. Noch ein Beispiel zum Vergleichen',content:`<div class="fc-sample-pair"><div><strong>Zweites Beispiel:</strong><p>${html(sentence(second.case))}</p></div><div><strong>So lässt es sich erklären:</strong><p>${html(sentence(second.meaning||'Überlege, welche Regel aus den ersten Schritten hier zu erkennen ist.'))}</p></div></div><p><strong>Zum Merken:</strong> ${html(sentence(tip||intro))}</p>`});
 panels.push({tone:'red',heading:'6. Aufgepasst: So vermeidest du Fehler',content:`<p>${html(sentence(custom?.mistake||strategy.mistake))}</p><p>Wenn du dich vertust, ist das kein Grund, schnell weiterzuklicken. Suche die Stelle, an der die Regel nicht mehr passt. Oft genügt es, einen einzelnen Schritt zu verbessern.</p>`});
 panels.push({tone:'green',heading:'7. Jetzt bist du dran',content:`<div class="fc-minitask"><strong>Denkfrage zum Thema „${html(title)}“:</strong><p>Schau dir dieses Beispiel an und erkläre in deinen eigenen Worten, was es mit dem Thema zu tun hat.</p><p><strong>${html(sentence(second.case))}</strong></p><details><summary>Lösungshilfe aufklappen</summary><p>${html(sentence(second.meaning||'Vergleiche das Beispiel mit den Regeln aus Schritt 1 und Schritt 2.'))}</p><p>Du musst nicht dieselben Wörter benutzen. Wichtig ist, dass du den Zusammenhang erklären kannst.</p></details></div><p>Wenn du dich sicher fühlst, scrolle nach unten zu den fünf Beispielen und starte danach deinen Lerntest.</p>`});
 return panels;
};
function enhance(){
 const l=state.lesson;const body=document.querySelector('#reader .reader-body');if(!body||!l)return;
 if(body.querySelector('.fc-support'))return;
 const support=document.createElement('section');support.className='fc-support';support.setAttribute('aria-label','Lernhilfe mit einfachen Schritten');
 support.dataset.large=settings.large?'on':'off';support.dataset.space=settings.space?'on':'off';support.dataset.line=settings.line?'on':'off';
 const panels=guidesFor(l);
 const show=p=>`<section class="fc-guide-panel" data-tone="${p.tone}"><h3>${html(p.heading)}</h3>${p.content}</section>`;
 support.innerHTML=`<div class="fc-support-head"><h2>In Ruhe verstehen – mit deiner Lernhilfe</h2><p>Hier erklären wir das Thema langsam, mit Zwischenüberschriften und sichtbaren Beispielen. Wähle die Ansicht, die für dich am besten passt.</p><div class="fc-support-switches" role="group" aria-label="Erklärmodus"><button type="button" data-fc-mode="easy" aria-pressed="false">Schritt für Schritt</button><button type="button" data-fc-mode="normal" aria-pressed="false">Alles auf einmal</button></div><div class="fc-reader-options" role="group" aria-label="Lesehilfen"><button type="button" data-fc-setting="large" aria-pressed="false">Größere Schrift</button><button type="button" data-fc-setting="space" aria-pressed="false">Mehr Zeilenabstand</button><button type="button" data-fc-setting="line" aria-pressed="false">Leselinie</button><button type="button" data-fc-speak="step" aria-pressed="false">▷ Lernschritt vorlesen</button></div></div><div class="fc-stepper" aria-label="Lernschritte"><button type="button" data-fc-nav="back">← Zurück</button><span class="fc-step-count" role="status" aria-live="polite"></span><button type="button" data-fc-nav="next" class="fc-primary">Weiter →</button></div><div class="fc-guide-grid">${panels.map(show).join('')}</div><p class="fc-tiny-note">Die Beispiele sind zusätzliche Lernhilfen. Bei Unsicherheit kannst du zur ausführlichen Originalerklärung zurückgehen.</p>`;
 const mainHead=body.querySelector(':scope > h2');
 // The original lesson stays available; no content is deleted or overwritten.
 const original=document.createElement('details');original.className='fc-original-exp';
 const sum=document.createElement('summary');sum.textContent='Alle ursprünglichen Erklärschritte anzeigen';original.append(sum);
 const toMove=[...body.querySelectorAll(':scope > .explain-step')];toMove.forEach(n=>original.append(n));
 if(mainHead){mainHead.replaceWith(support)}else body.prepend(support);
 support.after(original);
 const easyBtn=support.querySelector('[data-fc-mode="easy"]');
 const normalBtn=support.querySelector('[data-fc-mode="normal"]');
 const els=[...support.querySelectorAll('.fc-guide-panel')];
 const prev=support.querySelector('[data-fc-nav="back"]'),next=support.querySelector('[data-fc-nav="next"]');
 const count=support.querySelector('.fc-step-count');
 const voiceBtn=support.querySelector('[data-fc-speak]');
 let aidSpeaking=false;
 const stopAidVoice=()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();aidSpeaking=false;voiceBtn.textContent='▷ Lernschritt vorlesen';voiceBtn.setAttribute('aria-pressed','false');};
 currentStep=0;
 const update=()=>{
   const easy=settings.mode==='easy';easyBtn.setAttribute('aria-pressed',String(easy));normalBtn.setAttribute('aria-pressed',String(!easy));
   support.querySelector('.fc-stepper').hidden=!easy;
   els.forEach((el,i)=>{el.hidden=easy&&i!==currentStep;});
   count.textContent=`Schritt ${currentStep+1} von ${els.length}`;prev.disabled=currentStep===0;next.disabled=currentStep===els.length-1;
   for(const k of ['large','space','line'])support.querySelector(`[data-fc-setting="${k}"]`).setAttribute('aria-pressed',String(settings[k]));
   support.dataset.large=settings.large?'on':'off';support.dataset.space=settings.space?'on':'off';support.dataset.line=settings.line?'on':'off';
   original.open=!easy;
 };
 support.addEventListener('click',event=>{
   const btn=event.target.closest('button');
   if(btn){
     if(btn.dataset.fcSpeak){
       if(aidSpeaking){stopAidVoice();return;}
       if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){voiceBtn.textContent='Vorlesen auf diesem Gerät nicht verfügbar';return;}
       if(typeof stopSpeech==='function')stopSpeech();
       const text=els[currentStep]?.innerText||'';
       const utterance=new SpeechSynthesisUtterance(text);
       utterance.lang='de-DE';utterance.rate=l.grade<=4?.78:.87;
       utterance.onend=stopAidVoice;utterance.onerror=stopAidVoice;
       aidSpeaking=true;voiceBtn.textContent='■ Vorlesen stoppen';voiceBtn.setAttribute('aria-pressed','true');
       window.speechSynthesis.speak(utterance);return;
     }
     if(btn.dataset.fcMode){stopAidVoice();settings.mode=btn.dataset.fcMode;currentStep=0;keep();update();return;}
     if(btn.dataset.fcSetting){settings[btn.dataset.fcSetting]=!settings[btn.dataset.fcSetting];keep();update();return;}
     if(btn.dataset.fcNav){stopAidVoice();currentStep=Math.max(0,Math.min(els.length-1,currentStep+(btn.dataset.fcNav==='next'?1:-1)));update();els[currentStep]?.querySelector('h3')?.setAttribute('tabindex','-1');els[currentStep]?.querySelector('h3')?.focus({preventScroll:true});return;}
   }
   if(settings.line){const p=event.target.closest('.fc-guide-panel p');if(p){support.querySelectorAll('.fc-reading-active').forEach(x=>x.classList.remove('fc-reading-active'));p.classList.add('fc-reading-active');}}
 });
 update();
 // The existing test invite and all five original examples remain below the guide.
}
const prevRender=renderReader;
renderReader=function(){prevRender();enhance();};
// The app initializes its home or hash route before this extension loads.
if(state.lesson)enhance();
})();


;


/* FixClever 2.3.1 – Interaktive Bruchkreise; keine externen Ressourcen. */
(function(){
'use strict';
const relevant=l=>l&&l.subject==='Mathe'&&/bruch|brüch|nenner|zähler|bruchteile|gleichnamig|ungleichnamig|kürzen|erweitern/i.test(l.title);
const storeKey='fixclever-fraction-view-v1';
let preferred='circle';try{preferred=localStorage.getItem(storeKey)==='bar'?'bar':'circle'}catch{}
const modes=[['parts','Bruch ansehen'],['compare','Vergleichen'],['equal','Kürzen & Erweitern'],['add','Addieren'],['sub','Subtrahieren'],['mul','Multiplizieren']];
const patterns={
 parts:[{n:1,d:2},{n:1,d:3},{n:3,d:4},{n:5,d:8},{n:7,d:4}],
 compare:[[[1,2],[2,4]],[[3,4],[2,3]],[[2,5],[3,5]],[[5,6],[3,4]],[[2,3],[3,4]]],
 equal:[[[1,2],[2,4]],[[2,3],[4,6]],[[3,4],[6,8]],[[3,6],[1,2]],[[2,4],[4,8]]],
 add:[[[1,4],[2,4]],[[1,2],[1,4]],[[1,3],[1,6]],[[3,8],[1,8]],[[5,6],[1,3]]],
 sub:[[[3,4],[1,4]],[[5,6],[1,3]],[[7,8],[1,4]],[[1,2],[1,4]],[[5,4],[1,2]]],
 mul:[[[1,2],[1,3]],[[2,3],[3,4]],[[1,4],[2,3]],[[3,5],[2,3]],[[5,6],[2,5]]]
};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t;}return a||1};
const lcm=(a,b)=>a/gcd(a,b)*b;
const frac=(n,d)=>`${n}/${d}`;
const shown=(n,d)=>`<span class="fc19-frac-number" aria-label="${n} von ${d}"><span class="fc19-num">${n}</span><span class="fc19-den">${d}</span></span>`;
const reduce=(n,d)=>{const g=gcd(n,d);return [n/g,d/g]};
const unit=(n,d,view)=>{
 if(view==='bar'){
   return `<div class="fc19-bar" aria-hidden="true">${Array.from({length:d},(_,i)=>`<span class="${i<n?'fc19-painted':''}"></span>`).join('')}</div>`;
 }
 let paths='';const cx=88,cy=88,r=79;
 if(d===1){paths=`<circle cx="88" cy="88" r="79" fill="${n>0?'#1e789b':'#edf2f5'}"/>`}
 else for(let i=0;i<d;i++){
   const start=-Math.PI/2+(i/d)*2*Math.PI;
   const end=-Math.PI/2+((i+1)/d)*2*Math.PI;
   const x1=(cx+r*Math.cos(start)).toFixed(3),y1=(cy+r*Math.sin(start)).toFixed(3);
   const x2=(cx+r*Math.cos(end)).toFixed(3),y2=(cy+r*Math.sin(end)).toFixed(3);
   const large=1/d>0.5?1:0;
   const path=`M 88 88 L ${x1} ${y1} A 79 79 0 ${large} 1 ${x2} ${y2} Z`;
   paths+=`<path d="${path}" fill="${i<n?'#1e789b':'#edf2f5'}" stroke="#ffffff" stroke-width="2.4" stroke-linejoin="round"/>`;
 }
 return `<svg class="fc19-circle" viewBox="0 0 176 176" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${paths}<circle cx="88" cy="88" r="79" fill="none" stroke="#334e62" stroke-width="3"/></svg>`;
};
function picture(n,d,view,label){
 const wholes=Math.floor(n/d),rem=n%d;
 const total=wholes+(rem?1:0)||1;
 // All preset values fit into two circles; more than four are represented as a count plus a remainder.
 let visuals='';
 if(total>4){visuals=unit(d,d,view);}
 else {for(let i=0;i<total;i++){
   const amount=i<wholes?d:i===wholes?rem:0;
   visuals+=unit(amount,d,view);
 }}
 const extra=total>4?` (${wholes} ganze Kreise und ${rem}/${d})`:'';
 return `<figure class="fc19-figure" data-multi="${total>1}" aria-label="${label}: ${frac(n,d)}, ${wholes?'ganze Kreise '+wholes+', ':''}${rem} von ${d} Stücken eingefärbt${extra}"><div class="fc19-model-name">${label}</div><div class="fc19-svgrow">${visuals}</div><figcaption>${shown(n,d)}</figcaption></figure>`;
}
function exampleButtonLabel(kind,item){
 if(kind==='parts')return frac(item.n,item.d);
 const [a,b]=item;return `${frac(...a)} ${kind==='compare'?'?':kind==='equal'?'=':kind==='add'?'+':kind==='sub'?'−':'×'} ${frac(...b)}`;
}
function explanation(kind,item,view){
 if(kind==='parts'){
   const {n,d}=item,wholes=Math.floor(n/d),rem=n%d;
   let words= n===0?'Kein Stück ist markiert. Der Anteil ist null.':n<d?`${n} von ${d} gleich großen Stücken sind eingefärbt.`:n===d?'Alle Stücke sind markiert. Das ergibt genau ein Ganzes.':`${wholes} ganzer Kreis${wholes===1?'':'e'} und ${rem} von ${d} Teilen eines weiteren Kreises sind eingefärbt.`;
   return {visual:`${picture(n,d,view,'So sieht der Bruch aus')}`,eq:shown(n,d),steps:[`Schau zuerst auf einen ganzen Kreis. Alle Kreise sind gleich groß.`,`Teile jeden Kreis in ${d} gleich große Stücke. ${d} heißt Nenner und steht unten.`,`Zähle die eingefärbten Stücke: ${n}. ${n} heißt Zähler und steht oben.`,words],tip:'Der Nenner zählt die gleich großen Teile eines Ganzen. Der Zähler zählt die ausgewählten Teile. Ein Bruch kann auch größer als 1 sein.'};
 }
 const [[a,b],[c,d]]=item;
 const p=picture(a,b,view,'Erster Bruch');
 const q=picture(c,d,view,'Zweiter Bruch');
 if(kind==='compare'){
   const left=a*d,right=c*b;const operator=left===right?'=':left>right?'>':'<';
   return {visual:p+q,eq:`${shown(a,b)} <span aria-label="${operator==='='?'ist gleich':operator==='>'?'ist größer als':'ist kleiner als'}">${operator}</span> ${shown(c,d)}`,steps:[`Vergleiche nur Kreise, die als Ganzes gleich groß sind. So ist der Vergleich fair.`,`Beim ersten Bruch ist ${a} von ${b} Teilen markiert; beim zweiten sind es ${c} von ${d}.`,`Rechne zum Vergleichen kreuzweise: ${a} × ${d} = ${left} und ${c} × ${b} = ${right}.`,`Weil ${left} ${left===right?'genau so groß wie':left>right?'größer als':'kleiner als'} ${right} ist, gilt: ${frac(a,b)} ${operator} ${frac(c,d)}.`],tip:'Bei gleichem Nenner reicht der Vergleich der Zähler. Bei unterschiedlichen Nennern helfen gleich große Kreise und ein gemeinsamer Nenner.'};
 }
 if(kind==='equal'){
   const f=(c/a)||1;let verb,rule;
   if(f>1){verb='erweitert';rule=`Multipliziere Zähler und Nenner mit ${f}. Es wird kein neues Stück des Ganzen hinzugefügt.`}
   else if(f<1){verb='gekürzt';rule=`Teile Zähler und Nenner durch ${1/f}. Der Anteil bleibt gleich.`}
   else {verb='gleich geschrieben';rule='Vergleiche die Anteile beider Kreise.'}
   return {visual:p+q,eq:`${shown(a,b)} = ${shown(c,d)}`,steps:[`Beide Kreise sind gleich groß; nur die Zahl der Teilstücke kann verschieden sein.`,`Links sind ${a} von ${b} Stücken markiert. Rechts sind ${c} von ${d} Stücken markiert.`,`Der Bruch wird ${verb}: ${rule}`,`Das Ergebnis ist derselbe Anteil am Ganzen: ${frac(a,b)} = ${frac(c,d)}.`],tip:'Beim Erweitern und Kürzen müssen Zähler und Nenner immer mit derselben Zahl multipliziert oder durch dieselbe Zahl geteilt werden.'};
 }
 if(kind==='mul'){
   const n=a*c,den=b*d,[x,y]=reduce(n,den);
   return {visual:p+q+picture(x,y,view,'Das Ergebnis'),eq:`${shown(a,b)} × ${shown(c,d)} = ${shown(x,y)}`,steps:[`Lies zuerst die beiden Brüche: ${frac(a,b)} und ${frac(c,d)}.`,`Multipliziere die Zähler: ${a} × ${c} = ${n}.`,`Multipliziere die Nenner: ${b} × ${d} = ${den}.`,`Du erhältst ${frac(n,den)}${n!==x||den!==y?`, gekürzt ${frac(x,y)}`:''}. Der letzte Kreis zeigt den Ergebnisanteil.`],tip:'Beim Multiplizieren von Brüchen gilt: oben mal oben und unten mal unten. Danach kannst du kürzen.'};
 }
 const den=lcm(b,d),a2=a*(den/b),c2=c*(den/d),out=kind==='add'?a2+c2:a2-c2;
 const [redN,redD]=reduce(out,den);
 const sign=kind==='add'?'+':'−';
 return {visual:p+q+picture(redN,redD,view,'Das Ergebnis'),eq:`${shown(a,b)} ${sign} ${shown(c,d)} = ${shown(redN,redD)}`,steps:[`Schau auf die beiden gleich großen Kreise und lies ${frac(a,b)} ${sign} ${frac(c,d)}.`,`Die Stücke müssen gleich groß sein. Ein gemeinsamer Nenner ist ${den}.`,`Schreibe beide Brüche mit diesem Nenner: ${frac(a,b)} = ${frac(a2,den)} und ${frac(c,d)} = ${frac(c2,den)}.`,`Rechne nur mit den Zählern: ${a2} ${sign} ${c2} = ${out}. Der Nenner bleibt ${den}.`,`Das sind ${frac(out,den)}${out!==redN||den!==redD?`, gekürzt ${frac(redN,redD)}`:''}. Rechts siehst du den Ergebnisanteil.`],tip:'Beim Addieren oder Subtrahieren erst die Nenner gleich machen. Dann die Zähler addieren oder abziehen. Den gemeinsamen Nenner behältst du.'};
}
function modeFor(l){const t=l.title.toLowerCase();if(/vergleich/i.test(t))return 'compare';if(/erweit|kürz/i.test(t))return 'equal';if(/addier|summe/i.test(t))return 'add';if(/multipliz/i.test(t))return 'mul';if(/subtrah/i.test(t))return 'sub';return 'parts'}
function attach(){
 const l=state.lesson;if(!relevant(l))return;
 const support=document.querySelector('#reader .fc-support');if(!support||support.querySelector('.fc19-frac'))return;
 // Replace the old rectangular fraction illustration, not other visual aids.
 const originalBar=support.querySelector('.fc-fraction');originalBar?.closest('.fc-visual')?.remove();
 let mode=modeFor(l),at=0,view=preferred,custom={n:3,d:4};
 const root=document.createElement('section');root.className='fc19-frac';root.setAttribute('aria-label','Brüche lernen mit farbigen Kreisen');
 root.innerHTML=`<h3>Brüche mit Kreisen verstehen</h3><p class="fc19-intro">Jeder Kreis ist ein Ganzes. Er wird in gleich große Stücke geteilt. Die blauen Stücke zeigen den Anteil.</p><div class="fc19-tabs" role="group" aria-label="Bruchrechenart">${modes.map(([key,label])=>`<button type="button" data-fc19-mode="${key}" aria-pressed="false">${label}</button>`).join('')}</div><div class="fc19-views"><strong>So möchtest du die Brüche sehen:</strong><div class="fc19-view-tabs" role="group" aria-label="Darstellung wählen"><button type="button" data-fc19-view="circle" aria-pressed="false">◉ Kreisform</button><button type="button" data-fc19-view="bar" aria-pressed="false">▰ Balkenform</button></div></div><div class="fc19-live"></div><p class="fc19-small">Die Kreise sind gleich groß. Auch bei verschiedenen Nennern kannst du so Anteile vergleichen.</p>`;
 support.querySelector('.fc-support-head')?.after(root);
 const live=root.querySelector('.fc19-live');
 const paint=()=>{
   for(const b of root.querySelectorAll('[data-fc19-mode]'))b.setAttribute('aria-pressed',String(b.dataset.fc19Mode===mode));
   for(const b of root.querySelectorAll('[data-fc19-view]'))b.setAttribute('aria-pressed',String(b.dataset.fc19View===view));
   const item=mode==='parts'?custom:patterns[mode][at];
   const detail=explanation(mode,item,view);
   const examples=mode==='parts'?patterns.parts:patterns[mode];
   const buttons=examples.map((x,i)=>`<button type="button" data-fc19-case="${i}" aria-pressed="${mode==='parts'?x.n===custom.n&&x.d===custom.d:at===i}">${exampleButtonLabel(mode,x)}</button>`).join('');
   const adjust=mode==='parts'?`<div class="fc19-adjust"><strong>Gestalte deinen eigenen Bruch:</strong><div class="fc19-adjust-row"><label for="fc19-d-${l.id}">Nenner: Stücke pro Kreis</label><select id="fc19-d-${l.id}" data-fc19-denom>${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===custom.d?'selected':''}>${i+1}</option>`).join('')}</select></div><div class="fc19-adjust-row"><label>Zähler: blaue Stücke</label><button type="button" data-fc19-adjust="minus" aria-label="Ein blaues Stück weniger">−</button><strong>${custom.n}</strong><button type="button" data-fc19-adjust="plus" aria-label="Ein blaues Stück mehr">+</button></div><div class="fc19-adjust-row"><input aria-label="Anzahl der blauen Stücke" type="range" min="0" max="${Math.min(24,custom.d*2)}" step="1" value="${custom.n}" data-fc19-slider></div></div>`:'';
   live.innerHTML=`<p><strong>Such dir ein Beispiel aus:</strong></p><div class="fc19-examples" role="group" aria-label="Bruchbeispiele">${buttons}</div>${adjust}<div class="fc19-picture-row">${detail.visual}</div><div class="fc19-equation" aria-label="Rechnung">${detail.eq}</div><div class="fc19-chips"><span class="fc19-chip"><strong>Zähler</strong> = markierte Stücke</span><span class="fc19-chip"><strong>Nenner</strong> = gleich große Stücke pro Kreis</span></div><h4>Schritt für Schritt erklärt</h4><ol class="fc19-steps">${detail.steps.map(step=>`<li>${step}</li>`).join('')}</ol><div class="fc19-help"><strong>Merksatz</strong>${detail.tip}</div><p class="fc19-small">Probiere oben die anderen Beispiele. Du kannst jederzeit wieder zum Kreis zurückwechseln.</p>`;
 };
 root.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;
   if(b.dataset.fc19Mode){mode=b.dataset.fc19Mode;at=0;paint();return}
   if(b.dataset.fc19View){view=b.dataset.fc19View;preferred=view;try{localStorage.setItem(storeKey,view)}catch{}paint();return}
   if(b.dataset.fc19Case!==undefined){const x=Number(b.dataset.fc19Case);if(mode==='parts'){custom={...patterns.parts[x]}}else at=x;paint();return}
   if(b.dataset.fc19Adjust){custom.n=Math.max(0,Math.min(custom.d*2,custom.n+(b.dataset.fc19Adjust==='plus'?1:-1)));paint();return}
 });
 root.addEventListener('change',e=>{
   if(e.target.matches('[data-fc19-denom]')){custom.d=Number(e.target.value);custom.n=Math.min(custom.n,custom.d*2);paint()}
   if(e.target.matches('[data-fc19-slider]')){custom.n=Number(e.target.value);paint()}
 });
 paint();
}
const before=renderReader;renderReader=function(){before();attach()};
if(state.lesson)attach();
})();


;

/* FixClever 2.3.1 – Mathe mit Bildern, 1.–10. Klasse; vollständig offline, keine fremden Bibliotheken. */
(()=>{
'use strict';
const LESSON_KIND={
 l1:'number',l2:'add',l3:'subtract',l4:'place100',l5:'multiply',l6:'divide',l7:'place1000',l8:'remainder',l9:'measure',l10:'written',l11:'fraction',l12:'area',l13:'priority',l14:'fraction',l15:'angle',l16:'decimal',l17:'fraction',l18:'negative',l19:'percent',l20:'ratio',l21:'equation',l22:'linear',l23:'binomial',l24:'probability',l25:'pythagoras',l26:'quadratic',l27:'systems',l28:'trig',l29:'growth',l30:'statistics',
 nrw14_2:'fraction',nrw14_26:'percent',nrw14_27:'linear',nrw14_28:'probability',nrw14_33:'time',
 fc15_011:'split',fc15_012:'measure',fc15_013:'multiply',fc15_014:'area',fc15_015:'fraction',fc15_016:'negative',fc15_017:'terms',fc15_018:'linear',fc15_019:'pythagoras',fc15_020:'probability',
 fc16_004:'written',fc16_005:'decimal',fc16_006:'quadEq',fc16_077:'equation'
};
const PRESETS={
 number:[4,7,9,13,18],split:[[5,2],[7,3],[8,5],[9,4],[10,6]],place100:[24,47,63,85,99],place1000:[127,208,356,640,942],add:[[3,4],[7,5],[8,6],[12,4],[9,8]],subtract:[[9,4],[13,5],[16,7],[14,6],[20,8]],
 place:[47,93,208,356,1042],multiply:[[3,4],[2,6],[5,3],[4,5],[6,3]],divide:[[12,3],[20,5],[18,6],[24,4],[15,3]],
 remainder:[[14,4],[17,5],[20,6],[23,4],[29,6]],measure:[2,3,4,6,7],written:[['+',247,135],['-',548,216],['+',368,257],['×',23,4],['×',34,6]],
 area:[[3,4],[5,2],[4,4],[6,3],[5,5]],priority:[[4,3,2,'+×'],[18,6,2,'-÷'],[4,3,2,'(+ )×'],[20,5,6,'÷+'],[5,8,3,'×(-)']],
 angle:[30,45,90,120,180],decimal:[['+',1.2,.35],['-',3.5,1.2],['×',2.4,3],['÷',4.5,3],['+',.4,.6]],
 negative:[[-3,5],[4,-7],[-6,4],[-2,-5],[3,-5]],percent:[[25,80],[10,60],[50,42],[20,150],[75,40]],
 ratio:[[3,6,5],[4,12,7],[5,15,2],[2,8,6],[6,18,10]],equation:[[3,2,14],[2,4,12],[5,1,21],[4,3,19],[2,7,17]],
 terms:[[2,3],[4,2],[1,5],[3,6],[7,1]],linear:[[1,1],[2,0],[-1,2],[1,-2],[-2,1]],binomial:[[2,1],[3,1],[2,2],[4,1],[3,2]],
 probability:[[2,3],[1,4],[3,3],[4,2],[5,5]],pythagoras:[[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]],
 quadratic:[[1,0,0],[1,1,0],[1,-1,1],[2,0,0],[1,2,1]],quadEq:[[1,0,-4],[1,1,-9],[1,0,-1],[1,-2,-4],[1,2,-9]],
 systems:[[1,1,-1,3],[2,0,0,2],[1,-2,-2,1],[-1,2,1,-2],[2,-2,-1,1]],
 trig:[[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]],growth:[[100,2,3],[50,2,4],[200,1.5,3],[80,1.25,4],[500,.8,3]],
 statistics:[[3,5,5,7,10],[2,4,6,8,10],[4,4,5,6,6],[1,3,7,8,11],[2,2,2,6,8]],time:[[2,10,25],[8,30,45],[11,15,30],[5,50,20],[9,45,30]]
};
const INTROS={
 split:'Du kannst eine Zahl in zwei Teile zerlegen. Eine Menge wird dafür in zwei kleinere Gruppen aufgeteilt. Zusammen ergeben beide Gruppen wieder die ursprüngliche Zahl.',
 place100:'Zehner und Einer helfen, Zahlen bis hundert zu verstehen. Jeder Zehner besteht aus zehn Einern. Du kannst die Zahl in Zehner und Einer zerlegen.',
 place1000:'Die Zahlen bis tausend bestehen aus Hunderten, Zehnern und Einern. Mit einer Stellenwerttafel siehst du, welchen Wert jede Ziffer hat.',
 number:'Zahlen sind Mengen. Eine Zahl sagt, wie viele Dinge wir zählen. Wir können die Menge mit Punkten und die Zahl am Zahlenstrahl sehen.',
 add:'Beim Plusrechnen legen wir etwas dazu. Auf dem Zahlenstrahl gehen wir dafür nach rechts. Zähle langsam jeden Schritt mit.',
 subtract:'Beim Minusrechnen nehmen wir etwas weg. Auf dem Zahlenstrahl gehen wir dafür nach links. Die Zahl am Ende ist das Ergebnis.',
 place:'Unsere Zahlenschreibweise hat Stellen: Tausender, Hunderter, Zehner und Einer. Der Platz einer Ziffer bestimmt ihren Wert. Eine 4 kann vier Einer oder vier Hunderter bedeuten.',
 multiply:'Malnehmen bedeutet: mehrere gleich große Gruppen zusammenzählen. Die Punkte stehen in Reihen. So kannst du die Malaufgabe sehen, statt sie nur auswendig zu lernen.',
 divide:'Teilen heißt: Eine Menge wird in gleich große Gruppen verteilt. Am Ende prüfen wir, wie viele Punkte in jeder Gruppe liegen.',
 remainder:'Manchmal lassen sich Dinge nicht gleichmäßig in Gruppen aufteilen. Was übrig bleibt, heißt Rest. Der Rest muss kleiner als der Teiler sein.',
 measure:'Längen misst man mit einem Lineal. Wichtig ist, bei null zu starten und die Einheit dazuzuschreiben. Ein Zentimeter entspricht zehn Millimetern.',
 time:'Bei der Uhr zeigt der kurze Zeiger die Stunde und der lange die Minuten. Für eine Zeitspanne kannst du die Minuten auf der Uhr weiterzählen.',
 written:'Beim schriftlichen Rechnen stehen Einer unter Einern und Zehner unter Zehnern. Rechne Stelle für Stelle und vergiss Überträge oder das Entbündeln nicht.',
 area:'Der Umfang ist der Weg um die Figur herum. Die Fläche zeigt, wie viele Einheitsquadrate in der Figur liegen. Das sind zwei unterschiedliche Größen.',
 priority:'Bei mehreren Rechenarten gilt: zuerst die Klammern, dann Mal und Geteilt, danach Plus und Minus. Innerhalb derselben Stufe rechnest du von links nach rechts.',
 angle:'Ein Winkel beschreibt, wie weit eine Richtung gedreht wird. Gemessen wird in Grad. Ein rechter Winkel hat genau 90 Grad.',
 decimal:'Bei Dezimalzahlen zeigt das Komma, wo die Einerstelle endet. Rechts davon stehen Zehntel und Hundertstel. Beim Addieren und Subtrahieren werden Kommas untereinander geschrieben.',
 negative:'Negative Zahlen sind kleiner als null. Am Zahlenstrahl liegen sie links von null. Eine Bewegung nach rechts erhöht die Zahl, nach links verringert sie sich.',
 percent:'Prozent bedeutet „von hundert“. 25 Prozent sind 25 von 100 gleich großen Feldern. Mit dem Prozentfeld kannst du den Anteil sichtbar machen.',
 ratio:'Beim Dreisatz rechnest du zuerst auf eine Einheit zurück. Dann rechnest du von dieser Einheit auf die gesuchte Menge. Das geht nur bei wirklich proportionalen Zusammenhängen.',
 equation:'Eine Gleichung ist wie eine Waage: links und rechts muss derselbe Wert stehen. Was du auf einer Seite änderst, musst du auch auf der anderen Seite ändern.',
 terms:'Gleichartige Terme kannst du zusammenfassen. Zum Beispiel sind zwei x und drei x zusammen fünf x. Eine reine Zahl ist aber kein x.',
 linear:'Eine lineare Funktion zeichnet im Koordinatensystem eine gerade Linie. In y = m · x + b ist m die Steigung und b der Schnittpunkt mit der y-Achse.',
 binomial:'Die binomischen Formeln lassen sich als Flächen sehen. Ein großes Quadrat aus mehreren Teilflächen hilft zu verstehen, warum beim Quadrieren ein mittlerer Term entsteht.',
 probability:'Wahrscheinlichkeit beschreibt eine Chance. Bei gleich wahrscheinlichen Möglichkeiten lautet die Regel: günstige Ergebnisse durch alle möglichen Ergebnisse.',
 pythagoras:'Im rechtwinkligen Dreieck gilt: a² + b² = c². Die Seite c liegt gegenüber dem rechten Winkel und heißt Hypotenuse.',
 quadratic:'Der Graph einer quadratischen Funktion ist eine Parabel. Der tiefste oder höchste Punkt heißt Scheitelpunkt. Die Form ist nicht dieselbe wie eine gerade Linie.',
 quadEq:'Die Lösungen einer quadratischen Gleichung sind die x-Werte, für die der Funktionswert null wird. Im Bild liegen sie dort, wo die Parabel die x-Achse trifft.',
 systems:'Bei einem linearen Gleichungssystem suchst du Zahlen, die zwei Gleichungen gleichzeitig erfüllen. Im Bild ist die Lösung der Schnittpunkt beider Geraden.',
 trig:'Sinus, Kosinus und Tangens verbinden Winkel und Seitenlängen in einem rechtwinkligen Dreieck. Entscheidend ist, welche Seite dem betrachteten Winkel gegenüberliegt.',
 growth:'Bei exponentiellem Wachstum wird in jedem Schritt mit demselben Faktor multipliziert. Bei einem Faktor unter eins wird die Menge kleiner: Das heißt exponentieller Zerfall.',
 statistics:'Statistik hilft, Daten zu beschreiben. Mittelwert und Median können sich unterscheiden. Achte beim Lesen von Diagrammen auf den Anfang und die Einteilung der Achsen.'
};
const FALLBACK='Nimm dir Zeit und betrachte die Zeichnung zu dieser Aufgabe. Die Zeichnung hilft nur dann, wenn sie zu den angegebenen Zahlen und Regeln passt.';
const txt=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.abs(n-Math.round(n))<1e-8?String(Math.round(n)):String(Math.round(n*100)/100).replace('.',',');
const mark=(x,y,r=5,color='#146b9d')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const line=(x1,y1,x2,y2,stroke='#254960',width=2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"/>`;
const label=(x,y,s,cls='fc190-svg-label',anchor='middle')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${txt(s)}</text>`;
const rect=(x,y,w,h,fill,stroke='#fff')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
const dotRows=(rows,cols,extra=0)=>{
 let out='';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)out+=mark(45+c*30,45+r*30,8,r%2===0?'#1477a7':'#399b80');
 for(let i=0;i<extra;i++)out+=mark(45+i*30,45+rows*30,8,'#bd741b');return out;
};
const plot=(fn,{xmin=-5,xmax=5,ymin=-5,ymax=10,extra='',points=[]}={})=>{
 const L=58,R=418,T=18,B=222;const X=x=>L+(x-xmin)/(xmax-xmin)*(R-L),Y=y=>B-(y-ymin)/(ymax-ymin)*(B-T);
 let g='';const xrange=Math.ceil(xmax)-Math.floor(xmin),yrange=Math.ceil(ymax)-Math.floor(ymin);
 for(let x=Math.ceil(xmin);x<=Math.floor(xmax);x++)g+=line(X(x),T,X(x),B,'#d5e2e9',1)+(x%2===0?label(X(x),B+17,x,'fc190-svg-label fc190-svg-small'):'');
 for(let y=Math.ceil(ymin);y<=Math.floor(ymax);y++)g+=line(L,Y(y),R,Y(y),'#d5e2e9',1)+(y%2===0?label(L-15,Y(y)+4,y,'fc190-svg-label fc190-svg-small'):'');
 if(xmin<=0&&xmax>=0)g+=line(X(0),T,X(0),B,'#334e64',2);
 if(ymin<=0&&ymax>=0)g+=line(L,Y(0),R,Y(0),'#334e64',2);
 const poly=(f,color)=>{let p='';for(let i=0;i<=160;i++){const x=xmin+(xmax-xmin)*i/160,y=f(x);if(y>=ymin-.6&&y<=ymax+.6)p+=(p?' ':'')+X(x).toFixed(1)+','+Y(y).toFixed(1)}return `<polyline points="${p}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`};
 g+=poly(fn,'#156d9f');if(extra)g+=poly(extra.fn||(()=>0),'#c67a18');for(const p of points){if(p.x>=xmin&&p.x<=xmax&&p.y>=ymin&&p.y<=ymax){g+=mark(X(p.x),Y(p.y),5,p.color||'#155a9b');g+=label(X(p.x)+7,Y(p.y)-9,p.name||`(${fmt(p.x)}|${fmt(p.y)})`,'fc190-svg-label fc190-svg-small','start')}}
 return g;
};
const svg=(labelText,content,h=260)=>`<svg class="fc190-figure" role="img" aria-label="${txt(labelText)}" viewBox="0 0 460 ${h}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
const result=(title,answer,steps,drawing,note,question,solution)=>({title,answer:String(answer),steps,drawing,note:note||'',question:question||'',solution:solution||''});
function visual(type,p){
 let g='',steps=[],title='',answer='',note='',question='',solution='',description='';
 if(type==='split'){
  const [total,first]=p,second=total-first;title=`${total} auf zwei Gruppen aufteilen`;answer=`${first} + ${second} = ${total}`;
  for(let i=0;i<total;i++)g+=mark(42+(i%5)*36+(i>=5?0:0),i>=5?155:80,11,i<first?'#167ca8':'#c17e1e');
  g+=label(325,87,`${first} blau`,'fc190-svg-label fc190-svg-strong')+label(325,132,`${second} orange`,'fc190-svg-label fc190-svg-strong')+label(325,180,`${first} + ${second} = ${total}`);
  steps=[`Beginne mit ${total} Punkten.`,`Male ${first} Punkte blau. Die übrigen ${second} Punkte sind orange.`,`Beide Gruppen zusammen ergeben ${total}: ${first} + ${second} = ${total}.`,`Bei einer anderen Zerlegung bleibt die Gesamtzahl gleich.`];
  question=`Wie viele Punkte fehlen von ${first} bis ${total}?`;solution=String(second);description='Eine Gesamtzahl aus zwei unterschiedlich markierten Teilgruppen.';
 }else if(type==='number'){
  const n=p;title=`Die Zahl ${n} sehen und zählen`;answer=`${n} Punkte`;g+=line(25,72,435,72);for(let i=0;i<=20;i++){let x=25+i*20.5;g+=line(x,66,x,79,'#344f64',1)+(i%2===0?label(x,98,i,'fc190-svg-label fc190-svg-small'):'');}g+=mark(25+n*20.5,72,8,'#c47b18');for(let i=0;i<n;i++)g+=mark(42+i%10*38,134+Math.floor(i/10)*34,8);steps=[`Zähle von null an bis ${n}.`,`Bei jedem Punkt sagst du eine Zahl. Jeder Punkt wird nur einmal gezählt.`,`Der orange Punkt am Zahlenstrahl steht bei ${n}.`];question=`Welche Zahl liegt direkt nach ${n}?`;solution=String(n+1);description='Zahlenstrahl von 0 bis 20 und blaue Zählpunkte.';
 }else if(type==='add'||type==='subtract'||type==='negative'){
  let a,b;if(type==='negative'){[a,b]=p;}else [a,b]=p;const end=type==='subtract'?a-b:a+b;const lo=type==='negative'?-10:0,hi=type==='negative'?10:20;const X=n=>25+(n-lo)/(hi-lo)*410;
  g+=line(25,122,435,122);for(let i=lo;i<=hi;i++){g+=line(X(i),116,X(i),130,'#344f64',1)+(i%2===0?label(X(i),151,i,'fc190-svg-label fc190-svg-small'):'');}g+=mark(X(a),122,7,'#c47b18')+mark(X(end),122,7,'#1477a7');g+=`<path d="M ${X(a)} 113 Q ${(X(a)+X(end))/2} 25 ${X(end)} 113" fill="none" stroke="#2f8c76" stroke-width="3" stroke-dasharray="7 4"/>`+label(X(a),172,'Start','fc190-svg-label fc190-svg-small')+label(X(end),196,'Ziel','fc190-svg-label fc190-svg-small');title=`${fmt(a)} ${type==='subtract'?'−':b<0?'−':'+'} ${fmt(Math.abs(b))} auf dem Zahlenstrahl`;answer=fmt(end);steps=[`Starte bei der Zahl ${fmt(a)}.`,`Der zweite Wert ist ${fmt(b)}. ${type==='subtract'||b<0?'Gehe '+fmt(Math.abs(b))+' Schritte nach links.':'Gehe '+fmt(b)+' Schritte nach rechts.'}`,`Du landest bei ${fmt(end)}. Das ist das Ergebnis.`];note='Rechts werden Zahlen größer. Links werden sie kleiner.';question=`Wie viel ist ${fmt(a)} ${type==='subtract'?'−':'+'} ${fmt(b)}?`;solution=fmt(end);description='Zahlenstrahl mit Start, Ziel und Richtung.';
 }else if(type==='place'||type==='place100'||type==='place1000'){
  const n=p;const ds=[Math.floor(n/1000)%10,Math.floor(n/100)%10,Math.floor(n/10)%10,n%10];const x0=24,w=101;g+=['Tausender','Hunderter','Zehner','Einer'].map((t,i)=>rect(x0+i*w,32,w-3,60,'#e7f0f6')+label(x0+i*w+48,55,t,'fc190-svg-label fc190-svg-small')+label(x0+i*w+48,81,ds[i],'fc190-svg-label fc190-svg-strong')).join('');g+=label(225,134,`${ds[0]} · 1000 + ${ds[1]} · 100 + ${ds[2]} · 10 + ${ds[3]} · 1`);g+=label(225,188,`${n.toLocaleString('de-DE')}`,'fc190-svg-label fc190-svg-strong');title=`Die Zahl ${n.toLocaleString('de-DE')} zerlegen`;answer=`${ds.map((x,i)=>x*10**(3-i)).filter(Boolean).join(' + ')}`;steps=[`Lies zuerst die ganze Zahl ${n.toLocaleString('de-DE')}.`,`Schau auf die vier Stellen: T, H, Z und E.`,`Die Ziffern bedeuten: ${ds[0]} Tausender, ${ds[1]} Hunderter, ${ds[2]} Zehner und ${ds[3]} Einer.`,`Addierst du die Stellenwerte, erhältst du wieder ${n}.`];question=`Wie viele Zehner stecken als Stellenwert in ${n.toLocaleString('de-DE')}?`;solution=String(ds[2]);description='Stellenwerttafel mit T, H, Z und E.';
 }else if(type==='multiply'){
  const [r,c]=p;g=dotRows(r,c)+label(325,74,`${r} Reihen`)+label(325,104,`mit je ${c}`)+label(325,143,`${r} × ${c} = ${r*c}`,'fc190-svg-label fc190-svg-strong');title=`${r} · ${c}: gleich große Reihen`;answer=r*c;steps=[`Lege ${r} Reihen mit jeweils ${c} Punkten.`,`Du kannst ${Array.from({length:r},()=>c).join(' + ')} rechnen.`,`Zusammen sind das ${r*c} Punkte. Du kannst auch ${r} · ${c} schreiben.`];question=`Wie viel ist ${c} · ${r}?`;solution=String(r*c);description=`Punktefeld mit ${r} Reihen und ${c} Spalten.`;
 }else if(type==='divide'||type==='remainder'){
  const [n,d]=p;const q=Math.floor(n/d),rest=n%d;for(let i=0;i<d;i++){const x=12+i* Math.min(94,420/d),xx=x+4;g+=rect(xx,38,Math.min(90,415/d)-3,Math.max(55,Math.ceil((q+1)/3)*24+16),'#eff5f9','#89b5cc');for(let j=0;j<q;j++)g+=mark(xx+16+(j%3)*19,56+Math.floor(j/3)*22,6)}for(let i=0;i<rest;i++)g+=mark(30+i*21,188,6,'#bf7c20');g+=label(290,205,rest?'Rest: '+rest:'Kein Rest','fc190-svg-label');title=`${n} : ${d} gerecht verteilen`;answer=`${q}${rest?' Rest '+rest:''}`;steps=[`Beginne mit ${n} Dingen. Teile sie auf ${d} gleich große Gruppen auf.`,`In jede Gruppe passen ${q} Dinge.`,`Am Ende ${rest?'bleiben '+rest+' Dinge übrig. Das ist der Rest.':'bleibt nichts übrig.'}`,`Prüfe: ${d} · ${q}${rest?' + '+rest:''} = ${n}.`];question=`Wie viele Dinge liegen in einer Gruppe?`;solution=String(q);description='Gleich große Gruppen aus Punkten; Rest gesondert markiert.';
 }else if(type==='measure'){
  const cm=p;g+=line(35,85,415,85);for(let i=0;i<=10;i++){const x=35+38*i;g+=line(x,72,x,102,'#344f64',2)+label(x,123,i,'fc190-svg-label fc190-svg-small');for(let j=1;j<10&&i<10;j++)g+=line(x+j*3.8,85,x+j*3.8,j===5?73:78,'#647e90',j===5?1.5:1)}g+=`<path d="M 35 63 V 47 H ${35+cm*38} V 63" stroke="#cb821e" stroke-width="4" fill="none"/>`+label(35+cm*19,38,`${cm} cm`,'fc190-svg-label fc190-svg-strong')+label(225,184,`${cm} cm = ${cm*10} mm`,'fc190-svg-label fc190-svg-strong');title=`${cm} Zentimeter auf dem Lineal`;answer=`${cm*10} mm`;steps=['Lege den Anfang des Gegenstands an die 0 des Lineals.',`Lies die Markierung bei ${cm} cm ab.`,`Jeder Zentimeter hat zehn Millimeter. Deshalb: ${cm} · 10 = ${cm*10} mm.`];question=`Wie viele Millimeter sind ${cm+1} cm?`;solution=String((cm+1)*10)+' mm';description='Zentimeterlineal mit Millimeter-Hilfsstrichen.';
 }else if(type==='time'){
  const [h,m,plus]=p;const hh=h%12,angleM=2*Math.PI*m/60,angleH=2*Math.PI*(hh+m/60)/12;const cx=155,cy=123,r=89;g+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbfdff" stroke="#29536b" stroke-width="3"/>`;for(let n=1;n<=12;n++){const a=(n/12)*2*Math.PI-Math.PI/2;g+=label(cx+72*Math.cos(a),cy+72*Math.sin(a)+5,n,'fc190-svg-label')};g+=line(cx,cy,cx+52*Math.sin(angleH),cy-52*Math.cos(angleH),'#bd7919',6)+line(cx,cy,cx+74*Math.sin(angleM),cy-74*Math.cos(angleM),'#156f9a',3)+mark(cx,cy,5);const total=h*60+m+plus,fh=Math.floor(total/60)%24,fm=total%60;title=`Von ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} Uhr ${plus} Minuten weiter`;answer=`${String(fh).padStart(2,'0')}:${String(fm).padStart(2,'0')} Uhr`;g+=label(335,102,`+ ${plus} min`,'fc190-svg-label fc190-svg-strong')+label(335,153,answer,'fc190-svg-label');steps=[`Lies die Anfangszeit ab: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} Uhr.`,`Zähle ${plus} Minuten weiter. Nach 60 Minuten beginnt eine neue Stunde.`,`Die neue Uhrzeit ist ${answer}.`];question=`Wie viele Minuten hat eine volle Stunde?`;solution='60 Minuten';description='Analoge Uhr mit Stunden- und Minutenzeiger.';
 }else if(type==='written'){
  const [op,a,b]=p;const val=op==='+'?a+b:op==='-'?a-b:a*b;g+=label(224,55,`Rechne Stelle für Stelle`);g+=label(210,101,a,'fc190-svg-label fc190-svg-strong','end')+label(166,136,op,'fc190-svg-label fc190-svg-strong')+label(210,136,b,'fc190-svg-label fc190-svg-strong','end')+line(105,148,240,148,'#2b506a',2)+label(210,179,val,'fc190-svg-label fc190-svg-strong','end')+label(329,126,'Einer unter Einer!','fc190-svg-label fc190-svg-small');title=`Schriftlich: ${a} ${op} ${b}`;answer=val;steps=op==='×'?[`Schreibe ${a} und ${b} stellengerecht auf.`,`Rechne zunächst ${a} · ${b}. Wenn du nach Stellen rechnest, achte auf die Zehner und Einer.`,`Das Ergebnis ist ${val}. Kontrolliere es mit einer Überschlagsrechnung.`]:[`Schreibe ${a} und ${b} untereinander, sodass Einer genau unter Einern stehen.`,`Beginne rechts bei den Einern. Danach kommen Zehner und Hunderter.`,`Bei einem Übertrag oder Entbündeln schreibst du die Hilfsziffer mit.`,`Das Ergebnis ist ${val}. Prüfe mit der Umkehraufgabe.`];question=op==='+'?`Welche Umkehraufgabe prüft ${a} + ${b}?`:op==='-'?`Welche Addition prüft ${a} − ${b}?`:`Welche Division prüft ${a} · ${b}?`;solution=op==='+'?`${a+b} − ${b} = ${a}`:op==='-'?`${a-b} + ${b} = ${a}`:`${a*b} : ${b} = ${a}`;description='Stellengerecht untereinander geschriebene Rechnung.';
 }else if(type==='area'){
  const [w,h]=p;const side=Math.min(31,170/Math.max(w,h));const left=83,top=31;for(let row=0;row<h;row++)for(let col=0;col<w;col++)g+=rect(left+col*side,top+row*side,side-1,side-1,(row+col)%2?'#92c9dd':'#4f9db7','#fff');g+=label(left+w*side/2,top+h*side+32,`Länge ${w}`)+label(left-30,top+h*side/2,`Breite ${h}`,'fc190-svg-label fc190-svg-small')+label(338,70,`A = ${w*h}`,'fc190-svg-label fc190-svg-strong')+label(338,108,`U = ${2*(w+h)}`,'fc190-svg-label fc190-svg-strong');title=`Rechteck: ${w} mal ${h} Kästchen`;answer=`Fläche ${w*h} FE · Umfang ${2*(w+h)} LE`;steps=[`Zähle ${w} Kästchen in einer Reihe und ${h} Reihen.`,`Fläche = Länge · Breite = ${w} · ${h} = ${w*h} Flächeneinheiten.`,`Umfang = alle vier Seiten zusammen = ${w} + ${h} + ${w} + ${h} = ${2*(w+h)} Längeneinheiten.`,`Fläche und Umfang haben unterschiedliche Einheiten: etwa cm² und cm.`];question=`Wie viele Kästchen mehr sind es, wenn das Rechteck eine Reihe mehr hat?`;solution=`${w} Kästchen`;description='Rechteck aus Einheitsquadraten mit Länge und Breite.';
 }else if(type==='priority'){
  let expression,inner,last;if(p[3]==='+×'){expression=`${p[0]} + ${p[1]} · ${p[2]}`;inner=p[1]*p[2];last=p[0]+inner;steps=[`Rechne zuerst die Malaufgabe: ${p[1]} · ${p[2]} = ${inner}.`,`Dann addiere: ${p[0]} + ${inner} = ${last}.`]}else if(p[3]==='-÷'){expression=`${p[0]} − ${p[1]} : ${p[2]}`;inner=p[1]/p[2];last=p[0]-inner;steps=[`Rechne zuerst die Geteiltaufgabe: ${p[1]} : ${p[2]} = ${inner}.`,`Dann rechne ${p[0]} − ${inner} = ${last}.`]}else if(p[3]==='(+ )×'){expression=`(${p[0]} + ${p[1]}) · ${p[2]}`;inner=p[0]+p[1];last=inner*p[2];steps=[`Berechne zuerst die Klammer: ${p[0]} + ${p[1]} = ${inner}.`,`Dann multipliziere: ${inner} · ${p[2]} = ${last}.`]}else if(p[3]==='÷+'){expression=`${p[0]} : ${p[1]} + ${p[2]}`;inner=p[0]/p[1];last=inner+p[2];steps=[`Berechne zuerst die Division: ${p[0]} : ${p[1]} = ${inner}.`,`Dann addiere: ${inner} + ${p[2]} = ${last}.`]}else{expression=`${p[0]} · (${p[1]} − ${p[2]})`;inner=p[1]-p[2];last=p[0]*inner;steps=[`Berechne zuerst die Klammer: ${p[1]} − ${p[2]} = ${inner}.`,`Dann multipliziere: ${p[0]} · ${inner} = ${last}.`]}title=`Die Reihenfolge: ${expression}`;answer=last;g+=label(230,51,expression,'fc190-svg-label fc190-svg-strong')+label(230,115,`1. zuerst: ${fmt(inner)}`,'fc190-svg-label')+line(90,137,370,137,'#6595ae',2)+label(230,180,`2. Ergebnis: ${fmt(last)}`,'fc190-svg-label fc190-svg-strong');question='Was rechnest du zuerst?';solution=expression.includes('(')?'Die Klammer.':'Mal oder Geteilt vor Plus oder Minus.';description='Zwei Rechenschritte mit sichtbarer Reihenfolge.';
 }else if(type==='angle'){
  const n=p,cx=105,cy=164,r=95,rad=n*Math.PI/180;const ex=cx+Math.cos(rad)*r,ey=cy-Math.sin(rad)*r;g+=line(cx,cy,cx+140,cy,'#2c526a',4)+line(cx,cy,ex,ey,'#197aa5',4)+`<path d="M ${cx+44} ${cy} A 44 44 0 ${n>180?1:0} 0 ${cx+44*Math.cos(rad)} ${cy-44*Math.sin(rad)}" fill="none" stroke="#c37b15" stroke-width="4"/>`+mark(cx,cy,5)+label(297,88,`${n}°`,'fc190-svg-label fc190-svg-strong')+label(308,120,n<90?'spitzer Winkel':n===90?'rechter Winkel':n<180?'stumpfer Winkel':'gestreckter Winkel');title=`Winkel mit ${n} Grad`;answer=`${n}°`;steps=['Ein Winkel besteht aus zwei Schenkeln mit demselben Anfangspunkt.','Der gemeinsame Anfangspunkt heißt Scheitelpunkt.',`Zwischen den Schenkeln liegen ${n} Grad. ${n===90?'Das ist genau ein Viertel einer Drehung.':n===180?'Das ist eine halbe Drehung.':n<90?'Das ist weniger als ein rechter Winkel.':'Das ist mehr als ein rechter Winkel.'}`];question='Wie viele Grad hat ein rechter Winkel?';solution='90°';description='Winkelschenkel und orangefarbener Winkelbogen.';
 }else if(type==='decimal'){
  const [op,a,b]=p;const c=op==='+'?a+b:op==='-'?a-b:op==='×'?a*b:a/b;const F=n=>fmt(n);g+=label(225,62,`${F(a)} ${op} ${F(b)}`,'fc190-svg-label fc190-svg-strong')+label(225,111,'Einer  |  Zehntel  |  Hundertstel')+label(225,164,`= ${F(c)}`,'fc190-svg-label fc190-svg-strong');title=`Dezimalzahlen: ${F(a)} ${op} ${F(b)}`;answer=F(c);steps=op==='+'||op==='-'?[`Schreibe die Zahlen mit den Kommas untereinander: ${F(a)} und ${F(b)}.`,`Du kannst fehlende Stellen mit einer Null auffüllen, etwa ${F(a)} = ${F(a).includes(',')?F(a):F(a)+',0'}.`,`Rechne ${op==='+'?'zusammen':'die zweite Zahl weg'} und setze das Komma an dieselbe Stelle.`,`Ergebnis: ${F(a)} ${op} ${F(b)} = ${F(c)}.`]:[`Überlege zunächst, wie groß das Ergebnis ungefähr sein muss.`,`Rechne die Aufgabe ${F(a)} ${op} ${F(b)} = ${F(c)}.`,`Kontrolliere das Ergebnis mit der Umkehraufgabe und achte auf die Kommastellen.`];question=`Wie schreibt man ${F(c)} mit einer zusätzlichen Null am Ende, ohne den Wert zu ändern?`;solution=F(c)+(F(c).includes(',')?'0':',0');description='Dezimalzahlen mit Stellenwerten und Ergebnis.';
 }else if(type==='percent'){
  const [perc,base]=p;for(let i=0;i<100;i++)g+=rect(26+(i%10)*17,21+Math.floor(i/10)*17,16,16,i<perc?'#2983a8':'#e6eef3','#fff');const val=base*perc/100;g+=label(320,70,`${perc} % von ${fmt(base)}`,'fc190-svg-label fc190-svg-strong')+label(320,112,`= ${fmt(val)}`,'fc190-svg-label fc190-svg-strong')+label(320,163,`${perc} von 100 Feldern`,'fc190-svg-label fc190-svg-small');title=`${perc} Prozent von ${fmt(base)}`;answer=fmt(val);steps=[`Prozent bedeutet von hundert: ${perc} von 100 Feldern sind blau.`,`1 % von ${fmt(base)} = ${fmt(base/100)}.`,`Für ${perc} % multiplizierst du mit ${perc}: ${fmt(base/100)} · ${perc} = ${fmt(val)}.`,`Prüfe: Bei 50 % muss die Hälfte herauskommen.`];question=`Wie viel sind 100 % von ${fmt(base)}?`;solution=fmt(base);description=`10 mal 10 Felder, ${perc} davon eingefärbt.`;
 }else if(type==='ratio'){
  const [items,cost,want]=p,unit=cost/items,ans=unit*want;const W=140;g+=['Menge','Preis'].map((t,i)=>rect(45+i*W,40,W-3,39,'#dcecf4')+label(45+i*W+69,66,t)).join('');g+=rect(45,81,138,40,'#fff','#a8cbd9')+rect(185,81,138,40,'#fff','#a8cbd9')+label(113,106,items)+label(254,106,`${fmt(cost)} €`);g+=rect(45,122,138,40,'#e7f5ed','#a8cbd9')+rect(185,122,138,40,'#e7f5ed','#a8cbd9')+label(113,147,'1')+label(254,147,`${fmt(unit)} €`);g+=rect(45,163,138,40,'#fff','#a8cbd9')+rect(185,163,138,40,'#fff','#a8cbd9')+label(113,188,want)+label(254,188,`${fmt(ans)} €`);title=`Dreisatz: ${items} Stück kosten ${cost} €`;answer=`${want} Stück kosten ${fmt(ans)} €`;steps=[`Prüfe, ob der Preis wirklich proportional zur Stückzahl ist.`,`Teile den Gesamtpreis durch die Stückzahl: ${fmt(cost)} € : ${items} = ${fmt(unit)} € je Stück.`,`Multipliziere den Einzelpreis mit ${want}: ${fmt(unit)} € · ${want} = ${fmt(ans)} €.`];question=`Wie viel kostet ein Stück?`;solution=`${fmt(unit)} €`;description='Dreisatztabelle: gegebene Menge, ein Stück, gesuchte Menge.';
 }else if(type==='equation'){
  const [a,b,c]=p,x=(c-b)/a;g+=`<rect x="20" y="62" width="415" height="89" rx="13" fill="#eaf5fa" stroke="#9cc7d5"/>`;let sx=45;for(let i=0;i<a;i++){g+=rect(sx+i*42,94,36,31,'#77bbd7')+label(sx+i*42+18,115,'x')}g+=label(272,112,`+ ${b} = ${c}`,'fc190-svg-label fc190-svg-strong')+label(225,200,`x = ${fmt(x)}`,'fc190-svg-label fc190-svg-strong');title=`Löse ${a}x + ${b} = ${c}`;answer=`x = ${fmt(x)}`;steps=[`Auf beiden Seiten steht der gleiche Wert: ${a}x + ${b} = ${c}.`,`Ziehe auf beiden Seiten ${b} ab: ${a}x = ${c-b}.`,`Teile beide Seiten durch ${a}: x = ${fmt(x)}.`,`Probe: ${a} · ${fmt(x)} + ${b} = ${c}.`];question='Was musst du auf beiden Seiten zuerst machen?';solution=`${b} abziehen.`;description='Gleichung mit gleich großen x-Kästchen und festen Zahlen.';
 }else if(type==='terms'){
  const [a,b]=p;for(let i=0;i<a;i++)g+=rect(24+i*40,50,34,43,'#8bc6e0');for(let i=0;i<b;i++)g+=rect(24+i*40,138,34,43,'#8dcbb7');g+=label(342,72,`${a}x`,'fc190-svg-label fc190-svg-strong')+label(342,155,`+ ${b}x`,'fc190-svg-label fc190-svg-strong')+label(342,212,`= ${a+b}x`,'fc190-svg-label fc190-svg-strong');title=`Gleichartige Terme: ${a}x + ${b}x`;answer=`${a+b}x`;steps=[`Beide Terme enthalten dieselbe Variable x. Deshalb darfst du ihre Anzahlen addieren.`,`Zähle ${a} blaue x-Blöcke und ${b} grüne x-Blöcke.`,`Zusammen sind es ${a+b} x-Blöcke: ${a}x + ${b}x = ${a+b}x.`,`Eine Zahl ohne x wird nicht als x mitgezählt.`];question=`Was ist ${a}x + ${b+1}x?`;solution=`${a+b+1}x`;description='Gleichartige Variablenblöcke zusammenfassen.';
 }else if(type==='linear'){
  const [m,b]=p;g=plot(x=>m*x+b,{xmin:-4,xmax:4,ymin:-5,ymax:7,points:[{x:0,y:b,name:`(0|${b})`},{x:1,y:m+b,name:`(1|${m+b})`}]});title=`Die Gerade y = ${m===1?'':m===-1?'-':m}x ${b<0?'− '+Math.abs(b):'+ '+b}`;answer=`Steigung ${m}; y-Achsenabschnitt ${b}`;steps=[`Der Punkt auf der y-Achse ist (0 | ${b}).`,`Wenn x um 1 wächst, verändert sich y um ${m}.`,`Der zweite Punkt ist deshalb (1 | ${m+b}).`,`Verbinde beide Punkte mit einem Lineal: Eine lineare Funktion ist eine Gerade.`];question='Welchen y-Wert hat die Gerade bei x = 2?';solution=fmt(2*m+b);description='Koordinatensystem mit Geraden, Achsen und zwei markierten Punkten.';
 }else if(type==='binomial'){
  const [a,b]=p;const S=185,x=55,y=30,scale=S/(a+b);g+=rect(x,y,a*scale,a*scale,'#78b7d8')+rect(x+a*scale,y,b*scale,a*scale,'#d9ac63')+rect(x,y+a*scale,a*scale,b*scale,'#d9ac63')+rect(x+a*scale,y+a*scale,b*scale,b*scale,'#7bb99b');g+=label(x+a*scale/2,y+a*scale/2,`${a}²`)+label(x+a*scale+b*scale/2,y+a*scale/2,`${a}·${b}`)+label(x+a*scale/2,y+a*scale+b*scale/2,`${a}·${b}`)+label(x+a*scale+b*scale/2,y+a*scale+b*scale/2,`${b}²`);g+=label(343,81,`(${a}+${b})²`,'fc190-svg-label fc190-svg-strong')+label(343,121,`= ${(a+b)**2}`,'fc190-svg-label fc190-svg-strong');title=`(${a} + ${b})² als Flächen`;answer=`${(a+b)**2}`;steps=[`Eine Seite des großen Quadrats ist ${a} + ${b} = ${a+b} lang.`,`Die Gesamtfläche ist ${a+b} · ${a+b} = ${(a+b)**2}.`,`Die vier Teilflächen sind ${a*a}, ${a*b}, ${a*b} und ${b*b}.`,`Darum gilt (a + b)² = a² + 2ab + b².`];question=`Wie viel ist ${a}² + 2·${a}·${b} + ${b}²?`;solution=String((a+b)**2);description='Quadrat, unterteilt in vier Teilflächen.';
 }else if(type==='probability'){
  const [red,blue]=p,total=red+blue;for(let i=0;i<total;i++){const x=46+(i%8)*40,y=58+Math.floor(i/8)*44;g+=`<circle cx="${x}" cy="${y}" r="16" fill="${i<red?'#a64a43':'#1c85af'}" stroke="#fff" stroke-width="2"/>`+label(x,y+5,i<red?'R':'B','fc190-svg-label fc190-svg-small');}g+=label(282,180,`${red} von ${total}`,'fc190-svg-label fc190-svg-strong')+label(282,212,`${fmt(red/total*100)} %`,'fc190-svg-label');title=`Eine rote Kugel ziehen (${red} von ${total})`;answer=`${red}/${total} = ${fmt(red/total*100)} %`;steps=[`Insgesamt liegen ${total} Kugeln bereit.`,`Davon sind ${red} rot.`,`Bei einer zufälligen Ziehung mit gleich wahrscheinlichen Kugeln ist die Chance ${red}/${total}.`,`Als Prozentsatz ergibt das ${fmt(red/total*100)} %. Bei mehr Versuchen schwankt das Ergebnis trotzdem.`];question='Wie viele Kugeln sind nicht rot?';solution=String(blue);description='Kugeln mit Beschriftung R und B; günstige und alle Möglichkeiten.';
 }else if(type==='pythagoras'||type==='trig'){
  const [a,b,c]=p,x=70,y=202,scale=155/Math.max(a,b),tx=x+a*scale,ty=y,ux=x,uy=y-b*scale;g+=`<polygon points="${x},${y} ${tx},${ty} ${ux},${uy}" fill="#ecf7fc" stroke="#2d5b77" stroke-width="3"/>`+`<path d="M 70 185 L 87 185 L 87 202" fill="none" stroke="#bd7e26" stroke-width="2.5"/>`+label((x+tx)/2,222,`a = ${a}`)+label(49,(y+uy)/2,`b = ${b}`)+label((tx+ux)/2+16,(ty+uy)/2-8,`c = ${c}`)+label(104,193,'90°','fc190-svg-label fc190-svg-small');if(type==='pythagoras'){
  title=`Rechtwinkliges Dreieck: ${a}, ${b}, ${c}`;answer=`c = ${c}`;steps=[`Suche zuerst den rechten Winkel: Er beträgt 90 Grad.`,`Die beiden kürzeren Seiten heißen Katheten. Hier: a = ${a}, b = ${b}.`,`Rechne a² + b² = ${a*a} + ${b*b} = ${c*c}.`,`Ziehe die Quadratwurzel: c = √${c*c} = ${c}.`];question=`Was ist ${a}² + ${b}²?`;solution=String(c*c);
  }else{const deg=Math.atan2(b,a)*180/Math.PI;title=`Sinus, Kosinus und Tangens bei einem Dreieck`;answer=`sin α = ${fmt(b/c)}; cos α = ${fmt(a/c)}`;g+=label(260,84,`α ≈ ${fmt(deg)}°`,'fc190-svg-label')+label(300,126,`sin α = ${b}/${c}`,'fc190-svg-label');steps=[`Wähle den Winkel α unten rechts. Der rechte Winkel bleibt bei 90°.`,`Die Gegenkathete liegt gegenüber von α: sie ist ${b} lang.`,`Die Ankathete liegt an α: sie ist ${a} lang. Die Hypotenuse ist ${c} lang.`,`sin α = Gegenkathete : Hypotenuse = ${b}/${c} = ${fmt(b/c)}.`,`cos α = Ankathete : Hypotenuse = ${a}/${c} = ${fmt(a/c)}.`];question='Wie groß ist tan α = Gegenkathete : Ankathete?';solution=fmt(b/a);}
  description='Schematisches rechtwinkliges Dreieck mit markierten Seiten und rechtem Winkel; nicht maßstabsgetreu.';
 }else if(type==='quadratic'||type==='quadEq'){
  const [a,h,k]=p;const roots=type==='quadEq'?Math.sqrt(-k/a):null;let ps=type==='quadEq'?[{x:h-roots,y:0,name:`x₁ = ${fmt(h-roots)}`},{x:h+roots,y:0,name:`x₂ = ${fmt(h+roots)}`},{x:h,y:k,name:'S'}]:[{x:h,y:k,name:`S(${h}|${k})`}];g=plot(x=>a*(x-h)**2+k,{xmin:-5,xmax:5,ymin:Math.min(-6,k-1),ymax:Math.max(9,k+9),points:ps});title=type==='quadEq'?`Nullstellen der Parabel finden`:`Parabel mit Scheitelpunkt S(${h}|${k})`;answer=type==='quadEq'?`x₁ = ${fmt(h-roots)}, x₂ = ${fmt(h+roots)}`:`S(${h}|${k})`;steps=type==='quadEq'?[`Gesucht sind die Stellen mit y = 0. Im Bild sind das die Punkte auf der x-Achse.`,`Die Gleichung lautet (${a} · (x − ${h})²) ${k<0?'− '+Math.abs(k):'+ '+k} = 0.`,`Stelle um: (x − ${h})² = ${fmt(-k/a)}.`,`Ziehe die Wurzel mit beiden Vorzeichen: x = ${h} ± ${fmt(roots)}.`,`Die beiden Lösungen sind ${fmt(h-roots)} und ${fmt(h+roots)}.`]:[`Die Funktionsgleichung steht in Scheitelpunktform: y = ${a}(x − ${h})² ${k<0?'− '+Math.abs(k):'+ '+k}.`,`Der Scheitelpunkt liegt bei S(${h} | ${k}).`,`Der Graph ist eine Parabel und öffnet sich bei a > 0 nach oben.`,`Du kannst weitere Punkte berechnen und die Kurve zeichnen.`];question=type==='quadEq'?'Wie viele Schnittpunkte mit der x-Achse zeigt die Zeichnung?':'Wo liegt der tiefste Punkt der Parabel?';solution=type==='quadEq'?'Zwei Schnittpunkte.':`S(${h}|${k})`;description='Koordinatensystem mit Parabel, Achsen und markierten Punkten.';
 }else if(type==='systems'){
  const [m1,b1,m2,b2]=p;const x=(b2-b1)/(m1-m2),y=m1*x+b1;g=plot(z=>m1*z+b1,{xmin:-4,xmax:4,ymin:-5,ymax:7,extra:{fn:z=>m2*z+b2},points:[{x,y,name:`S(${fmt(x)}|${fmt(y)})`}]});title=`Schnittpunkt von zwei Geraden`;answer=`S(${fmt(x)} | ${fmt(y)})`;steps=[`Erste Gerade: y = ${m1}x ${b1<0?'− '+Math.abs(b1):'+ '+b1}.`,`Zweite Gerade: y = ${m2}x ${b2<0?'− '+Math.abs(b2):'+ '+b2}.`,`Am Schnittpunkt sind die y-Werte gleich. Also ${m1}x + (${b1}) = ${m2}x + (${b2}).`,`Daraus ergibt sich x = ${fmt(x)} und y = ${fmt(y)}.`,`Die Probe erfüllt beide Gleichungen.`];question='Wie heißt der gemeinsame Punkt zweier nicht paralleler Geraden?';solution='Schnittpunkt';description='Zwei farbige Geraden und ihr gemeinsamer Schnittpunkt.';
 }else if(type==='growth'){
  const [start,factor,n]=p;const vals=Array.from({length:n+1},(_,i)=>start*factor**i);const hi=Math.max(...vals);const bw=Math.floor(320/vals.length);for(let i=0;i<vals.length;i++){const hh=158*vals[i]/hi;g+=rect(30+i*bw,200-hh,bw-8,hh,'#3c9ab9')+label(30+i*bw+(bw-8)/2,216,i,'fc190-svg-label fc190-svg-small')+label(30+i*bw+(bw-8)/2,190-hh,fmt(vals[i]),'fc190-svg-label fc190-svg-small');}title=`Wiederholt mit ${fmt(factor)} multiplizieren`;answer=`Nach ${n} Schritten: ${fmt(vals[n])}`;steps=[`Am Anfang hast du ${fmt(start)}.`,`In jedem Schritt multiplizierst du mit ${fmt(factor)}.`,`Die Werte sind ${vals.map(fmt).join(' → ')}.`,`Allgemeine Formel: Anfangswert · Faktor^(Anzahl Schritte).`,`Das Endergebnis nach ${n} Schritten lautet ${fmt(vals[n])}.`];question=`Wie lautet der Wert nach nur einem Schritt?`;solution=fmt(start*factor);description='Säulendiagramm mit Anfangswert und Veränderungen je Schritt.';
 }else if(type==='statistics'){
  const vals=p,mean=vals.reduce((a,b)=>a+b,0)/vals.length,sort=[...vals].sort((a,b)=>a-b),med=sort[2];const max=Math.max(...vals);for(let i=0;i<vals.length;i++){const h=150*vals[i]/max;g+=rect(40+i*69,197-h,45,h,'#4c9cba')+label(40+i*69+22,216,'Wert '+(i+1),'fc190-svg-label fc190-svg-small')+label(40+i*69+22,184-h,vals[i]);}title=`Fünf Messwerte auswerten`;answer=`Mittelwert ${fmt(mean)} · Median ${fmt(med)}`;steps=[`Die Werte sind: ${vals.join(', ')}.`,`Addiere sie: ${vals.join(' + ')} = ${vals.reduce((a,b)=>a+b,0)}.`,`Teile durch 5: Mittelwert = ${fmt(mean)}.`,`Sortiert: ${sort.join(', ')}. Der mittlere Wert ist der Median ${fmt(med)}.`,`Prüfe bei Diagrammen immer, ob die Achse bei 0 startet.`];question=`Was ist der größte gemessene Wert?`;solution=String(max);description='Fünf Balken mit Werten und einer Achse ab null.';
 }else return null;
 return result(title,answer,steps,svg(description,g),note,question,solution);
}
function renderLab(){
 const l=typeof state==='object'&&state.lesson;if(!l||l.subject!=='Mathe')return;
 const body=document.querySelector('#reader .reader-body');if(!body)return;
 body.querySelector('.fc190-lab')?.remove();
 let kind=LESSON_KIND[l.id];if(!kind){kind='number';}
 // Existing, fully interactive fraction circles remain the primary visual learning aid.
 if(kind==='fraction')return;
 let presets=PRESETS[kind];
 if(kind==='written'&&l.id==='fc16_004')presets=[['×',23,4],['×',34,6],['×',127,3],['×',215,4],['×',42,8]];
 if(kind==='written'&&l.id==='l10')presets=[['+',247,135],['-',548,216],['+',368,257],['-',705,387],['+',146,328]];
 if(!presets||presets.length!==5)return;
 const root=document.createElement('section');root.className='fc190-lab';root.setAttribute('aria-label','Mathe mit Bildern und ausführlichen Rechenschritten');
 const header=`<span class="fc190-eyebrow">Mathe-Werkstatt · Klasse ${l.grade}</span><h2>Mit Bildern verstehen: ${txt(l.title)}</h2><p class="fc190-lead">${txt(INTROS[kind]||FALLBACK)}</p><div class="fc190-help"><strong>So lernst du hier</strong><p>Wähle eines der fünf Beispiele. Betrachte zuerst das Bild. Lies danach die Rechenschritte nacheinander. Du darfst das Beispiel beliebig oft wiederholen.</p></div>`;
 root.innerHTML=header+`<div class="fc190-pick" role="group" aria-label="Fünf Mathebeispiele">${presets.map((p,i)=>`<button type="button" data-fc190-case="${i}" aria-pressed="false">Beispiel ${i+1}</button>`).join('')}</div><div class="fc190-sample" aria-live="off"></div><div class="fc190-nav"><button type="button" data-fc190-nav="back">← Zurück</button><span role="status" aria-live="polite"></span><button type="button" data-fc190-nav="next">Weiter →</button></div><div class="fc190-takeaway"><strong>Merke:</strong> Ein Bild soll dir den Rechenweg verständlich machen. Kontrolliere deine Antwort danach mit einer Rechnung im Heft.</div>`;
 const support=body.querySelector('.fc-support');if(support)body.insertBefore(root,support);else body.prepend(root);
 let n=0;const target=root.querySelector('.fc190-sample'),buttons=[...root.querySelectorAll('[data-fc190-case]')],counter=root.querySelector('.fc190-nav span');
 const paint=()=>{
  const info=visual(kind,presets[n]);
  if(info&&l.id==='fc15_013'){const [a,b]=presets[n];info.steps.push(`Die Umkehraufgabe zur Malaufgabe ist ${a*b} : ${a} = ${b}. So kannst du das Ergebnis prüfen.`);}
  if(info&&l.id==='fc15_012')info.steps.unshift('Schätze zuerst, wie lang der Gegenstand sein könnte. Danach legst du das Lineal an.');
  if(!info){target.textContent='Zu diesem Thema ist noch keine passende Zeichnung verfügbar.';return;}
  buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
  counter.textContent=`Beispiel ${n+1} von 5`;
  const steps=info.steps.map(x=>`<li>${txt(x)}</li>`).join('');
  target.innerHTML=`<div class="fc190-case-title">${txt(info.title)}</div><div class="fc190-drawing">${info.drawing}</div><div class="fc190-answer"><span>Ergebnis</span><strong>${txt(info.answer)}</strong></div><h3>Schritt für Schritt</h3><ol class="fc190-steps">${steps}</ol>${info.note?`<p class="fc190-takeaway">${txt(info.note)}</p>`:''}<div class="fc190-practice"><p><strong>Jetzt bist du dran:</strong> ${txt(info.question)}</p><details><summary>Lösung anzeigen</summary><p><strong>Antwort:</strong> ${txt(info.solution)}</p></details></div>`;
 };
 root.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b)return;
  if(b.dataset.fc190Case!==undefined)n=Number(b.dataset.fc190Case);
  else if(b.dataset.fc190Nav==='next')n=(n+1)%5;
  else if(b.dataset.fc190Nav==='back')n=(n+4)%5;
  else return;
  paint();
 });
 paint();
}
const previous=renderReader;renderReader=function(){previous();renderLab()};
if(state.lesson)renderLab();
})();


;

/* FixClever 2.3.1 – Epochen-Zeitleiste, lokal und barrierearm */
(()=>{
  'use strict';
  const groups=Object.freeze({
    'Vorgeschichte':'Steinwerkzeuge, Siedlungen und Metalle',
    'Altes Ägypten':'Nil, Pyramiden und Hieroglyphen',
    'Antikes Griechenland':'Poleis, Demokratie und Alexander',
    'Kelten und Germanen':'Vielfältige Gemeinschaften Europas',
    'Römisches Reich':'Republik, Kaiser und Alltag',
    'Mittelalter':'Ritter, Burgen, Bauern und Städte',
    'Frühe Neuzeit':'Buchdruck, Weltkontakte und Reformation',
    'Neuzeit':'Aufklärung, Revolution und Napoleon',
    '19. Jahrhundert':'Industrialisierung und Nationalstaaten',
    '20. Jahrhundert':'Weltkriege und Diktatur',
    'Nachkriegszeit':'Teilung, Wiedervereinigung und Europa',
    'Nach 1945':'Kalter Krieg, Teilung und Einheit',
    'NS-Zeit und Zweiter Weltkrieg':'Unrecht, Weltkrieg und Erinnerung',
    'Geschichte erforschen':'Quellen, Karten und Zeitleisten'
  });
  const art={
    'Altes Ägypten':'<path d="M16 64 68 9l52 55z" fill="#ead2a0" stroke="#9e6b32" stroke-width="3"/><path d="M133 8v54" stroke="#56a7be" stroke-width="5"/>',
    'Römisches Reich':'<path d="M10 20h115M19 27v39m25-39v39m25-39v39m25-39v39m24-39v39M8 66h120" stroke="#a57b58" stroke-width="7"/><path d="M10 18 68 1l58 17z" fill="#ded6c9"/>',
    'Mittelalter':'<path d="M10 65V29h14V15h18v14h15V9h22v20h13V16h19v13h15v36z" fill="#e6d5bc" stroke="#745a46" stroke-width="3"/><path d="M55 65V47a12 12 0 0 1 24 0v18" fill="#866955"/>',
    'Kelten und Germanen':'<path d="M71 38C55 6 22 19 33 45s52 20 59-1-14-34-29-22" fill="none" stroke="#5b967f" stroke-width="7" stroke-linecap="round"/>',
    'default':'<path d="M14 39h124m-111-9v18m33-18v18m33-18v18m34-18v18" stroke="#428870" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="39" r="9" fill="#edb86d"/>'
  };
  const list=LESSONS.filter(l=>l.subject==='Geschichte'&&l.fcHistory);
  if(!list.length)return;
  function escape(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function insertHistory(){
    const l=state.lesson;
    if(!l||l.subject!=='Geschichte'||!l.fcHistory)return;
    const root=document.querySelector('#reader .reader-body');
    if(!root||document.querySelector('#fc-history-panel'))return;
    const eras={};
    list.forEach(lesson=>{(eras[lesson.historyEra]??=[]).push(lesson);});
    const groupsHtml=Object.keys(groups).filter(name=>eras[name]?.length).map(name=>
      `<optgroup label="${escape(name)}">${eras[name].map(x=>`<option value="${escape(x.id)}" ${x.id===l.id?'selected':''}>Klasse ${x.grade}: ${escape(x.title)}</option>`).join('')}</optgroup>`
    ).join('');
    const ill=art[l.historyEra]||art.default;
    const panel=document.createElement('section');
    panel.id='fc-history-panel';panel.className='fc-hist-top';
    panel.innerHTML=`<div class="fc-hist-caption">Deine Zeitreise durch die Geschichte</div>
    <div class="fc-hist-period"><span class="fc-hist-era">${escape(l.historyEra)}</span><span class="fc-hist-date">${escape(l.historyDate)}</span></div>
    <div class="fc-hist-illustration"><svg viewBox="0 0 150 75" role="img" aria-label="Epochen-Zeichnung" xmlns="http://www.w3.org/2000/svg">${ill}</svg><span>${escape(groups[l.historyEra]||'Geschichte Schritt für Schritt verstehen')}</span></div>
    <div class="fc-hist-rail" aria-hidden="true"></div>
    <label for="fc-hist-jump"><strong>Zu einem anderen Geschichtsthema wechseln</strong></label>
    <select class="fc-hist-select" id="fc-hist-jump" aria-label="Geschichtsthema auf der Zeitleiste wählen">${groupsHtml}</select>
    <p class="fc-hist-help"><strong>Lerntipp:</strong> Lies zuerst die Zeitangabe. Überlege dann: Was passierte? Warum geschah es? Welche Folgen hatte es?</p>`;
    root.prepend(panel);
    panel.querySelector('#fc-hist-jump').addEventListener('change',e=>{
       const id=e.currentTarget.value;
       if(list.some(x=>x.id===id))openLesson(id);
    });
    const foot=document.createElement('section');
    foot.className='fc-hist-sources';
    foot.innerHTML='<h3>Quellen richtig prüfen</h3><p>Ein Brief, eine Münze oder ein alter Gegenstand ist eine historische Quelle. Frage immer: Von wem stammt sie? Wann entstand sie? Was kann sie zeigen – und was wissen wir noch nicht?</p>';
    const box=root.querySelector('.tip-box');
    if(box)box.after(foot);else root.append(foot);
  }
  const beforeList=renderList;
  renderList=function(){
    beforeList();
    document.querySelector('#fc-hist-all-button')?.remove();
    if(state.subject==='Geschichte'&&state.view==='home'){
      const btn=document.createElement('button');
      btn.type='button';btn.id='fc-hist-all-button';btn.className='secondary-button';
      btn.style.margin='0 0 16px';
      btn.textContent=state.all?'Alle Geschichtsthemen der Klassen 5–10 anzeigen: aktiv':'Alle Geschichtsthemen der Klassen 5–10 anzeigen';
      btn.setAttribute('aria-pressed',String(!!state.all));
      btn.addEventListener('click',()=>{state.all=!state.all;document.querySelector('#all-grades').checked=state.all;renderList();});
      const el=document.querySelector('#lesson-list');
      if(el)el.before(btn);
    }
  };
  const before=renderReader;
  renderReader=function(){before();insertHistory();};
  if(state.lesson)insertHistory();
})();

;

/* FixClever 2.3.1 – Musik-Werkstatt. Kein Netzwerk, keine externen Klänge. */
(function(){
'use strict';
const ESC=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TREBLE=[['c’',60,0],['d’',62,1],['e’',64,2],['f’',65,3],['g’',67,4],['a’',69,5],['h’',71,6],['c’’',72,7]];
const BASS=[['c',48,7],['d',50,8],['e',52,9],['f',53,10],['g',55,11],['a',57,12],['h',59,13],['c’',60,14]];
const FAMILIES=[
 ['Saiten','Geige','gestrichene Saiten'],['Saiten','Bratsche','gestrichene Saiten'],['Saiten','Cello','gestrichene Saiten'],['Saiten','Kontrabass','gestrichene oder gezupfte Saiten'],['Saiten','Gitarre','gezupfte oder angeschlagene Saiten'],['Saiten','Harfe','gezupfte Saiten'],
 ['Holzbläser','Blockflöte','Luftstrom an einer Kante'],['Holzbläser','Querflöte','Luftstrom an einer Anblaskante'],['Holzbläser','Klarinette','einfaches Rohrblatt'],['Holzbläser','Oboe','Doppelrohrblatt'],['Holzbläser','Fagott','Doppelrohrblatt'],['Holzbläser','Saxofon','einfaches Rohrblatt'],
 ['Blechbläser','Trompete','schwingende Lippen, Ventile'],['Blechbläser','Horn','schwingende Lippen, Ventile'],['Blechbläser','Posaune','schwingende Lippen, meist Zug'],['Blechbläser','Tuba','schwingende Lippen, Ventile'],
 ['Schlagwerk','Trommel','schwingendes Fell'],['Schlagwerk','Pauke','stimmbares schwingendes Fell'],['Schlagwerk','Xylofon','angeschlagene Holzstäbe'],['Schlagwerk','Becken','angeschlagenes Metall'],
 ['Tasten/Elektronik','Klavier','Hämmer schlagen Saiten an'],['Tasten/Elektronik','Orgel','Luft in Pfeifen oder elektronische Klangerzeugung'],['Tasten/Elektronik','Keyboard','elektronische Tonerzeugung'],['Tasten/Elektronik','Synthesizer','elektronisch erzeugte Klänge']
];
const ARTISTS=[
 ['Hildegard von Bingen','1098–1179','Geistliche Musik des Mittelalters'],['Antonio Vivaldi','1678–1741','Barock, Die vier Jahreszeiten'],['Johann Sebastian Bach','1685–1750','Barock, Orgelmusik und Kantaten'],['Wolfgang Amadeus Mozart','1756–1791','Wiener Klassik, Opern und Konzerte'],['Ludwig van Beethoven','1770–1827','Sinfonien, Sonaten und Streichquartette'],['Fanny Hensel','1805–1847','Lieder und Klavierwerke'],['Clara Schumann','1819–1896','Pianistin und Komponistin der Romantik'],['Louis Armstrong','1901–1971','Jazz-Trompeter und Sänger'],['Billie Holiday','1915–1959','Einflussreiche Jazzsängerin'],['Ella Fitzgerald','1917–1996','Jazzsängerin, bekannt für Scat-Gesang'],['Nina Simone','1933–2003','Sängerin, Pianistin und Bürgerrechtlerin'],['Kraftwerk','seit 1970','Pioniergruppe elektronischer Popmusik']
];
const stateMusic={tab:'noten',clef:'treble',index:2,quiz:false,correct:0,tries:0,timer:null,beat:0,tempo:85};
try{let saved=JSON.parse(localStorage.getItem('fixclever-music-practice-v1')||'{}');stateMusic.correct=Number(saved.correct)||0;stateMusic.tries=Number(saved.tries)||0;}catch{}
let audio=null;
function playMidi(midi,duration=.55){try{let Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Audio nicht verfügbar');audio=audio||new Audio();if(audio.state==='suspended')audio.resume();const frequency=440*Math.pow(2,(midi-69)/12),now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.15,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(audio.destination);osc.start(now);osc.stop(now+duration+.03);return true;}catch(e){textStatus('Tonwiedergabe ist auf diesem Gerät nicht verfügbar. Notenlernen ohne Ton funktioniert weiterhin.');return false;}}
function textStatus(t){const e=document.querySelector('#fc-music-message');if(e)e.textContent=t;}
function notes(){return stateMusic.clef==='bass'?BASS:TREBLE;}
function staffSVG(item){const bass=stateMusic.clef==='bass';const y=128-((item[2]-(bass?4:2))*7.5);const l=[];for(let i=0;i<5;i++){l.push(`<line x1="50" x2="304" y1="${68+i*15}" y2="${68+i*15}" stroke="#40516a" stroke-width="1.8"/>`)}
for(let yy=53;yy>=y;yy-=15){l.push(`<line x1="153" x2="204" y1="${yy}" y2="${yy}" stroke="#40516a" stroke-width="1.6"/>`)}
for(let yy=143;yy<=y;yy+=15){l.push(`<line x1="153" x2="204" y1="${yy}" y2="${yy}" stroke="#40516a" stroke-width="1.6"/>`)}
return `<svg class="fc-music-staff" viewBox="0 0 340 193" role="img" aria-label="Fünf Notenlinien mit einer Note im ${bass?'Bassschlüssel':'Violinschlüssel'}"><rect x="0" y="0" width="340" height="193" rx="16" fill="#fff"/>${l.join('')}<text x="69" y="131" font-family="'Apple Symbols','Noto Music','Segoe UI Symbol',serif" font-size="72" fill="#0b6960">${bass?'𝄢':'𝄞'}</text><ellipse cx="177" cy="${y}" rx="13.5" ry="9" transform="rotate(-15 177 ${y})" fill="#195dba"/><path d="M188 ${y} V${y-51}" stroke="#195dba" stroke-width="2.7"/><text x="170" y="185" font-size="11.5" text-anchor="middle" fill="#577183">${bass?'Bassschlüssel':'Violinschlüssel'} – fünf Linien</text></svg>`}
function scoreSave(){try{localStorage.setItem('fixclever-music-practice-v1',JSON.stringify({correct:stateMusic.correct,tries:stateMusic.tries}));}catch{}}
function piano(){let notesLocal=notes();const whites=notesLocal.map((n,i)=>`<button type="button" class="fc-music-key" data-fc-key="${i}" title="${ESC(n[0])}" aria-label="Taste ${ESC(n[0])}"><span>${ESC(n[0])}</span></button>`).join('');const black=[0,1,3,4,5];return `<div class="fc-music-keyboard" role="group" aria-label="Spielbare Klaviertasten">${whites}${black.map(i=>`<button type="button" data-fc-sharp="${i}" class="fc-music-black" style="left:calc((100% / 8) * ${i+1} - (100% / 30))" aria-label="Schwarze Taste nach ${ESC(notesLocal[i][0])}"></button>`).join('')}</div>`}
function notePanel(){let n=notes()[stateMusic.index],reveal=!stateMusic.quiz;return `<section class="fc-music-grid"><div class="fc-music-score"><h3>${stateMusic.quiz?'Welche Note siehst du?':'Noten im Fünfliniensystem'}</h3>${staffSVG(n)}<p class="fc-music-note-name" id="fc-note-name">${reveal?'Das ist '+ESC(n[0]):'Tippe auf die richtige Klaviertaste.'}</p><div class="fc-music-toolbar"><button type="button" data-fc-c='prev'>← Vorherige</button><button type="button" data-fc-c='hear'>Ton hören <span aria-hidden="true">♪</span></button><button type="button" data-fc-c='next'>Nächste →</button></div></div><div class="fc-music-panel"><h3>Lernen oder üben</h3><p>Die Note sitzt immer auf einer Linie oder in einem Zwischenraum. Von unten nach oben werden die Töne höher. Am Klavier suchst du den gleichen Ton.</p><label class="fc-music-label" for="fc-clef">Notenschlüssel wählen</label><select id="fc-clef"><option value="treble" ${stateMusic.clef==='treble'?'selected':''}>Violinschlüssel</option><option value="bass" ${stateMusic.clef==='bass'?'selected':''}>Bassschlüssel</option></select><div class="fc-music-mode"><button type="button" data-fc-c="learn" aria-pressed="${!stateMusic.quiz}">Noten lernen</button><button type="button" data-fc-c="quiz" aria-pressed="${stateMusic.quiz}">Noten erkennen</button></div><p class="fc-music-progress">Richtig erkannt: <strong>${stateMusic.correct}</strong> von <strong>${stateMusic.tries}</strong> Versuchen</p><p><strong>Merksatz:</strong> Im Violinschlüssel heißt die unterste Linie e’. Im Bassschlüssel ist die unterste Linie G2.</p></div></section><div class="fc-music-piano-wrap"><h3>Dein Klavier – berühre eine Taste</h3>${piano()}<p class="fc-music-footnote">Töne werden ohne Internet mit deinem Gerät erzeugt. Wenn du nichts hörst, prüfe die Lautstärke.</p></div>`}
function rhythmPanel(){let vals=[['𝅝','Ganze Note','4 Schläge'],['𝅗𝅥','Halbe Note','2 Schläge'],['♩','Viertelnote','1 Schlag'],['♪','Achtelnote','½ Schlag'],['𝄽','Viertelpause','1 Schlag Stille']];return `<div class="fc-music-rhythm"><h3>Notenwerte und Pausen verstehen</h3><p>Klatsche zuerst gleichmäßige Viertelschläge. Eine halbe Note dauert zwei dieser Schläge, eine ganze Note vier. Eine Pause lässt einen Schlag still verstreichen.</p><div class="fc-music-values">${vals.map((v,i)=>`<button type="button" data-fc-value="${i}"><span class="fc-music-value-icon">${v[0]}</span><strong>${v[1]}</strong><small>${v[2]}</small></button>`).join('')}</div><h3>Dein Metronom</h3><p>Das Metronom zählt regelmäßig 1 – 2 – 3 – 4. Du kannst dazu klatschen oder einen Rhythmus sprechen.</p><div class="fc-music-beats" id="fc-music-beats"><span>1</span><span>2</span><span>3</span><span>4</span></div><label class="fc-music-label" for="fc-music-tempo">Tempo: <strong id="fc-tempo-label">${stateMusic.tempo}</strong> Schläge pro Minute</label><input id="fc-music-tempo" type="range" min="50" max="170" step="5" value="${stateMusic.tempo}"/><div class="fc-music-toolbar"><button type="button" data-fc-c="metronome">Metronom starten</button><button type="button" data-fc-c="stop">Stopp</button></div></div>`}
function instrumentsPanel(){return `<div class="fc-music-catalog"><h3>Instrumentenfamilien</h3><p>Was bringt den Klang zum Schwingen? So unterscheiden sich die Instrumente. Tippe auf eine Karte und lies ihre Erklärung.</p>${['Saiten','Holzbläser','Blechbläser','Schlagwerk','Tasten/Elektronik'].map(group=>`<h4>${group}</h4><div class="fc-music-cards">${FAMILIES.filter(i=>i[0]===group).map(i=>`<details><summary>${ESC(i[1])}</summary><p>So entsteht der Klang: ${ESC(i[2])}.</p></details>`).join('')}</div>`).join('')}</div>`}
function artistsPanel(){return `<div class="fc-music-catalog"><h3>Musikerinnen, Musiker und Musikgeschichte</h3><p>Geschichte der Musik – vom Mittelalter über Barock und Klassik bis Jazz und elektronische Musik.</p><div class="fc-music-cards">${ARTISTS.map(i=>`<article><strong>${ESC(i[0])}</strong><small>${ESC(i[1])}</small><p>${ESC(i[2])}</p></article>`).join('')}</div></div>`}
function stopMetronome(){if(stateMusic.timer!==null){clearInterval(stateMusic.timer);stateMusic.timer=null;}const b=document.querySelector('[data-fc-c="metronome"]');if(b)b.textContent='Metronom starten';}
function tick(){stateMusic.beat=(stateMusic.beat%4)+1;let spans=document.querySelectorAll('#fc-music-beats span');spans.forEach((s,i)=>s.classList.toggle('active',i===stateMusic.beat-1));playMidi(stateMusic.beat===1?84:76,.08)}
function render(){const d=document.querySelector('#fc-music-dialog');if(!d)return;let body=d.querySelector('#fc-music-content');body.innerHTML=stateMusic.tab==='noten'?notePanel():stateMusic.tab==='rhythm'?rhythmPanel():stateMusic.tab==='instrumente'?instrumentsPanel():artistsPanel();d.querySelectorAll('[data-fc-tab]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.fcTab===stateMusic.tab)));}
const dialog=document.createElement('dialog');dialog.id='fc-music-dialog';dialog.className='fc-music-dialog';dialog.setAttribute('aria-label','FixClever Musik-Werkstatt');dialog.innerHTML=`<div class="fc-music-shell"><header><div><span>FIXCLEVER MUSIK</span><h2>Noten lernen und Musik entdecken</h2><p>Mit Bildern, Ton und einfachen Übungen – auch offline.</p></div><button class="fc-music-close" type="button" data-fc-c="close" aria-label="Musik-Werkstatt schließen">×</button></header><nav class="fc-music-tabs" aria-label="Musik-Werkstatt Bereiche"><button type="button" data-fc-tab="noten">Noten & Klavier</button><button type="button" data-fc-tab="rhythm">Rhythmus</button><button type="button" data-fc-tab="instrumente">Instrumente</button><button type="button" data-fc-tab="musiker">Musiker & Geschichte</button></nav><div id="fc-music-message" class="fc-music-message" role="status" aria-live="polite"></div><main id="fc-music-content"></main><footer>FixClever · Die Musik-Werkstatt funktioniert ohne Internet.</footer></div>`;document.body.append(dialog);dialog.addEventListener('close',stopMetronome);
function openWorkshop(){render();dialog.showModal();dialog.querySelector('.fc-music-close')?.focus();}
function refreshButtons(){let btn=document.querySelector('#fc-music-launch');if(btn)btn.remove();if(state.subject==='Musik'&&state.view==='home'&&!state.lesson){let target=document.querySelector('#lesson-list');if(target){let b=document.createElement('button');b.id='fc-music-launch';b.type='button';b.className='fc-music-launch';b.dataset.fcMusic='open';b.innerHTML='<span aria-hidden="true">♪</span><span><strong>Musik-Werkstatt öffnen</strong><small>Noten erkennen, Klavier spielen, Rhythmus, Instrumente und Musiker</small></span><span aria-hidden="true">→</span>';target.before(b);}}}
function addLessonLink(){let l=state.lesson;if(!l||l.subject!=='Musik')return;let body=document.querySelector('#reader .reader-body');if(!body||body.querySelector('.fc-music-lesson-link'))return;const box=document.createElement('aside');box.className='fc-music-lesson-link';box.innerHTML='<strong>Noten mit Bildern und Ton verstehen</strong><p>In der Musik-Werkstatt kannst du Noten sehen, Töne hören und mit dem Klavier üben.</p><button type="button" data-fc-music="open">Musik-Werkstatt ausprobieren →</button>';body.prepend(box);}
const listPrevious=renderList;renderList=function(){listPrevious();refreshButtons();};
const readerPrevious=renderReader;renderReader=function(){readerPrevious();addLessonLink();};
if(state.lesson)addLessonLink();else refreshButtons();
document.addEventListener('change',e=>{if(e.target.id==='fc-clef'){stateMusic.clef=e.target.value;stateMusic.index=2;render();}if(e.target.id==='fc-music-tempo'){stateMusic.tempo=Number(e.target.value);document.querySelector('#fc-tempo-label').textContent=String(stateMusic.tempo);if(stateMusic.timer!==null){stopMetronome();stateMusic.timer=setInterval(tick,60000/stateMusic.tempo);}}});
document.addEventListener('click',e=>{let trigger=e.target.closest('[data-fc-music]');if(trigger){e.preventDefault();openWorkshop();return;}if(!dialog.open)return;
const tab=e.target.closest('[data-fc-tab]');if(tab){stopMetronome();stateMusic.tab=tab.dataset.fcTab;textStatus('');render();return;}
const k=e.target.closest('[data-fc-key]');if(k){let i=Number(k.dataset.fcKey);playMidi(notes()[i][1]);if(stateMusic.quiz){stateMusic.tries++;let correct=i===stateMusic.index;if(correct)stateMusic.correct++;scoreSave();textStatus(correct?'Richtig! Das ist '+notes()[i][0]+'.':'Noch nicht. Du hast '+notes()[i][0]+' gespielt. Versuch die Note noch einmal.');document.querySelector('.fc-music-progress').innerHTML='Richtig erkannt: <strong>'+stateMusic.correct+'</strong> von <strong>'+stateMusic.tries+'</strong> Versuchen';if(correct){stateMusic.quiz=false;const answer=document.querySelector('#fc-note-name');if(answer)answer.textContent='Richtig erkannt: '+notes()[i][0]+'! Tippe auf „Noten erkennen“ für die nächste Aufgabe.';}}else{textStatus('Gespielt: '+notes()[i][0]+'.');}return;}
const black=e.target.closest('[data-fc-sharp]');if(black){const i=Number(black.dataset.fcSharp);playMidi(notes()[i][1]+1);textStatus('Schwarze Taste: Der Ton liegt einen Halbton über der weißen Taste links.');return;}
const value=e.target.closest('[data-fc-value]');if(value){const names=['Ganze Note: 4 Schläge','Halbe Note: 2 Schläge','Viertelnote: 1 Schlag','Achtelnote: ein halber Schlag','Viertelpause: 1 Schlag Stille'];textStatus(names[Number(value.dataset.fcValue)]);if(Number(value.dataset.fcValue)!==4)playMidi(67,.2);return;}
const a=e.target.closest('[data-fc-c]');if(!a)return;
switch(a.dataset.fcC){case'close':dialog.close();break;case'prev':stateMusic.quiz=false;stateMusic.index=(stateMusic.index+7)%8;render();break;case'next':stateMusic.quiz=false;stateMusic.index=(stateMusic.index+1)%8;render();break;case'hear':playMidi(notes()[stateMusic.index][1]);break;case'learn':stateMusic.quiz=false;render();break;case'quiz':stateMusic.quiz=true;stateMusic.index=Math.floor(Math.random()*8);render();break;case'metronome':if(stateMusic.timer!==null){stopMetronome();}else{stateMusic.beat=0;tick();stateMusic.timer=setInterval(tick,60000/stateMusic.tempo);a.textContent='Metronom anhalten';}break;case'stop':stopMetronome();break;}});
})();


;

/* FixClever 2.3.1 – Grundthemen / Vertiefungen / alle umschalten. */
(function(){
 'use strict';
 const data=window.FC200_CATALOG;
 if(!data||data.total!==3100)return;
 const KEY='fixclever-content-filter-v1';
 let mode='basis';
 try{const v=localStorage.getItem(KEY);if(['basis','vertiefung','all'].includes(v))mode=v;}catch{}
 const rawFiltered=filtered;
 filtered=function(){let items=rawFiltered();if(mode==='basis')items=items.filter(x=>x.kind!=='vertiefung');
 else if(mode==='vertiefung')items=items.filter(x=>x.kind==='vertiefung');return items;};
 const parent=document.querySelector('#topics');
 if(!parent)return;
 const panel=document.createElement('section');panel.className='fc200-panel';panel.setAttribute('aria-label','Lerninhalte auswählen');
 panel.innerHTML=`<div class="fc200-row"><strong>3.100 Lerneinheiten – dein Lernweg</strong><div class="fc200-switch" role="group" aria-label="Art der Lerneinheiten">
 <button type="button" data-fc200="basis">737 Grundthemen</button>
 <button type="button" data-fc200="vertiefung">2.363 Vertiefungen</button>
 <button type="button" data-fc200="all">Alle 3.100</button></div></div>
 <p>Die Grundthemen erklären den Lernstoff. Die Vertiefungen üben einzelne Fragen und Anwendungen dazu. Sie sind keine zusätzlichen offiziellen Lehrplankapitel.</p>
 <div class="fc200-notice" aria-live="polite" id="fc200-status"></div>`;
 parent.insertBefore(panel,parent.firstChild);
 const render=renderList;
 renderList=function(){render();
   panel.querySelectorAll('[data-fc200]').forEach(b=>b.setAttribute('aria-pressed',String(mode===b.dataset.fc200)));
   const curr=filtered();
   const s=document.getElementById('fc200-status');
   s.textContent=curr.length+' Einheiten in dieser Auswahl · '+(mode==='basis'?'Grundthemen':mode==='vertiefung'?'Vertiefungen':'Alle Inhalte');
   // Long search results receive a deliberate page limit to avoid mobile lag.
   const container=document.getElementById('lesson-list');
   if(!container)return;
   const limit=60;
   if(curr.length<=limit)return;
   // Keep pre-existing sorting and card design; render the first part only.
   container.innerHTML=curr.slice(0,limit).map(card).join('')+`<div class="fc200-more"><button type="button" class="secondary-button" data-fc200-more>Weitere Themen laden (${curr.length-limit})</button></div>`;
   container.dataset.fc200Shown=limit;
 };
 panel.addEventListener('click',event=>{
   const b=event.target.closest('[data-fc200]');if(!b)return;
   mode=b.dataset.fc200;
   try{localStorage.setItem(KEY,mode);}catch{}
   renderList();
 });
 document.addEventListener('click',event=>{
   const btn=event.target.closest('[data-fc200-more]');if(!btn)return;
   const list=filtered();const container=document.getElementById('lesson-list');
   const already=Number(container.dataset.fc200Shown)||60;
   const next=Math.min(already+60,list.length);
   const more=container.querySelector('.fc200-more');
   if(!more)return;
   more.insertAdjacentHTML('beforebegin',list.slice(already,next).map(card).join(''));
   more.remove();
   container.dataset.fc200Shown=next;
   if(next<list.length)container.insertAdjacentHTML('beforeend',`<div class="fc200-more"><button type="button" class="secondary-button" data-fc200-more>Weitere Themen laden (${list.length-next})</button></div>`);
 });
 const originalReader=renderReader;
 renderReader=function(){originalReader();const l=state.lesson;
   if(!l||l.kind!=='vertiefung')return;
   const content=document.querySelector('#reader .reader-body');if(!content)return;
   const tag=document.createElement('div');tag.className='fc200-reader-tag';
   const heading=document.createElement('strong');heading.textContent='Vertiefung zum Grundthema: '+l.baseTitle;
   const details=document.createElement('p');details.textContent='Hier steht eine einzelne Frage oder Anwendung im Mittelpunkt. Die zehn Testfragen wiederholen Wissen aus dem dazugehörigen Grundthema.';
   const button=document.createElement('button');button.type='button';button.dataset.lesson=l.baseId;button.textContent='Zum vollständigen Grundthema →';
   tag.append(heading,details,button);
   content.insertBefore(tag,content.firstChild);
 };
 renderList();
})();

;

/* FixClever 2.3.1 – Lernatelier in 100 eigenständigen Lektionen. */
(function(){
const oldReader=renderReader;
renderReader=function(){oldReader();const l=state.lesson;if(!l||!l.fc210)return;
 const reader=document.querySelector('#reader .reader-body');if(!reader)return;
 const box=document.createElement('section');box.className='fc210-banner';box.setAttribute('aria-label','Lernatelier mit geführten Beispielen');
 const heading=document.createElement('h3');heading.textContent='Dein Lernatelier · '+l.subject;
 const intro=document.createElement('p');intro.textContent='Neue eigenständige Lerneinheit – Schritt für Schritt mit fünf Beispielen und zehn Wissensfragen.';
 box.append(heading,intro);
 if(l.subject==='Mathe'){
  const n=document.createElement('div');n.className='fc210-numbers';n.setAttribute('aria-label','Zahlenstrahl zur Orientierung');
  if(l.grade<=3){for(let i=0;i<=20;i+=2){let s=document.createElement('span');s.textContent=i;n.append(s);}box.append(n);}
 }
 if(l.subject==='Mathe'){
  let svg='';let note='';const kind=l.fc210_math_kind;
  if(['frac','equiv','fadd'].includes(kind)){
    svg='<circle cx="100" cy="95" r="67" fill="#eff4fb" stroke="#174b67" stroke-width="2"/>'+
      '<path d="M100 95 L100 28 A67 67 0 0 1 167 95 Z" fill="#348dd2" stroke="#fff" stroke-width="2"/>'+
      '<path d="M100 95 L167 95 A67 67 0 0 1 100 162 Z" fill="#348dd2" stroke="#fff" stroke-width="2"/>'+
      '<path d="M100 95 L100 162 A67 67 0 0 1 33 95 Z" fill="#348dd2" stroke="#fff" stroke-width="2"/>'+
      '<path d="M100 95 L33 95 A67 67 0 0 1 100 28 Z" fill="#ecf1f6" stroke="#fff" stroke-width="2"/>'+
      '<text x="214" y="80" font-size="27" fill="#153d57">3/4</text>';
    note='Bruch-Kreis: drei von vier gleich großen Teilen sind markiert.';
  } else if(['perimeter','area'].includes(kind)){
    svg='<rect x="52" y="35" width="166" height="96" rx="2" fill="#e1f6e9" stroke="#21744f" stroke-width="3"/>'+
      '<text x="135" y="26" text-anchor="middle" font-size="16" fill="#174d36">Länge</text>'+
      '<text x="230" y="87" font-size="16" fill="#174d36">Breite</text>';
    note=kind==='area'?'Die Fläche liegt innerhalb der Figur.':'Der Umfang verläuft außen am Rand.';
  } else if(['triangle','pyth','sine'].includes(kind)){
    svg='<path d="M43 140 L231 140 L231 30 Z" stroke="#236ba2" stroke-width="4" fill="#e0f0fb"/>'+
      '<path d="M215 140 L215 124 L231 124" fill="none" stroke="#e07346" stroke-width="3"/>'+
      '<text x="136" y="162" font-size="15" fill="#15506e">Grundseite</text>'+
      '<text x="237" y="80" font-size="15" fill="#15506e">Höhe</text>';
    note='Die Zeichnung zeigt ein rechtwinkliges Dreieck mit Grundseite und Höhe.';
  } else if(['linear','quadratic'].includes(kind)){
    const curve=kind==='linear'?'<path d="M42 142 L258 35" fill="none" stroke="#217fb1" stroke-width="4"/>':'<path d="M42 25 Q145 245 248 25" fill="none" stroke="#217fb1" stroke-width="4"/>';
    svg='<path d="M28 110 L278 110 M148 162 L148 15" stroke="#546b76" stroke-width="2" fill="none"/>'+curve+
      '<text x="263" y="104" font-size="14" fill="#344e5d">x</text><text x="156" y="19" font-size="14" fill="#344e5d">y</text>';
    note=kind==='linear'?'Bei einer linearen Funktion ergibt sich eine Gerade.':'Der Graph einer quadratischen Funktion kann eine Parabel sein.';
  } else if(['percent','change'].includes(kind)){
    let squares='';for(let i=0;i<100;i++){const x=21+(i%10)*15,y=15+Math.floor(i/10)*15;squares+='<rect x="'+x+'" y="'+y+'" width="13" height="13" rx="1" fill="'+(i<25?'#4a98b8':'#edf1f5')+'" stroke="#c8d4dc"/>';}
    svg=squares+'<text x="193" y="92" font-size="23" fill="#194c63">25 %</text>';
    note='Hunderterfeld: 25 von 100 Kästchen sind gefärbt – das sind 25 Prozent.';
  }
  if(svg){let figure=document.createElement('figure');figure.className='fc210-figure';figure.innerHTML='<svg viewBox="0 0 295 177" role="img" aria-label="'+note+'">'+svg+'</svg><figcaption>'+note+'</figcaption>';box.append(figure);}
 }
 if(l.subject==='Deutsch'){
  const note=document.createElement('p');note.innerHTML='<strong class="fc210-subject-label">Lesetipp:</strong> Lies jede Aufgabe laut, markiere die wichtige Stelle und prüfe den ganzen Satz.';box.append(note);
 }
 if(l.subject==='Englisch'){
  const note=document.createElement('p');note.innerHTML='<strong class="fc210-subject-label">Speaking tip:</strong> Read the English expression aloud. Repeat it slowly before answering.';box.append(note);
 }
 const row=document.createElement('div');row.className='fc210-tools';
 const show=document.createElement('button');show.type='button';show.textContent='Mini-Hilfe anzeigen';show.setAttribute('aria-expanded','false');
 const hint=document.createElement('div');hint.className='fc210-reveal';hint.hidden=true;hint.textContent=l.tip;
 show.addEventListener('click',()=>{hint.hidden=!hint.hidden;show.setAttribute('aria-expanded',String(!hint.hidden));show.textContent=hint.hidden?'Mini-Hilfe anzeigen':'Mini-Hilfe schließen';});
 row.append(show);box.append(row,hint);reader.insertBefore(box,reader.firstChild);
};
})();

;

/* FixClever 2.3.1 · Lernzentrale — without servers, tracking or added dependencies. */
(()=>{
'use strict';
const VERSION='2.3.1', K='fixclever-lernzentrale-v220';
const $=s=>document.querySelector(s);
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const obj=(k,f={})=>{try{const o=JSON.parse(localStorage.getItem(k)||'null');return o&&typeof o==='object'&&!Array.isArray(o)?o:f}catch{return f}};
let settings=obj(K,{selection:'4',target:5,subject:'Alle',simple:true,mode:'plus'});
if(!['4','10'].includes(settings.selection))settings.selection='4';
function saveSettings(){try{localStorage.setItem(K,JSON.stringify(settings))}catch{}}
const subjects=['Alle','Deutsch','Mathe','Englisch','Geschichte','Musik'];
const lesson=id=>LESSONS.find(l=>l.id===id);
const active=()=>typeof child==='function'?child():null;
const attempts=()=>active()?.attempts||[];
const stamp=d=>{const dt=new Date(d);return Number.isNaN(+dt)?'':dt.toLocaleDateString('de-DE')};
const weekStart=()=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d};
const recent=()=>attempts().filter(a=>new Date(a.date)>=weekStart());
const weeklyTarget=()=>Math.min(35,Math.max(1,Number((settings.targets||{})[active()?.id||'default']||settings.target||5)));
const topicBase=()=>LESSONS.filter(l=>l.kind!=='vertiefung');
const counts=()=>{let by={};for(const a of attempts()){const l=lesson(a.lessonId);if(!l)continue;const d=by[a.lessonId]||(by[a.lessonId]=[]);d.push(a)}return by};
const last=a=>[...a].sort((x,y)=>new Date(y.date)-new Date(x.date))[0];
const daysSince=date=>Math.max(0,(Date.now()-new Date(date))/86400000);
function dueItems(){const grouped=counts();let out=[];for(const [id,as] of Object.entries(grouped)){
 const entry=last(as);if(!entry)continue;const successes=as.filter(a=>a.correct>=8).length;const interval=entry.correct<6?1:entry.correct<8?3:[3,7,14,30][Math.min(3,Math.max(0,successes-1))];const remain=interval-daysSince(entry.date);const l=lesson(id);
 if(l)out.push({l,entry,interval,remain});}
 return out.sort((a,b)=>a.remain-b.remain||a.entry.correct-b.entry.correct);
}
function recommendations(){const due=dueItems(), weak=due.filter(x=>x.remain<=0);let pick=weak.slice(0,7).map(x=>x.l);const grade=active()?.grade||state.grade||5;const pool=topicBase().filter(l=>l.grade===grade&&!pick.some(x=>x.id===l.id));let grp=counts();pool.sort((a,b)=>(grp[a.id]?.length||0)-(grp[b.id]?.length||0));pick.push(...pool.slice(0,Math.max(0,7-pick.length)));return pick.slice(0,7)}
function openTopic(id){dialog.close();if(typeof openLesson==='function')openLesson(id)}
function explanation(l){
 const exp=l.explain||[];let ex=(Array.isArray(l.examples)&&l.examples.length?l.examples:[l.example]).filter(Boolean);
 const general=l.subject==='Mathe'?'Schreibe zuerst auf, was gegeben ist. Rechne jeden Zwischenschritt einzeln und prüfe das Ergebnis mit einer Gegenprobe.':l.subject==='Deutsch'?'Lies den gesamten Satz. Markiere die Stelle, die du untersuchen sollst. Lies danach den Satz mit deiner Lösung nochmals laut.':l.subject==='Englisch'?'Lies die englischen Wörter langsam. Achte auf die Wortstellung und suche ein eigenes Beispiel aus deinem Alltag.':'Suche nach Wer, Was, Wann und Warum. Unterscheide Beispiele, Behauptungen und gesicherte Fakten.';
 return `<div class="fc22-reader"><h3>Einfacher Lernweg: ${h(l.title)}</h3><p class="fc22-one"><b>1. Worum geht es?</b><br>${h(exp[0]||l.title)}</p><p class="fc22-two"><b>2. So verstehst du es Schritt für Schritt:</b><br>${h(exp.slice(1).join(' '))||'Lies erst die Erklärung. Versuche dann, das Thema mit eigenen Worten zu beschreiben.'}</p><div class="fc22-one"><b>3. Beispiel gemeinsam ansehen</b><br>${h(ex[0]||l.example||'')}${ex[1]?'<br><b>Zweites Beispiel:</b> '+h(ex[1]):''}</div><p class="fc22-three"><b>4. Was hilft dir bei der Aufgabe?</b><br>${h(general)}</p><p class="fc22-two"><b>5. Merksatz</b><br>${h(l.tip||exp.at(-1)||'Übe in kleinen Schritten.')}</p><p><b>Jetzt du:</b> Denke dir ein eigenes Beispiel aus. Erkläre laut, warum es zum Thema passt.</p><button class="fc22-button secondary" type="button" data-fc22-go="${h(l.id)}">Das Thema im vollständigen Schulbuch ansehen →</button></div>`;
}
let tab='coach',tool='mathe',task=null,game=null,wordIndex=0,englishIndex=0;
const dialog=document.createElement('dialog');dialog.className='fc22-hub';dialog.id='fc22-hub';dialog.setAttribute('aria-label','FixClever Lernzentrale');
dialog.innerHTML=`<header class="fc22-header"><div><small>FIXCLEVER 2.3.1 · OFFLINE</small><h2>Deine Lernzentrale</h2></div><button class="fc22-close" type="button" data-fc22="close" aria-label="Lernzentrale schließen">×</button></header><div role="tablist" class="fc22-tabs" aria-label="Lernbereiche"></div><div class="fc22-content" id="fc22-content"></div>`;
document.body.append(dialog);
const nav=document.querySelector('.sidebar nav');
if(nav){const b=document.createElement('button');b.className='nav-button fc22-nav';b.type='button';b.innerHTML='<span>✦</span> Lernzentrale <small>NEU</small>';b.addEventListener('click',()=>openHub('coach'));nav.append(b)}
const float=document.createElement('button');float.type='button';float.className='fc22-open fc22-float';float.textContent='✦ Lernzentrale';float.addEventListener('click',()=>openHub('coach'));document.body.append(float);
const tabs=[['coach','Lerncoach'],['trainer','Übungstrainer'],['games','Lernspiele'],['plan','Wiederholen'],['stats','Lernstatistik'],['parents','Elternbereich'],['curriculum','NRW-Lehrplan'],['backup','Datensicherung']];
function openHub(t='coach'){tab=t;render();if(!dialog.open)dialog.showModal();dialog.querySelector('.fc22-close')?.focus()}
function render(){dialog.querySelector('.fc22-tabs').innerHTML=tabs.map(([key,label])=>`<button type="button" role="tab" data-fc22-tab="${key}" aria-selected="${String(tab===key)}">${label}</button>`).join('');const content=$('#fc22-content');const fn={coach,trainer,games,plan,stats,parents,curriculum,backup}[tab];content.innerHTML=fn?fn():'';}
function profileNotice(){const p=active();return p?`<p class="fc22-note">Lernprofil: <b>${h(p.name)}</b> · Klasse ${p.grade} · Alle Werte bleiben auf diesem Gerät.</p>`:'<p class="fc22-warn">Für persönliche Empfehlungen bitte zuerst oben in der App ein Kinderprofil anlegen.</p>'}
function summaryBox(){const a=attempts(),week=recent(),mean=a.length?Math.round(100*a.reduce((s,x)=>s+x.correct,0)/(10*a.length)):null;return `<div class="fc22-kpis"><div><strong>${a.length}</strong><small>abgeschlossene Tests</small></div><div><strong>${mean===null?'–':mean+'%'}</strong><small>Antworten richtig</small></div><div><strong>${week.length}</strong><small>Tests diese Woche</small></div></div>`}
function coach(){const picks=recommendations();const due=dueItems().filter(x=>x.remain<=0);return `<h3>Dein persönlicher Lerncoach</h3><p>Deine bisherigen Ergebnisse bestimmen, was du heute wiederholen solltest. Keine KI oder Cloud: Die Empfehlungen entstehen durch feste Regeln direkt auf deinem Gerät.</p>${profileNotice()}${summaryBox()}<div class="fc22-note"><b>Dein Vorschlag für heute</b><br>${due.length?due.length+' bereits geübte Themen sind wieder fällig.':'Starte mit einem neuen Grundthema. Nach den ersten Tests erscheinen hier gezielte Wiederholungen.'}</div><h4>Heute sinnvoll üben</h4><div class="fc22-cards">${picks.map((l,i)=>`<div class="fc22-card"><b>${i+1}. ${h(l.title)}</b><p>${h(l.subject)} · Klasse ${l.grade} · ${h(l.explain[0])}</p><button class="fc22-button" data-fc22-go="${h(l.id)}">Lerninhalt öffnen</button></div>`).join('')||'<p>Keine Themen vorhanden.</p>'}</div><h4>Erklärung wie im Schulbuch</h4>${picks[0]?explanation(picks[0]):''}`}
const modes=[['plus','Plus'],['minus','Minus'],['multiply','Mal'],['divide','Geteilt'],['fraction','Brüche'],['percent','Prozent'],['equation','Gleichungen'],['area','Fläche'],['linear','Funktionen']];
const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function makeMath(mode){let a,b,answer,steps,question;
 switch(mode){
 case'minus':a=rand(18,100);b=rand(2,a);answer=String(a-b);question=`${a} − ${b} = ?`;steps=`Ziehe ${b} von ${a} ab. Kontrolle: ${answer} + ${b} = ${a}.`;break;
 case'multiply':a=rand(2,12);b=rand(2,12);answer=String(a*b);question=`${a} × ${b} = ?`;steps=`${a} gleich große Gruppen mit je ${b} ergeben ${answer}.`;break;
 case'divide':a=rand(2,12);b=rand(2,10);answer=String(a);question=`${a*b} : ${b} = ?`;steps=`${b} × ${a} = ${a*b}, also ${a*b} : ${b} = ${a}.`;break;
 case'fraction':a=rand(1,5);b=rand(a+1,9);answer=`${a}/${b}`;question=`Ein Kreis hat ${b} gleich große Stücke. ${a} davon sind gefärbt. Schreibe den Bruch (Zähler/Nenner).`;steps=`Oben stehen die ${a} gefärbten Teile, unten die ${b} Teile insgesamt: ${answer}.`;break;
 case'percent':a=rand(1,9)*10;b=rand(2,10)*10;answer=String(a*b/100);question=`Wie viel sind ${a} % von ${b}?`;steps=`1 % von ${b} ist ${b}/100. ${a} % sind ${a} × ${b}/100 = ${answer}.`;break;
 case'equation':a=rand(2,14);b=rand(1,12);answer=String(a);question=`Löse die Gleichung: x + ${b} = ${a+b}`;steps=`Ziehe auf beiden Seiten ${b} ab. Dann ist x = ${a+b} − ${b} = ${a}.`;break;
 case'area':a=rand(2,16);b=rand(2,12);answer=String(a*b);question=`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist die Fläche in cm²?`;steps=`Fläche = Länge × Breite = ${a} × ${b} = ${answer} cm².`;break;
 case'linear':a=rand(2,6);b=rand(1,8);const x=rand(1,9);answer=String(a*x+b);question=`f(x) = ${a}x + ${b}. Berechne f(${x}).`;steps=`Setze ${x} für x ein: ${a} × ${x} + ${b} = ${answer}.`;break;
 default:a=rand(1,90);b=rand(1,90);answer=String(a+b);question=`${a} + ${b} = ?`;steps=`Rechne ${a} plus ${b}. Kontrolle: ${answer} − ${b} = ${a}.`;
 }
 return {question,answer,steps,subject:'Mathe',label:'Rechenaufgabe'};
}
const deTasks=[
 ['Welche Wortart ist „laufen“?','Verb','„Laufen“ bezeichnet eine Tätigkeit, deshalb ist es ein Verb.'],['Welche Wortart ist „schön“?','Adjektiv','„Schön“ beschreibt eine Eigenschaft und ist daher ein Adjektiv.'],['Schreibe die Mehrzahl von „Haus“.','Häuser','Das Wort „Haus“ hat den Plural „Häuser“.'],['Schreibe den Artikel zu „Tisch“.','der','Im Nominativ Singular heißt es „der Tisch“.'],['Wie heißt die Vergangenheit von „ich gehe“ (Präteritum)?','ich ging','Das Verb „gehen“ hat die unregelmäßige Präteritumform „ging“.'],['Setze das fehlende Satzzeichen: „Wie spät ist es__“','?','Ein Fragesatz endet mit einem Fragezeichen.'],['Wie viele Silben hat „Banane“?','3','Ba-na-ne: drei Silben, getrennt mit zwei Bindestrichen.'],['Schreibe „Fahrrad“ richtig ab.','Fahrrad','„Fahrrad“ hat nach „Fahr“ und vor „rad“ zwei r.'],['Welche Wortart ist „freundlich“?','Adjektiv','„Freundlich“ beschreibt, wie jemand ist oder handelt.'],['Trenne „Schokolade“ in Silben mit Bindestrichen.','Scho-ko-la-de','Die Silben lauten Scho, ko, la und de.'],['Was ist das Subjekt in „Die Katze schläft“?','Die Katze','Das Subjekt sagt, wer oder was etwas tut.'],['Schreibe die Mehrzahl von „Buch“.','Bücher','„Bücher“ ist die Pluralform mit Umlaut.']
];
const enTasks=[
 ['Was heißt „apple“ auf Deutsch?','Apfel','Apple bedeutet Apfel.'],['Was heißt „house“ auf Deutsch?','Haus','House bedeutet Haus.'],['Übersetze: „I am happy.“','Ich bin glücklich.','I = ich, am = bin, happy = glücklich.'],['Setze ein: „She ___ a book.“ (have/has)','has','Mit he, she, it verwendet man im Simple Present has.'],['Was ist das englische Wort für „Hund“?','dog','Dog bedeutet Hund.'],['Wie lautet die Vergangenheit von „go“?','went','Das Verb go ist unregelmäßig: go – went – gone.'],['Setze ein: „He ___ football.“ (play/plays)','plays','Im Simple Present erhält das Verb bei he/she/it ein -s.'],['Übersetze: „Good morning“.','Guten Morgen','Good morning ist der übliche Morgengruß.'],['Wie heißt „Wasser“ auf Englisch?','water','Water bedeutet Wasser.'],['Setze ein: „There ___ two cats.“ (is/are)','are','Mehrzahl: There are two cats.'],['Übersetze „yesterday“.','gestern','Yesterday bezeichnet den Tag vor heute.'],['Setze ein: „I ___ reading now.“ (am/is/are)','am','Bei I steht die Form am: I am reading.']
];
function selectTask(items,idx){const [question,answer,steps]=items[idx%items.length];return {question,answer,steps}}
function normalized(s){return String(s).trim().toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.!?]+$/,'').replace(/\s+/g,' ')}
function trainer(){const sub=tool;const tasks=sub==='deutsch'?deTasks:enTasks;if(!task||task.subject!==(sub==='mathe'?'Mathe':sub==='deutsch'?'Deutsch':'Englisch'))task=sub==='mathe'?makeMath(settings.mode):{...selectTask(tasks,sub==='deutsch'?wordIndex:englishIndex),subject:sub==='deutsch'?'Deutsch':'Englisch'};
 return `<h3>Übungstrainer – selbst lösen</h3><p>Hier gibst du selbst Antworten ein. Die App erklärt den Lösungsweg; sie verwendet dafür keine Internetdienste.</p><div class="fc22-btnrow">${[['mathe','Mathe'],['deutsch','Deutsch'],['englisch','Englisch']].map(([k,v])=>`<button class="fc22-button ${sub===k?'':'secondary'}" data-fc22-tool="${k}">${v}</button>`).join('')}</div>${sub==='mathe'?`<label class="fc22-field">Rechenbereich<select id="fc22-mode">${modes.map(([v,n])=>`<option value="${v}" ${settings.mode===v?'selected':''}>${n}</option>`).join('')}</select></label>`:''}<div class="fc22-card"><h4>${h(task.question)}</h4><label class="fc22-field">Deine Antwort<input id="fc22-answer" autocomplete="off" inputmode="${sub==='mathe'?'decimal':'text'}" placeholder="Antwort eingeben"></label><div class="fc22-btnrow"><button class="fc22-button" data-fc22="check-task">Antwort prüfen</button><button class="fc22-button secondary" data-fc22="next-task">Neue Aufgabe</button></div><output id="fc22-task-result" aria-live="polite" hidden></output></div>${sub==='englisch'?'<button class="fc22-button secondary" data-fc22="speak-word">Englischen Satz vorlesen</button><details class="fc22-card"><summary><b>Vokabel-Karteikarten öffnen</b></summary><p>Apple – Apfel · House – Haus · Water – Wasser · Dog – Hund · Book – Buch · Friend – Freund · School – Schule · Today – heute · Tomorrow – morgen · Yesterday – gestern.</p><p>Decke beim Wiederholen die deutsche Seite mit der Hand ab und sprich die englischen Wörter laut.</p></details><p class="fc22-note">Das Vorlesen benötigt eine lokal vorhandene Stimme; auf manchen Geräten kann es online erfolgen.</p>':''}${sub==='deutsch'?'<p class="fc22-note">Lesetipp: Berühre beim Lesen jedes Wort mit dem Finger. Bei längeren Wörtern kannst du mit Silben arbeiten, zum Beispiel: Scho-ko-la-de.</p>':''}`
}
const history=[['Altes Ägypten – Bau der Cheops-Pyramide','-2560'],['Gründung Roms (traditionell)','-753'],['Karl der Große wird Kaiser','800'],['Gutenberg und Buchdruck mit beweglichen Metalllettern','1450'],['Beginn der Französischen Revolution','1789'],['Deutsche Wiedervereinigung','1990']];
const musicNames=[['Welche Note liegt im Violinschlüssel auf der untersten Linie?','E'],['Welche Note liegt im Violinschlüssel im untersten Zwischenraum?','F'],['Welche Note liegt im Violinschlüssel auf der zweiten Linie?','G'],['Welche Note liegt im Violinschlüssel im zweiten Zwischenraum?','A']];
function makeGame(type='math'){if(type==='history'){const a=rand(0,history.length-2),b=rand(a+1,history.length-1);return {type,question:'Was geschah früher?',options:[history[a][0],history[b][0]],answer:history[a][0],explain:`${history[a][0]} (${history[a][1]}) liegt vor ${history[b][0]} (${history[b][1]}).`};}
 if(type==='music'){const q=musicNames[rand(0,musicNames.length-1)];return {type,question:q[0],options:['E','F','G','A'],answer:q[1],explain:'Im Violinschlüssel heißen die Noten auf den Linien von unten E–G–H–D–F; in den Zwischenräumen F–A–C–E.'};}
 if(type==='words'){const q=deTasks[rand(0,deTasks.length-1)];return {type,question:q[0],free:true,answer:q[1],explain:q[2]};}
 const q=makeMath(['plus','minus','multiply'][rand(0,2)]);const a=Number(q.answer);const opts=[q.answer,String(a+1),String(Math.max(0,a-2)),String(a+3)];return {type:'math',question:q.question,options:[...new Set(opts)],answer:q.answer,explain:q.steps};}
function games(){if(!game)game=makeGame('math');return `<h3>Spielend lernen</h3><p>Vier kleine Lernspiele. Ohne Punkte-Druck und ohne Verbindung zum Internet.</p><div class="fc22-btnrow">${[['math','Zahlenrätsel'],['words','Wörter'],['history','Zeitreise'],['music','Noten']].map(([k,v])=>`<button class="fc22-button ${game.type===k?'':'secondary'}" data-fc22-game="${k}">${v}</button>`).join('')}</div><div class="fc22-card"><h4>${h(game.question)}</h4>${game.free?'<label class="fc22-field">Deine Antwort<input id="fc22-game-answer" autocomplete="off"></label><button class="fc22-button" data-fc22="game-check">Prüfen</button>':`<div class="fc22-game-opt">${game.options.map(x=>`<button class="fc22-button secondary" data-fc22-choice="${h(x)}">${h(x)}</button>`).join('')}</div>`}<output id="fc22-game-result" hidden aria-live="polite"></output></div><button class="fc22-button secondary" data-fc22="game-next">Nächste Spielaufgabe</button>`}
function plan(){const due=dueItems(), items=due.filter(x=>x.remain<=0);return `<h3>Wiederholungsplan</h3><p>Nach einer schwächeren Leistung wiederholen wir früher, nach einer guten Leistung mit größerem Abstand. Die Termine sind Empfehlungen, keine Pflicht.</p>${profileNotice()}<div class="fc22-kpis"><div><strong>${items.length}</strong><small>Wiederholungen fällig</small></div><div><strong>${due.length}</strong><small>Geübte Themen</small></div><div><strong>${recent().length}</strong><small>Tests diese Woche</small></div></div><h4>Als Nächstes wiederholen</h4><div class="fc22-cards">${due.slice(0,20).map(x=>`<div class="fc22-card"><b>${h(x.l.title)}</b><p>${h(x.l.subject)} · Letztes Ergebnis ${x.entry.correct}/10 · ${x.remain<=0?'Jetzt wiederholen':'In '+Math.ceil(x.remain)+' Tag(en)'}</p><button class="fc22-button" data-fc22-go="${h(x.l.id)}">Thema öffnen</button></div>`).join('')||'<p>Nach dem ersten Test entsteht hier dein persönlicher Wiederholungsplan.</p>'}</div>`}
function stats(){const a=attempts(),by={};for(const x of a){const l=lesson(x.lessonId);if(!l)continue;(by[l.subject]||(by[l.subject]=[])).push(x)}const rows=Object.entries(by).map(([subject,v])=>({subject,count:v.length,rate:Math.round(v.reduce((t,x)=>t+x.correct,0)/v.length*10)})).sort((a,b)=>b.count-a.count);
 const dateChart=Object.entries(a.reduce((out,x)=>{const k=x.date.slice(0,10);(out[k]||(out[k]=[])).push(x.correct);return out},{})).sort((a,b)=>a[0].localeCompare(b[0])).slice(-12);
 return `<h3>Erweiterte Lernstatistik</h3>${profileNotice()}${summaryBox()}<h4>Ergebnisse nach Fach</h4><div class="fc22-cards">${rows.map(x=>`<div class="fc22-card"><b>${h(x.subject)}</b> · ${x.count} Tests · ${x.rate}% richtig<div class="fc22-bar"><span style="width:${x.rate}%"></span></div></div>`).join('')||'<p>Schließe einen Test ab, um den Lernverlauf zu sehen.</p>'}</div><h4>Lernverlauf der letzten zwölf Übungstage</h4><div class="fc22-cards">${dateChart.map(([date,v])=>{const pct=Math.round(v.reduce((x,y)=>x+y,0)/v.length*10);return `<div class="fc22-card"><b>${h(stamp(date+'T12:00:00'))}</b> · ${v.length} Tests · ${pct}% richtig<div class="fc22-bar"><span style="width:${pct}%"></span></div></div>`}).join('')||'<p>Noch keine Lernverläufe vorhanden.</p>'}</div><p class="fc22-note">Noten und Stärken sind Übungswerte. Sie ersetzen keine schulische Leistungsbewertung und stellen keine medizinische Diagnose dar.</p>`}
function parents(){const p=active();const target=weeklyTarget();const pct=Math.min(100,Math.round(recent().length/target*100));return `<h3>Elternbereich und Wochenziele</h3><p>Der Elternbereich zeigt Lernziele und Fortschritte. Er ist nicht mit einer PIN geschützt: Bitte besprecht die Ziele gemeinsam.</p>${profileNotice()}<div class="fc22-grid"><div class="fc22-card"><h4>Wochenziel festlegen</h4><label class="fc22-field">Wie viele kleine Tests pro Woche?<input id="fc22-target" type="number" min="1" max="35" value="${target}"></label><button class="fc22-button" data-fc22="save-target">Ziel speichern</button></div><div class="fc22-card"><h4>Wochenfortschritt</h4><strong style="font-size:28px">${recent().length} von ${target}</strong><div class="fc22-bar"><span style="width:${pct}%"></span></div><p>${pct>=100?'Wochenziel erreicht.':'Jeder abgeschlossene Test zählt – ohne Zwang.'}</p></div></div><h4>Kinderprofile</h4><table class="fc22-table"><thead><tr><th>Profil</th><th>Klasse</th><th>Tests</th></tr></thead><tbody>${(profileData?.profiles||[]).map(x=>`<tr><td>${h(x.name)}</td><td>${x.grade}</td><td>${x.attempts.length}</td></tr>`).join('')||'<tr><td colspan="3">Noch kein Profil</td></tr>'}</tbody></table><p class="fc22-warn">Die Statistik enthält personenbezogene Angaben. Die Daten werden nur in diesem Browser gespeichert und sind für andere Personen mit Zugriff auf dasselbe Gerät sichtbar.</p>`}
function curriculum(){const g=state.grade||5;const l=topicBase().filter(x=>x.grade===g);const groups={};for(const x of l){(groups[x.subject]||(groups[x.subject]=[])).push(x)}return `<h3>NRW-Lehrplan-Navigator</h3><p>Für Klasse ${g} sind ${l.length} Grundthemen gelistet. Dies zeigt die verfügbare Auswahl – <b>nicht</b>, ob alle amtlichen Kompetenzerwartungen erfüllt werden.</p><div class="fc22-warn"><b>Status: nicht vollständig überprüft.</b> Die amtlichen NRW-Lehrpläne müssen pro Fach, Kompetenzbereich und Abschluss einzeln abgeglichen werden. Schulinterne Stoffverteilungspläne liegen nicht vor.</div><h4>Fachübersicht für Klasse ${g}</h4><table class="fc22-table"><thead><tr><th>Fach</th><th>Grundthemen</th></tr></thead><tbody>${Object.entries(groups).sort((a,b)=>b[1].length-a[1].length).map(([s,v])=>`<tr><td>${h(s)}</td><td>${v.length}</td></tr>`).join('')}</tbody></table><button class="fc22-button" data-fc22="official">Vorhandene NRW-Quellen und Prüfmatrix öffnen</button><p class="fc22-note">Zum Prüfen der Lehrpläne wird Internet benötigt. Die im Gerät gespeicherten Themen bleiben offline verfügbar.</p>`}
function backup(){let all=0;for(let i=0;i<localStorage.length;i++)if((localStorage.key(i)||'').startsWith('fixclever'))all++;
 return `<h3>Datensicherung & Wiederherstellung</h3><p>Erstelle eine Sicherungsdatei mit allen lokalen FixClever-Profilen, Lernständen, Ergebnissen, Sterneinstellungen und Lernzielen. Ohne Cloud.</p><div class="fc22-kpis"><div><strong>${all}</strong><small>lokale FixClever-Datensätze</small></div><div><strong>${(profileData?.profiles||[]).length}</strong><small>Kinderprofile</small></div></div><div class="fc22-grid"><div class="fc22-card"><h4>Sicherung herunterladen</h4><p>Die Datei enthält auch Namen und Testergebnisse. Bewahre sie sicher auf.</p><button class="fc22-button" data-fc22="export">Backup als JSON speichern</button></div><div class="fc22-card"><h4>Backup wiederherstellen</h4><label class="fc22-field">Sicherungsdatei auswählen<input type="file" id="fc22-import" accept=".json,application/json"></label><p class="fc22-warn">Vorhandene FixClever-Daten werden nach ausdrücklicher Bestätigung ersetzt. Erstelle vorher ein aktuelles Backup.</p></div></div><h4>Antwortmöglichkeiten in Tests</h4><label class="fc22-field">Wie viele Antworten sollen jüngeren Kindern angezeigt werden?<select id="fc22-options"><option value="4" ${settings.selection==='4'?'selected':''}>4 übersichtliche Antworten bei Klasse 1–4</option><option value="10" ${settings.selection==='10'?'selected':''}>Immer 10 Antwortmöglichkeiten</option></select></label><p class="fc22-note">Die ursprünglichen zehn Frageoptionen bleiben für die Berechnung gespeichert. Es werden nur weniger Möglichkeiten angezeigt; bestehende Statistiken werden nicht gelöscht.</p>`}
function showResult(output,correct,explain){if(!output)return;output.hidden=false;output.textContent=(correct?'Richtig. ':'Noch nicht richtig. ')+explain;output.style.borderLeft='4px solid '+(correct?'#267958':'#c47830')}
function checkTask(){const val=$('#fc22-answer')?.value||'';if(!val.trim())return;showResult($('#fc22-task-result'),normalized(val)===normalized(task.answer),task.steps+' Richtige Antwort: '+task.answer)}
function checkGame(value){if(!game)return;showResult($('#fc22-game-result'),normalized(value)===normalized(game.answer),game.explain+' Richtige Antwort: '+game.answer)}
function speakTask(){if(!('speechSynthesis'in window))return;const u=new SpeechSynthesisUtterance(task.question);u.lang='en-US';u.rate=.75;window.speechSynthesis.speak(u)}
function exportBackup(){const values={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('fixclever'))values[k]=localStorage.getItem(k)}const backupData={type:'FixCleverBackup',format:1,created:new Date().toISOString(),version:VERSION,values};const blob=new Blob([JSON.stringify(backupData,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='FixClever_Backup_'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}
async function restore(file){if(!file||file.size>25*1024*1024){alert('Bitte wähle eine Sicherung unter 25 MB.');return}let data;try{data=JSON.parse(await file.text())}catch{alert('Die Datei ist keine gültige JSON-Sicherung.');return}if(!data||data.type!=='FixCleverBackup'||data.format!==1||!data.values||typeof data.values!=='object'||Array.isArray(data.values)){alert('Diese Datei ist keine FixClever-Sicherung aus der Lernzentrale.');return}const ks=Object.keys(data.values);if(ks.length>300||!ks.every(k=>/^fixclever[a-z0-9._-]*$/i.test(k)&&typeof data.values[k]==='string'&&data.values[k].length<10*1024*1024)){alert('Die Sicherung enthält ungültige Daten.');return}if(!confirm(`FixClever-Backup vom ${stamp(data.created)} mit ${ks.length} Datensätzen einspielen? Bestehende Lernstände werden dabei ersetzt.`))return;
const previous={};try{const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('fixclever')){keys.push(k);previous[k]=localStorage.getItem(k)}}for(const k of keys)localStorage.removeItem(k);for(const k of ks)localStorage.setItem(k,data.values[k]);alert('Sicherung wiederhergestellt. FixClever wird neu geladen.');location.reload()}catch(e){try{for(const k of ks)localStorage.removeItem(k);for(const [k,v] of Object.entries(previous))localStorage.setItem(k,v)}catch{}alert('Wiederherstellung fehlgeschlagen. Die zuvor gespeicherten Daten wurden soweit möglich wiederhergestellt. Bitte Browser-Speicher prüfen.')}
}
dialog.addEventListener('click',event=>{const t=event.target.closest('button');if(!t)return;
 if(t.dataset.fc22Tab){tab=t.dataset.fc22Tab;render();return}
 if(t.dataset.fc22Go){openTopic(t.dataset.fc22Go);return}
 if(t.dataset.fc22Tool){tool=t.dataset.fc22Tool;task=null;render();return}
 if(t.dataset.fc22Game){game=makeGame(t.dataset.fc22Game);render();return}
 if(t.dataset.fc22Choice){checkGame(t.dataset.fc22Choice);return}
 switch(t.dataset.fc22){
 case'close':dialog.close();break;
 case'check-task':checkTask();break;
 case'next-task':if(tool==='mathe')task=makeMath(settings.mode);else if(tool==='deutsch')task={...selectTask(deTasks,++wordIndex),subject:'Deutsch'};else task={...selectTask(enTasks,++englishIndex),subject:'Englisch'};render();break;
 case'game-check':checkGame($('#fc22-game-answer')?.value||'');break;
 case'game-next':game=makeGame(game?.type||'math');render();break;
 case'speak-word':speakTask();break;
 case'save-target':settings.targets=settings.targets||{};settings.targets[active()?.id||'default']=Math.min(35,Math.max(1,Number($('#fc22-target')?.value)||5));saveSettings();render();break;
 case'official':dialog.close();$('#nrw-curriculum-nav')?.click();break;
 case'export':exportBackup();break;
 }
});
dialog.addEventListener('change',event=>{if(event.target.id==='fc22-mode'){settings.mode=event.target.value;saveSettings();task=null;render()}
 if(event.target.id==='fc22-options'){settings.selection=event.target.value;saveSettings()}
 if(event.target.id==='fc22-import')restore(event.target.files?.[0]);});
dialog.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='fc22-answer'){e.preventDefault();checkTask()}});
// Reduced answer count affects only the visible labels. Original bank, selected text and saved test history remain unchanged.
if(typeof renderQuiz==='function'){
 const prior=renderQuiz;
 renderQuiz=function(){prior();const l=quiz&&lesson(quiz.lessonId);if(!quiz||!l||l.grade>4||settings.selection!=='4')return;
 const q=quiz.questions[quiz.index],field=$('#quiz-area .answer-options');if(!field)return;
 const chosen=quiz.answers[q.id];const allowed=[q.correctText];if(chosen&&!allowed.includes(chosen))allowed.push(chosen);
 for(const item of q.options){if(allowed.length>=4)break;if(!allowed.includes(item))allowed.push(item)}
 const order=q.options.filter(v=>allowed.includes(v));for(const label of [...field.querySelectorAll('label.answer-option')]){
 const inp=label.querySelector('input');if(!inp)continue;const text=q.options[Number(inp.value)];if(!order.includes(text))label.remove();
 }
 const note=$('#quiz-area .answer-options+p');if(note)note.textContent='Vier übersichtliche Antworten. Die Lösung und der Lösungsweg erscheinen nach dem Test.';
 };
}
// Add a concrete scaffold to the existing complete lesson explanation; the original content is retained.
if(typeof renderReader==='function'){
 const prior=renderReader;
 renderReader=function(){prior();const l=state.lesson;if(!l)return;const body=$('#reader .reader-body');if(!body||body.querySelector('.fc22-reader'))return;
 const exp=document.createElement('details');exp.className='fc22-reader';exp.innerHTML='<summary><b>Zusätzliche Schulbuch-Hilfe – in kleinen Schritten lesen</b></summary>'+explanation(l);body.append(exp);
 };
}
// Make buttons in the regular lesson view work as well as in the dialog.
document.addEventListener('click',event=>{if(dialog.contains(event.target))return;const b=event.target.closest('[data-fc22-go]');if(b)openTopic(b.dataset.fc22Go)});
// Keep the content visible in older versions where lazy service-worker state changes without reload.
window.FixCleverLearningHub={version:VERSION,open:openHub,audit:()=>({profiles:profileData?.profiles?.length||0,lessons:LESSONS.length,features:12})};
})();


;

/* FixClever 2.3.1 – lokale Lernzentrale. Keine Cloud, keine Tracking-Bibliothek. */
(function(){
'use strict';
if(!Array.isArray(LESSONS)||!Array.isArray(SUBJECTS)||typeof child!=='function') return;
const VERSION='2.3.1';
const KEY='fixclever-lz-v1';
const TABS=[['coach','Lerncoach'],['training','Üben'],['reading','Lernhilfe'],['games','Lernspiele'],['progress','Lernplan & Statistik'],['curriculum','NRW-Lehrplan'],['parents','Eltern & Backup']];
const escapeText=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=id=>document.getElementById(id);
const tag=(n,cls,content)=>`<${n}${cls?' class="'+cls+'"':''}>${content}</${n}>`;
let settings={profiles:{},history:[]};
try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');if(raw&&typeof raw==='object'){
 if(raw.profiles&&typeof raw.profiles==='object'&&!Array.isArray(raw.profiles))settings.profiles=raw.profiles;
 if(Array.isArray(raw.history))settings.history=raw.history.filter(x=>x&&typeof x==='object').slice(-400);
}}catch{}
function persist22(){try{localStorage.setItem(KEY,JSON.stringify(settings));return true;}catch{alert('Der lokale Speicher ist voll oder gesperrt. Bitte zuerst Daten sichern.');return false;}}
function profile(){try{return child()}catch{return null}}
function currentId(){return profile()?.id||'_guest';}
function prefs(){const id=currentId();if(!settings.profiles[id]||typeof settings.profiles[id]!=='object')settings.profiles[id]={goal:4};return settings.profiles[id]}
function attempts(){return Array.isArray(profile()?.attempts)?profile().attempts:[];}
function lesson(id){return LESSONS.find(x=>x.id===id)}
function label(l){return `${l.subject} · Kl. ${l.grade} · ${l.title}`}
function dateOf(x){const n=Date.parse(x);return Number.isFinite(n)?n:0}
const DAY=86400000;
const ts=()=>Date.now();
function scoreByLesson(){const grouped=new Map();for(const a of attempts()){
 if(!grouped.has(a.lessonId)||dateOf(a.date)>dateOf(grouped.get(a.lessonId).date))grouped.set(a.lessonId,a);
}return grouped;}
function nextDays(score){return score<6?1:score<8?3:score<10?7:14}
function dueLessons(){const grouped=scoreByLesson();const due=[];const improve=[];
 for(const [id,a] of grouped){const l=lesson(id);if(!l)continue;const remaining=Math.ceil((dateOf(a.date)+nextDays(a.correct)*DAY-ts())/DAY);
 const o={l,a,remaining};if(remaining<=0)due.push(o);if(a.correct<8)improve.push(o);
 }
 due.sort((a,b)=>a.remaining-b.remaining||a.a.correct-b.a.correct);improve.sort((a,b)=>a.a.correct-b.a.correct);
 return {due,improve,completed:grouped};}
const beginningOfWeek=()=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate() - (d.getDay()+6)%7);return +d};
function weeklyCount(){return attempts().filter(a=>dateOf(a.date)>=beginningOfWeek()).length;}
function progressCard(l,caption){return `<div class="fc22-card"><strong>${escapeText(l.title)}</strong><p>${escapeText(l.subject)} · Klasse ${l.grade}${caption?' · '+escapeText(caption):''}</p><button class="fc22-button secondary" data-fc22-openlesson="${escapeText(l.id)}">Erklärung öffnen</button> <button class="fc22-button secondary" data-fc22-practice="${escapeText(l.subject)}">Üben</button></div>`}
let dialog=document.createElement('dialog');dialog.className='fc22-hub';dialog.id='fc22-hub';dialog.setAttribute('aria-label','FixClever Lernzentrale');
dialog.innerHTML=`<div class="fc22-header"><div><small>FIXCLEVER 2.3.1 · ALLES LOKAL</small><h2>Deine Lernzentrale</h2></div><button class="fc22-close" data-fc22-close aria-label="Lernzentrale schließen">×</button></div><div class="fc22-tabs" role="tablist" aria-label="Lernbereiche">${TABS.map(([k,n])=>`<button role="tab" data-fc22-tab="${k}" aria-selected="false">${n}</button>`).join('')}</div><div class="fc22-content" id="fc22-content" role="tabpanel" tabindex="0"></div>`;
document.body.append(dialog);
const aside=document.querySelector('.sidebar nav');
if(aside){const entry=document.createElement('button');entry.type='button';entry.className='nav-button fc22-nav';entry.innerHTML='<span>✦</span> Lernzentrale <small>NEU</small>';entry.addEventListener('click',()=>open('coach'));aside.append(entry)}
const float=document.createElement('button');float.type='button';float.className='fc22-open fc22-float';float.textContent='✦ Lernzentrale';float.setAttribute('aria-label','Lernzentrale öffnen');float.addEventListener('click',()=>open('coach'));document.body.append(float);
let tab='coach',work={kind:null,index:0,items:[],score:0,locked:false,mode:'math'},flip=false;
function open(k='coach'){tab=k;if(!dialog.open){if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');}show(k)}
function close(){if(dialog.open){if(dialog.close)dialog.close();else dialog.removeAttribute('open')}}
function show(k=tab){tab=k;for(const b of dialog.querySelectorAll('[data-fc22-tab]'))b.setAttribute('aria-selected',String(b.dataset.fc22Tab===tab));const contents={coach:coachView,training:trainingView,reading:readingView,games:gamesView,progress:progressView,curriculum:curriculumView,parents:parentsView};
 byId('fc22-content').innerHTML=(contents[k]||coachView)();byId('fc22-content').scrollTop=0;}
function heading(t,p){return `<h3>${escapeText(t)}</h3><p>${escapeText(p)}</p>`}
function noProfile(){return profile()?'':`<div class="fc22-note">Du übst gerade als Gast. Für persönliche Ziele, gespeicherte Testergebnisse und Wiederholungen wähle oben rechts ein Kinderprofil. <button class="fc22-button secondary" data-fc22-profile>Profil wählen</button></div>`}
function coachView(){const p=profile(),g=p?.grade||state.grade||5,{due,improve,completed}=dueLessons();const suggestions=LESSONS.filter(l=>l.grade===g&&['Mathe','Deutsch','Englisch'].includes(l.subject)&&!completed.has(l.id)&&!(l.isExtension||l.kind==='Vertiefung')).slice(0,5);
 return heading('Persönlicher Lerncoach',`Für ${p?.name||'dich'}: Übe zuerst das, was noch schwerfällt. Wiederholungen werden allein anhand gespeicherter Testergebnisse vorgeschlagen.`)+noProfile()+`<div class="fc22-kpis"><div><small>Abgeschlossene Tests</small><strong>${attempts().length}</strong></div><div><small>Wiederholung fällig</small><strong>${due.length}</strong></div><div><small>Diese Woche</small><strong>${weeklyCount()}</strong></div></div>`+
 `<h4>Heute wiederholen</h4>${due.length?`<div class="fc22-cards">${due.slice(0,4).map(x=>progressCard(x.l,`${x.a.correct}/10 richtig · Wiederholung fällig`)).join('')}</div>`:'<div class="fc22-note">Im Moment ist kein bereits getestetes Thema zur Wiederholung fällig.</div>'}`+
 `<h4>Das kannst du noch üben</h4>${improve.length?`<div class="fc22-cards">${improve.slice(0,3).map(x=>progressCard(x.l,`${x.a.correct}/10 richtig`)).join('')}</div>`:'<p>Starte zuerst einen Wissenstest. Danach schlägt dir der Lerncoach schwierige Themen vor.</p>'}`+
 `<h4>Neue Themen in Klasse ${g}</h4><div class="fc22-cards">${suggestions.length?suggestions.map(x=>progressCard(x,'noch kein Test')).join(''):'<p>In den Kernfächern gibt es keine weiteren ungetesteten Grundthemen in der aktuellen Auswahl.</p>'}</div>`+
 `<div class="fc22-btnrow"><button class="fc22-button" data-fc22-tab="training">Jetzt üben</button><button class="fc22-button secondary" data-fc22-tab="progress">Wochenziel ansehen</button></div>`;
}
const germanBank=[
 ['Welche Wortart ist „laufen“?','Verb',['Verb','Nomen','Adjektiv','Artikel'],'„Laufen“ beschreibt eine Tätigkeit und ist ein Verb.'],
 ['Welche Wortart ist „freundlich“?','Adjektiv',['Adjektiv','Verb','Pronomen','Artikel'],'Das Adjektiv beschreibt eine Eigenschaft.'],
 ['Welches Wort ist ein Nomen?','Baum',['Baum','laufen','schnell','und'],'Nomen bezeichnen zum Beispiel Dinge, Lebewesen oder Begriffe.'],
 ['Welche Form steht im Präteritum?','ich ging',['ich ging','ich gehe','ich bin gegangen','ich werde gehen'],'„Ging“ ist die einfache Vergangenheitsform von „gehen“.'],
 ['Welcher Satz enthält eine Frage?','Wann beginnt die Schule?',['Wann beginnt die Schule?','Die Schule beginnt.','Die Schule beginnt!','Schule beginnt heute.'],'Eine Frage wird mit einem Fragezeichen abgeschlossen.'],
 ['Welche Schreibung ist richtig?','Fahrrad',['Fahrrad','Fahrad','Farrad','Fahrradt'],'„Fahrrad“ setzt sich aus „fahren“ und „Rad“ zusammen.'],
 ['Welches Wort ist eine Konjunktion?','weil',['weil','Tisch','langsam','sie'],'„Weil“ verbindet einen Nebensatz mit einem Hauptsatz.'],
 ['Welches Satzglied antwortet auf „Wer oder was?“','Subjekt',['Subjekt','Prädikat','Dativobjekt','adverbiale Bestimmung'],'Mit „Wer oder was?“ fragt man nach dem Subjekt.'],
 ['Wie lautet der Plural von „Haus“?','Häuser',['Häuser','Hausen','Haüse','Hause'],'Die Mehrzahl von Haus lautet Häuser.'],
 ['Welche Satzart endet meist mit „!“?','Aufforderungssatz',['Aufforderungssatz','Fragesatz','Nebensatz','Relativsatz'],'Eine deutliche Aufforderung kann mit Ausrufezeichen enden.'],
 ['Welches Wort ist ein Pronomen?','wir',['wir','grün','Tafel','springen'],'„Wir“ steht stellvertretend für mehrere Personen.'],
 ['Wie schreibt man den Satzanfang?','Mit Großbuchstaben',['Mit Großbuchstaben','Immer kleingeschrieben','Mit Bindestrich','Mit Apostroph'],'Am Anfang eines deutschen Satzes steht ein Großbuchstabe.']
];
const englishBank=[
 ['Was heißt „apple“?','Apfel',['Apfel','Birne','Orange','Banane'],'Apple bedeutet auf Deutsch Apfel.'],
 ['Was heißt „school“?','Schule',['Schule','Stunde','Heft','Pause'],'School bedeutet Schule.'],
 ['Wie lautet die Vergangenheit von „go“?','went',['went','goed','gone','going'],'Die einfache Vergangenheit (simple past) von go lautet went.'],
 ['Wie heißt „Ich bin müde“ auf Englisch?','I am tired.',['I am tired.','I is tired.','I have tired.','I are tired.'],'I am tired ist eine Aussage im simple present mit to be.'],
 ['Welche Form gehört zu „she“ im simple present?','she plays',['she plays','she play','she playing','she played now'],'Bei he, she und it erhält das Verb im simple present meist -s.'],
 ['Was heißt „because“?','weil',['weil','aber','obwohl','und'],'Because leitet einen Grund ein.'],
 ['Welches Wort ist eine Farbe?','purple',['purple','window','teacher','winter'],'Purple bedeutet lila.'],
 ['Wie lautet der Plural von „child“?','children',['children','childs','childes','childrens'],'Child bildet den unregelmäßigen Plural children.'],
 ['Welche Form ist eine Frage im simple present?','Do you like music?',['Do you like music?','You do like music.','Does you like music?','You liking music?'],'Fragen mit you beginnen im simple present häufig mit Do.'],
 ['Was heißt „yesterday“?','gestern',['gestern','morgen','heute','nächste Woche'],'Yesterday bedeutet gestern.'],
 ['Wie heißt „Buch“ auf Englisch?','book',['book','back','bag','bike'],'Book bedeutet Buch.'],
 ['Wie heißt das Partizip von „write“?','written',['written','writed','wrote','writing'],'Write – wrote – written sind die drei Stammformen.']
];
const historyBank=[
 ['In welcher Epoche entstand die Pyramide von Gizeh?','Altes Ägypten',['Altes Ägypten','Renaissance','Industrialisierung','Steinzeit'],'Die große Pyramide von Gizeh wurde im Alten Reich Ägyptens errichtet.'],
 ['Wofür war der römische Limes bekannt?','Grenzanlage',['Grenzanlage','Ritterturnier','Handelsmesse','Druckerei'],'Der Limes bestand aus Grenzbefestigungen und Überwachungsanlagen.'],
 ['Was geschah 1989 in Berlin?','Maueröffnung',['Maueröffnung','Reformation','Gründung Roms','Westfälischer Friede'],'Am 9. November 1989 wurde die Berliner Mauer geöffnet.'],
 ['Welcher Zeitraum gehört zum europäischen Mittelalter?','Etwa 500 bis 1500',['Etwa 500 bis 1500','Etwa 3000 bis 2000 v. Chr.','Etwa 1800 bis 1900','Etwa 1900 bis 2000'],'Das europäische Mittelalter wird oft ungefähr von 500 bis 1500 datiert.'],
 ['Wofür nutzten Ägypter Hieroglyphen?','Schreiben',['Schreiben','Rechnen mit Strom','Fotografieren','Metallgießen'],'Hieroglyphen waren ein Schriftsystem des alten Ägypten.']
];
const musicBank=[
 ['Wie viele Linien besitzt das übliche Notensystem?','5',['5','3','4','6'],'Das übliche Notensystem besteht aus fünf Linien und vier Zwischenräumen.'],
 ['Wie viele Schläge hat eine Viertelnote im 4/4-Takt bei Viertel als Grundschlag?','1',['1','2','3','4'],'Eine Viertelnote dauert einen Viertelschlag beziehungsweise einen Grundschlag im 4/4-Takt.'],
 ['Welche Instrumentenfamilie umfasst die Violine?','Streichinstrumente',['Streichinstrumente','Blechblasinstrumente','Schlaginstrumente','Tasteninstrumente'],'Eine Violine bringt Saiten zum Schwingen, meist durch Streichen.'],
 ['Wofür steht die Angabe „p“ in klassischen Noten?','Leise spielen',['Leise spielen','Schnell spielen','Hoch spielen','Wiederholen'],'p steht für piano und bedeutet leise.'],
 ['Welcher Notenschlüssel kennzeichnet meist das g auf der zweiten Linie?','Violinschlüssel',['Violinschlüssel','Bassschlüssel','Altschlüssel','Tenorschlüssel'],'Der Violinschlüssel ist ein G-Schlüssel und umschließt die zweite Linie.']
];
function mix(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[j],b[i]]=[b[i],b[j]];}return b;}
function int(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function numberQuestion(grade){let a,b,c,s,answers;
 if(grade<=2){a=int(1,grade===1?10:50);b=int(1,grade===1?10:30);s=Math.random()<.5?'+':'−';if(s==='−'&&a<b)[a,b]=[b,a];c=s==='+'?a+b:a-b;}
 else if(grade<=4){a=int(3,12);b=int(2,12);s='×';c=a*b;}
 else if(grade<=6){a=int(15,95);b=int(5,40);s=Math.random()<.5?'+':'−';if(s==='−'&&a<b)[a,b]=[b,a];c=s==='+'?a+b:a-b;}
 else if(grade<=8){a=int(2,9);b=int(2,14);s='x';c=b;return {question:`Löse die Gleichung: ${a} · x = ${a*b}. Wie groß ist x?`,answer:String(c),options:mix([String(c),String(c+1),String(c-1),String(a*b)]),explanation:`Teile beide Seiten durch ${a}. Dann ist x = ${a*b} ÷ ${a} = ${b}.`};}
 else{a=int(5,30);b=int(5,25);s='%';c=Math.round(a*b/100*100)/100;return {question:`Wie viel sind ${a} % von ${b} €?`,answer:String(c).replace('.',','),options:mix([String(c).replace('.',','),String((c+1)).replace('.',','),String((c+2)).replace('.',','),String((c+.5)).replace('.',',')]),explanation:`Rechne ${b} · ${a} / 100 = ${String(c).replace('.',',')} €. Das Prozentzeichen bedeutet „von hundert“.`};}
 answers=[c,c+1,c+2,c+3].map(String);return {question:`Was ergibt ${a} ${s} ${b}?`,answer:String(c),options:mix(answers),explanation:`${a} ${s} ${b} = ${c}. Kontrolliere den Rechenweg langsam Schritt für Schritt.`};
}
function fromBank(b){const x=b[int(0,b.length-1)];return {question:x[0],answer:x[1],options:mix(x[2]),explanation:x[3]};}
function syllableQuestion(){const bank=[['Banane','Ba-na-ne'],['Blume','Blu-me'],['Katze','Kat-ze'],['Tafel','Ta-fel'],['Schule','Schu-le'],['Tasche','Ta-sche']];const [word,correct]=bank[int(0,bank.length-1)];return {question:`Wie trennst du „${word}“ in Silben?`,answer:correct,options:mix([correct,word,word.slice(0,1)+'-'+word.slice(1),word.slice(0,-1)+'-'+word.slice(-1)]),explanation:`„${word}“ besteht aus ${correct.split('-').length} Sprechsilben: ${correct}. Sprich das Wort langsam.`};}
function question(mode){const grade=profile()?.grade||state.grade||5;if(mode==='math')return numberQuestion(grade);if(mode==='german')return grade<=4&&Math.random()<.45?syllableQuestion():fromBank(germanBank);if(mode==='english')return fromBank(englishBank);if(mode==='history')return fromBank(historyBank);if(mode==='music')return fromBank(musicBank);return fromBank(germanBank)}
function startPractice(mode,kind='practice'){work={kind,mode,index:0,items:Array.from({length:kind==='game'?5:10},()=>question(mode)),score:0,locked:false};tab=kind==='game'?'games':'training';show(tab)}
function practiceView(){const q=work.items[work.index];if(!q)return '<p>Keine Übung vorhanden.</p>';
 const opts=[...new Set(q.options)];if(!opts.includes(q.answer))opts.push(q.answer);
 return `<div class="fc22-card"><span class="eyebrow">${work.kind==='game'?'Lernspiel':'Übungsmodus'} · Aufgabe ${work.index+1} von ${work.items.length}</span><h3>${escapeText(q.question)}</h3><div class="fc22-cards">${opts.map((op,i)=>`<button class="fc22-button secondary" data-fc22-answer="${i}" ${work.locked?'disabled':''}>${escapeText(op)}</button>`).join('')}</div><div id="fc22-feedback" class="fc22-note" role="status" ${!work.locked?'hidden':''}></div><button class="fc22-button" data-fc22-next ${!work.locked?'hidden':''}>${work.index===work.items.length-1?'Ergebnis ansehen':'Nächste Aufgabe →'}</button></div>`;
}
function markAnswer(index){if(work.locked)return;const q=work.items[work.index];const options=[...new Set(q.options)];if(!options.includes(q.answer))options.push(q.answer);const actual=options[index],ok=actual===q.answer;work.score+=ok?1:0;work.locked=true;const v=byId('fc22-feedback');v.hidden=false;v.innerHTML=`<strong>${ok?'Richtig!':'Noch nicht richtig.'}</strong> ${escapeText(q.explanation)}${!ok?`<p>Richtige Lösung: <strong>${escapeText(q.answer)}</strong></p>`:''}`;
 dialog.querySelectorAll('[data-fc22-answer]').forEach(b=>b.disabled=true);dialog.querySelector('[data-fc22-next]').hidden=false;
}
function nextPractice(){if(!work.locked)return;if(work.index===work.items.length-1){const p=profile();settings.history.push({id:currentId(),date:new Date().toISOString(),mode:work.mode,kind:work.kind,score:work.score,total:work.items.length});settings.history=settings.history.slice(-400);persist22();
 const title=work.kind==='game'?'Lernspiel beendet':'Übung abgeschlossen';const h=byId('fc22-content');h.innerHTML=heading(title,`Du hast ${work.score} von ${work.items.length} Fragen richtig beantwortet.`)+`<div class="fc22-note">${work.score===work.items.length?'Alle Aufgaben geschafft.':'Fehler sind Hinweise: Lies die Erklärung und versuche die Übung erneut.'}</div><div class="fc22-btnrow"><button class="fc22-button" data-fc22-repeat>Erneut üben</button><button class="fc22-button secondary" data-fc22-tab="coach">Zum Lerncoach</button></div>`;return;}
 work.index++;work.locked=false;byId('fc22-content').innerHTML=practiceView();}
function trainerButtons(kind){const modes=kind==='game'?[['math','Zahlenblitz'],['german','Wortdetektiv'],['history','Zeitreise'],['music','Noten-Check']]:[['math','Mathe-Trainer'],['german','Deutsch-Trainer'],['english','Englisch-Trainer'],['history','Geschichte üben'],['music','Musik üben']];return `<div class="fc22-grid">${modes.map(([key,name])=>`<div class="fc22-card"><h4>${name}</h4><p>${key==='math'?'Rechenwege und Gleichungen':key==='german'?'Wortarten, Silben und Rechtschreibung':key==='english'?'Wortschatz und Grammatik':key==='history'?'Wichtige Ereignisse und Epochen':'Noten, Musikbegriffe und Instrumente'}</p><button class="fc22-button" data-fc22-start="${key}" data-fc22-kind="${kind}">${kind==='game'?'Spielen':'Mit Sofort-Feedback üben'}</button></div>`).join('')}</div>`;}
function trainingView(){if(work.kind==='practice')return practiceView();return heading('Üben mit sofortiger Erklärung','Hier erhältst du nach jeder Antwort direkt eine Erklärung. Das ist ein zusätzlicher Übungsmodus; die bisherigen benoteten Tests bleiben unverändert.')+trainerButtons('practice')+noProfile()+`<div class="fc22-warn">Die Übungen verwenden eine eigene, geprüfte Auswahl kurzer Aufgaben. Sie ersetzen keine vollständige fachliche Einzelprüfung aller bisherigen Testfragen.</div>`;}
function gamesView(){if(work.kind==='game')return practiceView();return heading('Lernspiele','Kurze Spiele ohne Zeitdruck. Deine Spielpunkte werden nur auf diesem Gerät gespeichert und zählen nicht zu den Schulnoten.')+trainerButtons('game');}
function sampleLesson(){const grouped=scoreByLesson();const weak=[...grouped.values()].sort((a,b)=>a.correct-b.correct).map(a=>lesson(a.lessonId)).filter(Boolean)[0];return weak||LESSONS.find(l=>l.grade===(profile()?.grade||state.grade)&&['Mathe','Deutsch','Englisch'].includes(l.subject))||LESSONS[0]}
let guideId=null;
function readerGuide(l){const ps=Array.isArray(l.explain)?l.explain:[];const examples=Array.isArray(l.examples)&&l.examples.length?l.examples:[l.example];return `<div class="fc22-reader"><span class="eyebrow">LERNHILFE · ${escapeText(l.subject)}</span><h3>${escapeText(l.title)}</h3><div class="fc22-one"><strong>1 · Darum geht es</strong><p>${escapeText(ps[0]||l.title)}</p></div>${ps.slice(1,6).map((x,i)=>`<div class="fc22-two"><strong>${i+2} · Das ist wichtig</strong><p>${escapeText(x)}</p></div>`).join('')}<div class="fc22-three"><strong>Merksatz</strong><p>${escapeText(l.tip||'Wiederhole den Rechenweg oder die Regel in eigenen Worten.')}</p></div><h4>Beispiele zum Nachvollziehen</h4><ol>${examples.slice(0,5).map(ex=>`<li>${escapeText(ex)}</li>`).join('')}</ol>${examples.length<5?'<p>Weitere Beispiele findest du in der vollständigen Lektion.</p>':''}</div>`;}
function readingView(){const l=guideId?lesson(guideId):sampleLesson();return heading('Zusätzliche Lernhilfe','Ein Thema in kleinen, farbig getrennten Schritten lesen. Du kannst die Schrift vergrößern und die Beispiele einzeln betrachten.')+`<label class="fc22-field">Lernthema suchen <input id="fc22-search-lesson" type="search" placeholder="Zum Beispiel Brüche oder Satzbau"></label><div id="fc22-search-results"></div><div class="fc22-btnrow"><button class="fc22-button secondary" data-fc22-size="up">A+ größere Schrift</button><button class="fc22-button secondary" data-fc22-size="down">A− kleinere Schrift</button></div>`+(l?readerGuide(l):'<p>Kein Thema gefunden.</p>')+(l?`<button class="fc22-button" data-fc22-openlesson="${escapeText(l.id)}">Vollständige Erklärung und Test öffnen</button>`:'');}
function drawSearch(q){const search=q.trim().toLocaleLowerCase('de');const e=byId('fc22-search-results');if(!e)return;if(search.length<2){e.innerHTML='';return;}let found=LESSONS.filter(l=>l.title.toLocaleLowerCase('de').includes(search)&&!(l.isExtension||l.kind==='Vertiefung')).slice(0,12);e.innerHTML=`<div class="fc22-cards">${found.map(l=>`<button class="fc22-button secondary" data-fc22-guide="${escapeText(l.id)}">${escapeText(label(l))}</button>`).join('')||'<p>Keine passenden Themen gefunden.</p>'}</div>`;}
function weekStats(){const count=weeklyCount(),g=Math.max(1,Math.min(30,Number(prefs().goal)||4));return {count,g};}
function trend(){const arr=attempts().slice().sort((a,b)=>dateOf(a.date)-dateOf(b.date)).slice(-10);if(!arr.length)return '<p>Starte einen Test, damit eine Entwicklung sichtbar wird.</p>';return `<div class="fc22-kpis" aria-label="Letzte zehn Ergebnisse">${arr.map(a=>`<div title="${escapeText(lesson(a.lessonId)?.title||'Thema')}"><small>${new Date(a.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</small><div class="fc22-bar"><span style="width:${a.correct*10}%"></span></div><strong style="font-size:16px">${a.correct}/10</strong></div>`).join('')}</div>`;}
function progressView(){const p=profile(),{count,g}=weekStats();const bySubject=SUBJECTS.map(s=>{const a=attempts().filter(x=>lesson(x.lessonId)?.subject===s.name);return {name:s.name,tries:a.length,pct:a.length?Math.round(a.reduce((sum,a)=>sum+a.correct,0)*10/a.length):null}}).filter(x=>x.tries);
 return heading('Wochenplan & Lernstatistik','Wochenziel, Wiederholungen und echte Testergebnisse. Die angezeigten Noten sind Übungsnoten, keine Schulnoten.')+noProfile()+`<div class="fc22-kpis"><div><small>Ziel pro Woche</small><strong>${g} Tests</strong></div><div><small>Diese Woche</small><strong>${count}</strong></div><div><small>Offen</small><strong>${Math.max(0,g-count)}</strong></div></div><div class="fc22-bar"><span style="width:${Math.min(100,Math.round(count/g*100))}%"></span></div>`+
 `<label class="fc22-field">Wochenziel festlegen (Tests)<input type="number" id="fc22-goal" min="1" max="30" value="${g}"></label><button class="fc22-button" data-fc22-savegoal>Wochenziel speichern</button><h4>Entwicklung der letzten Tests</h4>${trend()}<h4>Ergebnisse nach Fach</h4><table class="fc22-table"><thead><tr><th>Fach</th><th>Tests</th><th>Richtig</th></tr></thead><tbody>${bySubject.map(x=>`<tr><td>${escapeText(x.name)}</td><td>${x.tries}</td><td>${x.pct} %</td></tr>`).join('')||'<tr><td colspan="3">Noch keine gespeicherten Tests</td></tr>'}</tbody></table><div class="fc22-btnrow"><button class="fc22-button secondary" data-fc22-appstats>Ausführliche Statistik öffnen</button><button class="fc22-button secondary" data-fc22-tab="coach">Wiederholungen ansehen</button></div>`;}
function curriculumView(){return heading('NRW-Lehrplan-Navigator','FixClever orientiert sich an Themen der Lehrpläne in Nordrhein-Westfalen. Eine vollständige Zuordnung jeder einzelnen der 3.100 Einheiten zu amtlichen Kompetenzerwartungen ist noch nicht nachgewiesen.')+
 `<div class="fc22-warn"><strong>Transparente Abdeckung:</strong> Die vorhandenen Lerninhalte sind nicht vollständig amtlich geprüft. Fehlende und doppelte Themen müssen noch fachlich zugeordnet werden.</div><div class="fc22-grid"><div class="fc22-card"><h4>Grundschule – Klassen 1–4</h4><p>Deutsch, Mathematik, Englisch und Sachunterricht: Fähigkeiten entwickeln und üben.</p></div><div class="fc22-card"><h4>Sekundarstufe – Klassen 5–10</h4><p>Kernfächer, Naturwissenschaften, Gesellschaftslehre und Wahlpflichtbereiche: Kompetenzziele vergleichen.</p></div></div><button class="fc22-button" data-fc22-curriculum>Vorhandenen NRW-Navigator öffnen</button>`;}
function backupInfo(){return 'Alle lokalen FixClever-Einstellungen einschließlich Profilen und Lernstatistik werden als JSON-Datei gesichert. Die Datei enthält Kindernamen und Lernergebnisse – bitte privat aufbewahren.'}
function parentsView(){const ps=profileData.profiles||[];const p=profile();const reports=ps.map(x=>{const a=x.attempts||[];return `<tr><td>${escapeText(x.name)}</td><td>${x.grade}</td><td>${a.length}</td><td>${a.length?Math.round(a.reduce((n,t)=>n+t.correct,0)*10/a.length)+' %':'–'}</td></tr>`}).join('');return heading('Elternbereich & Datensicherung','Die Übersicht ist lokal und ohne Anmeldung erreichbar. Sie ist kein passwortgeschützter Erwachsenenbereich.')+
 `<h4>Alle Kinderprofile auf diesem Gerät</h4><table class="fc22-table"><thead><tr><th>Name</th><th>Klasse</th><th>Tests</th><th>Richtig</th></tr></thead><tbody>${reports||'<tr><td colspan="4">Noch keine Profile angelegt</td></tr>'}</tbody></table><div class="fc22-note">Das Wochenziel gilt jeweils für das aktive Profil. Über die Profilauswahl oben in FixClever kannst du andere Kinder auswählen.</div><button class="fc22-button secondary" data-fc22-tab="progress">Lernziel einstellen</button><h4>Lokale Datensicherung</h4><p>${escapeText(backupInfo())}</p><div class="fc22-btnrow"><button class="fc22-button" data-fc22-export>Datensicherung herunterladen</button></div><label class="fc22-field">Sicherung wiederherstellen<input type="file" id="fc22-import" accept=".json,application/json"></label><div class="fc22-warn">Beim Wiederherstellen werden bestehende lokale Profile und Ergebnisse ersetzt. Bitte vorher eine Sicherung der aktuellen Daten erstellen.</div>`;}
function backupExport(){
 const values={};
 for(let i=0;i<localStorage.length;i++){
  const key=localStorage.key(i);
  if(key&&/^fixclever[a-z0-9._-]*$/i.test(key))values[key]=localStorage.getItem(key);
 }
 const data={type:'FixCleverBackup',format:1,created:new Date().toISOString(),version:VERSION,values};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='FixClever_Sicherung_'+new Date().toISOString().slice(0,10)+'.json';
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
async function backupImport(file){
 if(!file||file.size>25*1024*1024){alert('Bitte wähle eine FixClever-Sicherung unter 25 MB.');return;}
 let backup;try{backup=JSON.parse(await file.text())}catch{alert('Die Datei ist keine gültige JSON-Sicherung.');return;}
 let values=null;
 if(backup?.type==='FixCleverBackup'&&backup.format===1&&backup.values&&typeof backup.values==='object'&&!Array.isArray(backup.values))values=backup.values;
 else if(backup?.format==='FixClever-Backup'&&backup.version===2&&backup.data&&typeof backup.data==='object'&&!Array.isArray(backup.data)){
  values={};for(const [k,v] of Object.entries(backup.data))values[k]=JSON.stringify(v);
 }
 if(!values){alert('Diese Sicherung wird nicht unterstützt.');return;}
 const keys=Object.keys(values);
 if(!keys.length||keys.length>300||keys.some(k=>!/^fixclever[a-z0-9._-]*$/i.test(k)||typeof values[k]!=='string'||values[k].length>10*1024*1024)){
  alert('Die Sicherung enthält ungültige Daten.');return;
 }
 const pdata=values['fixclever-profiles-v1'];
 if(pdata){let p;try{p=JSON.parse(pdata)}catch{alert('Profildaten sind beschädigt.');return;}
  if(!p||!Array.isArray(p.profiles)||p.profiles.length>30||p.profiles.some(x=>!x||typeof x.id!=='string'||typeof x.name!=='string'||!Array.isArray(x.attempts))){alert('Die Profildaten sind ungültig.');return;}
 }
 if(!confirm('Achtung: Diese Sicherung ersetzt vorhandene FixClever-Profile und Ergebnisse. Bitte vorher die jetzigen Daten sichern. Trotzdem wiederherstellen?'))return;
 const prior={};try{
  const old=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^fixclever[a-z0-9._-]*$/i.test(k)){old.push(k);prior[k]=localStorage.getItem(k);}}
  for(const k of old)localStorage.removeItem(k);
  for(const k of keys)localStorage.setItem(k,values[k]);
  alert('Die Daten wurden wiederhergestellt. FixClever wird neu geladen.');location.reload();
 }catch{
  try{const current=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^fixclever[a-z0-9._-]*$/i.test(k))current.push(k);}
   for(const k of current)localStorage.removeItem(k);for(const [k,v] of Object.entries(prior))localStorage.setItem(k,v);
  }catch{}
  alert('Die Wiederherstellung konnte nicht abgeschlossen werden. Die vorherigen Daten wurden, soweit möglich, zurückgesetzt.');
 }
}
const safeOpenLesson=id=>{close();const l=lesson(id);if(l)openLesson(l.id)};
dialog.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-fc22-close')){close();return;}
 if(b.hasAttribute('data-fc22-profile')){close();document.querySelector('[data-quiz-action="profiles"]')?.click();return;}
 if(b.hasAttribute('data-fc22-openlesson')){safeOpenLesson(b.dataset.fc22Openlesson);return;}
 if(b.hasAttribute('data-fc22-practice')){const mode={Mathe:'math',Deutsch:'german',Englisch:'english',Geschichte:'history',Musik:'music'}[b.dataset.fc22Practice]||'german';startPractice(mode);return;}
 if(b.hasAttribute('data-fc22-tab')){work.kind=null;show(b.dataset.fc22Tab);return;}
 if(b.hasAttribute('data-fc22-start')){startPractice(b.dataset.fc22Start,b.dataset.fc22Kind);return;}
 if(b.hasAttribute('data-fc22-answer')){markAnswer(+b.dataset.fc22Answer);return;}
 if(b.hasAttribute('data-fc22-next')){nextPractice();return;}
 if(b.hasAttribute('data-fc22-repeat')){startPractice(work.mode,work.kind);return;}
 if(b.hasAttribute('data-fc22-guide')){guideId=b.dataset.fc22Guide;show('reading');return;}
 if(b.hasAttribute('data-fc22-size')){const a=byId('fc22-content');const size=Math.max(16,Math.min(28,parseInt(a.style.getPropertyValue('--reader-size'))||18)+(b.dataset.fc22Size==='up'?2:-2));a.style.setProperty('--reader-size',size+'px');return;}
 if(b.hasAttribute('data-fc22-savegoal')){if(!profile()){alert('Bitte zuerst ein Kinderprofil wählen.');return;}const n=Number(byId('fc22-goal')?.value);if(!Number.isInteger(n)||n<1||n>30){alert('Bitte ein Ziel zwischen 1 und 30 Tests eingeben.');return;}prefs().goal=n;persist22();show('progress');return;}
 if(b.hasAttribute('data-fc22-appstats')){close();document.querySelector('[data-quiz-action="stats"]')?.click();return;}
 if(b.hasAttribute('data-fc22-curriculum')){close();byId('nrw-curriculum-nav')?.click();return;}
 if(b.hasAttribute('data-fc22-export')){try{backupExport()}catch{alert('Die Datensicherung konnte nicht erstellt werden.')}}
});
dialog.addEventListener('input',e=>{if(e.target.id==='fc22-search-lesson')drawSearch(e.target.value)});
dialog.addEventListener('change',e=>{if(e.target.id==='fc22-import')backupImport(e.target.files?.[0]);});
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
// Direkt in jeder Lektion eine schrittweise Lernhilfe anbieten, ohne die Originaltexte zu verändern.
if(typeof renderReader==='function'){
 const former=renderReader;renderReader=function(){former();const l=state.lesson;if(!l)return;const tools=document.querySelector('#reader .reader-tools');if(!tools||tools.querySelector('.fc22-lesson-button'))return;const btn=document.createElement('button');btn.type='button';btn.className='fc22-lesson-button';btn.textContent='✦ Einfach erklärt';btn.addEventListener('click',()=>{guideId=l.id;work.kind=null;open('reading')});tools.append(btn);};
}
// Kurze Speichermeldung, die nichts an bestehenden Benutzerprofilen ändert.
window.FixCleverLernzentrale={version:VERSION,open:()=>open('coach')};
})();


;

/* FixClever 2.3.1 – Offline Lernstudio & barrierearme Sprachausgabe. Keine Drittanbieter oder Server. */
(function(){
'use strict';
if(!Array.isArray(LESSONS)||!Array.isArray(SUBJECTS)||typeof child!=='function')return;
const VERSION='2.3.1', KEY='fixclever-studio-v230';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readStore=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}};
let db=readStore();if(!db.profiles||typeof db.profiles!=='object')db.profiles={};
if(!db.voice||typeof db.voice!=='object')db.voice={rate:.92,pitch:1,preferred:'',mode:'calm'};
if(!['leicht','normal','knifflig'].includes(db.level))db.level='normal';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch{return false}};
const profile=()=>typeof child==='function'?child():null;
const pid=()=>profile()?.id||'guest';
const pdata=()=>{const id=pid();if(!db.profiles[id])db.profiles[id]={history:[],schedule:{},daily:{},examCount:0};return db.profiles[id]};
const grade=()=>profile()?.grade||state?.grade||5;
const originals=()=>LESSONS.filter(l=>!l.isExtension&&l.kind!=='Vertiefung'&&l.subject);
const findLesson=id=>LESSONS.find(l=>l.id===id);
const nl=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const shuffle=a=>{let out=[...a];for(let i=out.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
const take=(a,n)=>shuffle(a).slice(0,n);
const profileAttempts=()=>Array.isArray(profile()?.attempts)?profile().attempts:[];
const btn=(label,act,cls='')=>`<button type="button" class="fc23-btn ${cls}" data-fc23="${act}">${esc(label)}</button>`;
const title=(name,description)=>`<h3>${esc(name)}</h3><p class="fc23-muted">${esc(description)}</p>`;
const lecture=l=>`${l.subject} · Klasse ${l.grade} · ${l.title}`;
const dueIntervals=[1,3,7,14,30,60];
function record(lessonId,score,total,kind){
 if(!profile())return;
 const p=pdata(),now=Date.now(),ratio=total?score/total:0;
 const prev=p.schedule[lessonId]||{stage:0},stage=ratio>=.8?Math.min(5,(prev.stage||0)+1):0;
 p.schedule[lessonId]={stage,last:new Date(now).toISOString(),due:new Date(now+dueIntervals[stage]*86400000).toISOString(),ratio};
 p.history.push({lessonId,date:new Date(now).toISOString(),score,total,kind});
 if(p.history.length>600)p.history=p.history.slice(-600);
 save();
}
function weakLessons(){
 const scores=new Map();
 for(const a of profileAttempts()){
  const r=scores.get(a.lessonId)||{sum:0,n:0};r.sum+=a.correct/10;r.n++;scores.set(a.lessonId,r);
 }
 for(const a of pdata().history||[]){const r=scores.get(a.lessonId)||{sum:0,n:0};r.sum+=a.score/Math.max(1,a.total);r.n++;scores.set(a.lessonId,r)}
 return [...scores].filter(([id,r])=>r.sum/r.n<.8).sort((a,b)=>(a[1].sum/a[1].n)-(b[1].sum/b[1].n)).map(([id])=>findLesson(id)).filter(Boolean);
}
function recommend(subject){const weak=weakLessons().filter(l=>!subject||l.subject===subject);if(weak.length)return weak[0];return originals().find(l=>l.grade===grade()&&(!subject||l.subject===subject))||originals()[0]}
function dueLessons(){const sched=pdata().schedule;const today=Date.now();return Object.entries(sched).filter(([id,s])=>s.due&&Date.parse(s.due)<=today&&findLesson(id)).map(([id])=>findLesson(id));}

/* Voice uses browser-native synthesis. Offline availability depends on installed local voices. */
let speaking=false,queue=[],speechSeq=0,spokenBtn=null;
const voiceApi=()=>('speechSynthesis'in window)&&('SpeechSynthesisUtterance'in window);
function allVoices(){return voiceApi()?speechSynthesis.getVoices():[];}
function selectedVoice(lang){let voices=allVoices(),base=lang.toLowerCase().slice(0,2);
 let local=voices.filter(v=>(v.lang||'').toLowerCase().startsWith(base)&&v.localService!==false);
 let all=local.length?local:voices.filter(v=>(v.lang||'').toLowerCase().startsWith(base));
 if(db.voice.preferred){let v=all.find(v=>v.voiceURI===db.voice.preferred);if(v)return v;}
 let score=v=>{let s=0;if(v.localService!==false)s+=20;if(/premium|enhanced|natural|neural|hochwertig|verbessert/i.test(v.name))s+=12;if((v.lang||'').toLowerCase()===lang.toLowerCase())s+=5;if(v.default)s+=2;return s};return all.sort((a,b)=>score(b)-score(a))[0]||null;
}
function stopVoice(){speechSeq++;queue=[];speaking=false;if(voiceApi())speechSynthesis.cancel();if(spokenBtn){spokenBtn.setAttribute('aria-pressed','false');spokenBtn=null}}
const splitVoice=text=>{
 let raw=String(text||'').replace(/\s+/g,' ').replace(/\b([0-9]+)\/([0-9]+)\b/g,'$1 von $2').trim();
 const parts=raw.match(/[^.!?;]+(?:[.!?;]+|$)/g)||[raw],result=[];
 for(let part of parts){part=part.trim();if(!part)continue;while(part.length>195){let cut=part.lastIndexOf(' ',195);if(cut<45)cut=195;result.push(part.slice(0,cut));part=part.slice(cut).trim()}if(part)result.push(part)}return result;
};
function speakText(text,lang='de-DE',trigger=null){
 if(!voiceApi()){alert('Dieses Gerät bietet in diesem Browser keine Vorlesefunktion.');return}
 if(speaking&&spokenBtn===trigger){stopVoice();return}
 stopVoice();const seq=speechSeq;
 queue=splitVoice(text);if(!queue.length)return;spokenBtn=trigger||null;if(trigger)trigger.setAttribute('aria-pressed','true');speaking=true;
 const next=()=>{if(seq!==speechSeq)return;if(!queue.length){speaking=false;if(spokenBtn)spokenBtn.setAttribute('aria-pressed','false');spokenBtn=null;return}
 const part=queue.shift();const u=new SpeechSynthesisUtterance(part);u.lang=lang;u.rate=Number(db.voice.rate)||.92;u.pitch=Number(db.voice.pitch)||1;u.volume=1;
 const v=selectedVoice(lang);if(v)u.voice=v;
 u.onend=()=>{if(seq!==speechSeq)return;window.setTimeout(next,db.voice.mode==='calm'?220:80)};
 u.onerror=()=>{if(seq!==speechSeq)return;stopVoice()};
 try{speechSynthesis.speak(u)}catch{stopVoice()}
 };next();
}
function lessonSpeech(){const l=state?.lesson;if(!l)return;const examples=Array.isArray(l.examples)?l.examples.slice(0,5):[l.example];return [l.title,'Wir lernen Schritt für Schritt.',...(l.explain||[]),'Nun kommen fünf Beispiele.',...examples,'Merke dir:',l.tip].filter(Boolean).join('. ')}
// Capture the existing read-aloud buttons and route them through the same settings.
document.addEventListener('click',event=>{
 const t=event.target.closest('[data-action="speak"],[data-fc-speak]');if(!t)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(t.matches('[data-fc-speak]')){const step=t.closest('.fc-step-card,.fc-step,.fc-aid-step,.fc-stepper')||t.closest('.fc-learning-support');speakText(step?.innerText||state?.lesson?.explain?.join('. ')||'', 'de-DE',t)}
 else speakText(lessonSpeech(),'de-DE',t);
},true);
window.addEventListener('pagehide',stopVoice);

/* Carefully curated exercises in a small offline task bank. */
const deTasks=[
 {g:1,q:'Welches Wort ist ein Nomen?',o:['Hund','schlafen','klein','laut'],a:0,h:'Nomen sind Namen für Dinge, Menschen, Tiere oder Gefühle.',e:'Hund bezeichnet ein Tier und wird großgeschrieben.'},
 {g:2,q:'Welcher Artikel passt zu „Baum“?',o:['der','die','das','denen'],a:0,h:'Sprich das Nomen mit seinem bestimmten Artikel.',e:'Der Baum ist die richtige Grundform.'},
 {g:3,q:'Welches Satzzeichen beendet eine direkte Frage?',o:['?','.','!',':'],a:0,h:'Achte auf die Satzart.',e:'Ein Fragesatz endet normalerweise mit dem Fragezeichen.'},
 {g:4,q:'Welche Zeitform hat „sie ging“?',o:['Präteritum','Präsens','Perfekt','Futur I'],a:0,h:'Frage dich, ob es um Vergangenes geht und ob ein Hilfsverb verwendet wird.',e:'Ging ist die Präteritumform von gehen; ein Hilfsverb fehlt.'},
 {g:5,q:'In welchem Fall steht „dem Freund“ in „Ich helfe dem Freund“?',o:['Dativ','Nominativ','Genitiv','Akkusativ'],a:0,h:'Frage nach dem markierten Satzglied: Wem helfe ich?',e:'Die Frage „Wem?“ zeigt den Dativ an.'},
 {g:6,q:'Ergänze richtig: „Ich weiß, ___ du kommst.“',o:['dass','das','daß','des'],a:0,h:'Hier wird ein Nebensatz eingeleitet.',e:'Die Konjunktion dass leitet den Nebensatz ein.'},
 {g:7,q:'Welches Stilmittel ist „ein Meer aus Lichtern“?',o:['Metapher','Alliteration','Vergleich mit wie','Anapher'],a:0,h:'Die Aussage ist bildlich und verwendet kein „wie“.',e:'„Meer aus Lichtern“ ist eine bildliche Übertragung, also eine Metapher.'},
 {g:8,q:'Welcher Satz enthält einen Relativsatz?',o:['Das Buch, das ich lese, ist spannend.','Ich lese heute ein Buch.','Liest du heute?','Bitte lies das Buch!'],a:0,h:'Relativsätze beschreiben häufig ein Nomen genauer.',e:'„das ich lese“ bezieht sich auf „das Buch“ und ist ein Relativsatz.'},
 {g:9,q:'Was gehört zu einer begründeten Argumentation?',o:['Behauptung und Begründung','Nur eine Überschrift','Nur ein Beispiel ohne Aussage','Nur eine Frage'],a:0,h:'Eine Aussage muss nachvollziehbar gestützt werden.',e:'Eine überzeugende Argumentation enthält eine Behauptung mit einer nachvollziehbaren Begründung.'},
 {g:10,q:'Was ist die Hauptfunktion eines Fazits in einer Erörterung?',o:['Die Ergebnisse zusammenfassen','Neue unbelegte Fakten einführen','Das Thema wechseln','Quellenangaben ersetzen'],a:0,h:'Denke an den Schluss eines strukturierten Textes.',e:'Ein Fazit bündelt die wesentlichen Argumente und zieht eine Schlussfolgerung.'}
];
const enTasks=[
 {g:1,q:'What is the English word for „Haus“?',o:['house','horse','mouse','homework'],a:0,h:'Think of the building where people live.',e:'House bezeichnet ein Haus als Gebäude.'},
 {g:2,q:'Complete: I ___ eight years old.',o:['am','is','are','be'],a:0,h:'Choose the form of be that matches I.',e:'Bei I lautet die Gegenwartsform von to be „am“.'},
 {g:3,q:'Complete: He ___ football every Saturday.',o:['plays','play','playing','played'],a:0,h:'It is a regular habit in the simple present.',e:'He ist dritte Person Singular. Im simple present kommt meist -s hinzu.'},
 {g:4,q:'Complete: Yesterday I ___ to school.',o:['went','go','goes','going'],a:0,h:'Yesterday signals a past event.',e:'Went ist die simple-past-Form von go.'},
 {g:5,q:'Complete: She ___ like milk.',o:["doesn't","don't","isn't","weren't"],a:0,h:'Use the simple-present negative for she.',e:"Doesn't ist die Verneinung bei he, she, it im simple present."},
 {g:6,q:'Complete: I have ___ my homework.',o:['done','did','do','doing'],a:0,h:'The present perfect needs a past participle.',e:'Das past participle von do ist done.'},
 {g:7,q:'Complete: If it rains tomorrow, we ___ at home.',o:['will stay','stayed','stays','have stayed'],a:0,h:'This is a possible future condition.',e:'Im first conditional steht nach if present simple, im Hauptsatz häufig will + Grundform.'},
 {g:8,q:'Complete: The book ___ written in 2020.',o:['was','were','is being','has'],a:0,h:'The sentence is passive and refers to 2020.',e:'Was written ist das Passiv im simple past für ein einzelnes Buch.'},
 {g:9,q:'Complete: She said she ___ tired.',o:['was','is','be','were'],a:0,h:'A past reporting verb often moves the tense back.',e:'In der indirekten Rede wird is nach said normalerweise zu was.'},
 {g:10,q:'Complete: If I had known, I ___ helped.',o:['would have','will','would','had'],a:0,h:'The past situation cannot be changed.',e:'Im third conditional lautet der Hauptsatz would have + past participle.'}
];
function mathTask(g){
 const n=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
 if(g<=1){let a=n(1,9),b=n(1,10);return {q:`${a} + ${b} = ?`,a:a+b,h:'Zähle beim größeren Summanden weiter.',e:`Beginne bei ${a}. Zähle ${b} Schritte weiter. Das Ergebnis ist ${a+b}.`}}
 if(g===2){let a=n(2,9),b=n(2,9);return {q:`${a} · ${b} = ?`,a:a*b,h:'Denke an gleich große Gruppen.',e:`${a} Gruppen mit je ${b} ergeben ${a*b}.`}}
 if(g===3){let a=n(145,479),b=n(112,398);return {q:`${a} + ${b} = ?`,a:a+b,h:'Addiere Einer, Zehner und Hunderter.',e:`Einer: ${a%10}+${b%10}. Zehner und Hunderter danach mit dem Übertrag. Ergebnis: ${a+b}.`}}
 if(g===4){let a=n(3,9),b=n(2,8);return {q:`Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Umfang in cm?`,a:2*(a+b),h:'Alle vier Seitenlängen werden addiert.',e:`Umfang = ${a}+${b}+${a}+${b} = ${2*(a+b)} cm.`}}
 if(g===5)return {q:'1/2 + 1/4 = ? (als gekürzter Bruch)',a:'3/4',h:'Schreibe beide Brüche mit demselben Nenner.',e:'1/2 = 2/4. Dann 2/4 + 1/4 = 3/4.'};
 if(g===6)return {q:'1,50 + 2,25 = ?',a:'3,75',h:'Komma unter Komma schreiben.',e:'1,50 + 2,25 = 3,75.'};
 if(g===7){let a=n(3,9)*10;return {q:`Wie viel sind 20 % von ${a} ?`,a:a/5,h:'20 Prozent sind ein Fünftel.',e:`Teile ${a} durch 5. Das ergibt ${a/5}.`}}
 if(g===8){let x=n(2,9),m=n(2,5),b=n(1,7);return {q:`Für y = ${m}x + ${b}: Wie groß ist y bei x = ${x}?`,a:m*x+b,h:'Setze x in die Funktionsgleichung ein.',e:`y = ${m} · ${x} + ${b} = ${m*x+b}.`}}
 if(g===9)return {q:'Rechtwinkliges Dreieck: Katheten 3 cm und 4 cm. Hypotenuse in cm?',a:5,h:'Benutze die Quadrate der Katheten.',e:'3² + 4² = 9 + 16 = 25. Die Quadratwurzel aus 25 ist 5 cm.'};
 return {q:'Löse: 2x + 5 = 17. Wie groß ist x?',a:6,h:'Zuerst 5 auf beiden Seiten abziehen.',e:'2x + 5 = 17. Also 2x = 12 und x = 6.'};
}
function leveledMathTask(g){
 const actual=db.level==='leicht'?Math.max(1,g-1):db.level==='knifflig'?Math.min(10,g+1):g;
 const t=mathTask(actual);
 if(db.level==='knifflig'&&g===10)return {q:'Löse: x² = 81. Gib die positive Lösung für x an.',a:9,h:'Welche positive Zahl ergibt mit sich selbst multipliziert 81?',e:'9 · 9 = 81. Deshalb ist die gesuchte positive Lösung x = 9.'};
 return t;
}
const mathEquals=(a,b)=>{const s=String(a).trim().replace(/\s/g,'').replace(',','.');if(typeof b==='number')return Number.isFinite(Number(s))&&Math.abs(Number(s)-b)<1e-8;return s===String(b).replace(',','.')};
let tab='coach',exercise=null,exam=null,readingIdx=0,syllables=true,ruler=true,scale=1,voiceTarget='de-DE',currentPassage=null;
const dlg=document.createElement('dialog');dlg.className='fc23-modal';dlg.setAttribute('aria-label','FixClever Lernstudio 2.3');dlg.id='fc23-modal';
dlg.innerHTML='<div class="fc23-head"><div><h2>FixClever Lernstudio</h2><p>Version 2.3.1 · Lernen ohne Internet</p></div><button type="button" class="fc23-close" data-fc23="close">✕ Schließen</button></div><div class="fc23-tabs" role="tablist"></div><div class="fc23-body" id="fc23-body"></div>';
document.body.append(dlg);
const tabs=[['coach','Mein Lerncoach'],['practice','Übungstrainer'],['exam','Klassenarbeit'],['reading','Lesen & Hören'],['games','Lernspiele'],['voice','Stimme'],['parent','Eltern & Backup'],['quality','Lehrplan & Qualität']];
function updateTabs(){dlg.querySelector('.fc23-tabs').innerHTML=tabs.map(([id,label])=>`<button type="button" class="fc23-tab" role="tab" aria-selected="${tab===id}" data-fc23-tab="${id}">${label}</button>`).join('')}
function display(html){updateTabs();$('#fc23-body').innerHTML=html;$('#fc23-body').scrollTop=0}
function open(t='coach'){tab=t;render();if(!dlg.open)dlg.showModal();}
function close(){stopVoice();dlg.close()}
const coachCards=()=>{
 let weak=weakLessons(),due=dueLessons(),p=profile(),today=nl(),d=pdata().daily[today]||{Mathe:false,Deutsch:false,Englisch:false};
 const total=(pdata().history||[]).length+profileAttempts().length;const recent=[...profileAttempts().slice(-5).map(x=>x.correct/10),...(pdata().history||[]).slice(-5).map(x=>x.score/Math.max(1,x.total))];const avg=recent.length?recent.reduce((a,b)=>a+b,0)/recent.length:null;const recommended=avg===null?'Normal':avg<.6?'Leicht':avg>.9?'Schwer':'Normal';
 const rec=['Mathe','Deutsch','Englisch'].map(sub=>recommend(sub)).filter(Boolean);
 let rows=rec.map((l,i)=>`<div class="fc23-card"><span class="fc23-pill">${esc(l.subject)}</span><h4>${esc(l.title)}</h4><p>Klasse ${l.grade} · ${weak.some(x=>x.id===l.id)?'Hier gab es noch Fehler':'Passender Lernstoff'}</p><div class="fc23-actions">${btn('Erklärung','lesson:'+l.id,'secondary')}${btn('Üben','practice:'+l.subject)}</div></div>`).join('');
 return title('Dein persönlicher Lerncoach','Keine Online-KI: Empfehlungen entstehen aus deinen gespeicherten Übungsergebnissen.')+`<div class="fc23-note">Empfohlene Lernstufe aus den letzten Ergebnissen: <strong>${recommended}</strong>. Ändern kannst du sie im Übungstrainer.</div>`+`<div class="fc23-three"><div class="fc23-card"><div class="fc23-kpi">${total}</div>Erfasste Tests und Übungen</div><div class="fc23-card"><div class="fc23-kpi">${weak.length}</div>Themen mit Lernbedarf</div><div class="fc23-card"><div class="fc23-kpi">${due.length}</div>Wiederholungen heute fällig</div></div>`+
 (!p?'<div class="fc23-note">Für persönliche Empfehlungen bitte oben ein Kinderprofil auswählen. Auch ohne Profil kannst du üben.</div>':'')+
 `<h4>Dein Lernplan für heute · ${['Mathe','Deutsch','Englisch'].filter(n=>d[n]).length} von 3 erledigt</h4><div class="fc23-grid">`+[['Mathe',15],['Deutsch',10],['Englisch',10]].map(([name,minutes])=>`<div class="fc23-card"><h4>${name} · ${minutes} Minuten</h4><p>Orientierungswert ohne Zwang oder Timer.</p>${d[name]?'<span class="fc23-pill">Heute erledigt ✓</span>':btn('Als erledigt markieren','done:'+name,'secondary')} ${btn('Jetzt üben','practice:'+name)}</div>`).join('')+'</div>'+
 `<h4>Passende Themen für dich</h4><div class="fc23-grid">${rows}</div>`+
 `<h4>Wiederholen nach Lernintervallen</h4>${due.length?due.slice(0,8).map(l=>`<div class="fc23-card"><strong>${esc(lecture(l))}</strong><div class="fc23-actions">${btn('Erklärung öffnen','lesson:'+l.id)}</div></div>`).join(''):'<div class="fc23-good">Im Moment sind keine Wiederholungen fällig. Nach Übungen plant FixClever Wiederholungen nach 1, 3, 7, 14 und 30 Tagen ein.</div>'}`;
};
function renderPractice(){
 if(exercise?.kind==='math'){return title('Mathe Schritt für Schritt','Schreibe die Lösung selbst. Mit „Tipp“ bekommst du Hilfe, ohne dass die Antwort verraten wird.')+`<div class="fc23-card"><span class="fc23-pill">Mathe · Klasse ${exercise.grade}</span><h4>${esc(exercise.q)}</h4><label class="fc23-field">Deine Lösung<input id="fc23-input" type="text" inputmode="decimal" autocomplete="off" placeholder="Antwort eingeben"></label><div id="fc23-feedback" aria-live="polite"></div><div class="fc23-actions">${btn('Antwort prüfen','checkmath')}${btn('Tipp anzeigen','hintmath','secondary')}${btn('Neue Aufgabe','practice:Mathe','secondary')}</div></div>`}
 if(exercise?.kind==='de'||exercise?.kind==='en'){let t=exercise.task;return title(exercise.kind==='de'?'Deutsch-Trainer':'Englisch-Trainer','Eine Antwort auswählen und sofort die passende Erklärung lesen.')+`<div class="fc23-card"><span class="fc23-pill">${exercise.kind==='de'?'Deutsch':'Englisch'} · Klasse ${t.g}</span><h4>${esc(t.q)}</h4><div id="fc23-choices">${shuffle(t.o.map((x,i)=>({x,i}))).map(opt=>`<button type="button" class="fc23-choice" data-fc23-choice="${opt.i}">${esc(opt.x)}</button>`).join('')}</div><div id="fc23-feedback" aria-live="polite"></div><div class="fc23-actions">${btn('Hinweis','hinttask','secondary')}${btn('Neue Aufgabe','practice:'+(exercise.kind==='de'?'Deutsch':'Englisch'),'secondary')}${exercise.kind==='en'?btn('Satz vorlesen','speak-question','secondary'):''}</div></div>`}
 return title('Deutsch, Mathe und Englisch üben','Die zusätzlichen Übungen sind eine kuratierte Einstiegsauswahl. Die 3.100 vorhandenen Themen und Tests bleiben weiterhin erreichbar.')+
 `<label class="fc23-field">Schwierigkeit<select id="fc23-level"><option value="leicht" ${db.level==='leicht'?'selected':''}>Leicht – Grundlagen</option><option value="normal" ${db.level==='normal'?'selected':''}>Normal</option><option value="knifflig" ${db.level==='knifflig'?'selected':''}>Knifflig – weiterführend</option></select></label>`+
 `<label class="fc23-field">Schwierigkeitsgrad<select id="fc23-difficulty"><option value="leicht" ${pdata().difficulty==='leicht'?'selected':''}>Leicht · kleinere Schritte</option><option value="normal" ${!pdata().difficulty||pdata().difficulty==='normal'?'selected':''}>Normal · passend zur Klasse</option><option value="schwer" ${pdata().difficulty==='schwer'?'selected':''}>Schwer · nächsthöhere Stufe</option></select></label>`+
 '<div class="fc23-grid">'+[['Mathe','Selbst rechnen – mit Tipps und Lösungsweg'],['Deutsch','Rechtschreibung, Grammatik und Textwissen'],['Englisch','Wörter, Satzbau und Zeiten']].map(([s,d])=>`<div class="fc23-card"><h4>${s}</h4><p>${d}</p>${btn('Übung starten','practice:'+s)}</div>`).join('')+'</div>';
}
function startPractice(subject){const current=grade(),level=pdata().difficulty||'normal';const g=Math.max(1,Math.min(10,current+(level==='leicht'?-1:level==='schwer'?1:0)));if(subject==='Mathe'){exercise={kind:'math',...leveledMathTask(g),grade:g,lessonId:recommend('Mathe')?.id||'l1'}}else{const kind=subject==='Deutsch'?'de':'en',a=kind==='de'?deTasks:enTasks;const threshold=Math.max(1,Math.min(10,g+(db.level==='leicht'?-1:db.level==='knifflig'?1:0)));const eligible=a.filter(x=>x.g<=threshold);exercise={kind,task:take(eligible.slice(Math.max(0,eligible.length-4)),1)[0]||a[0],lessonId:recommend(subject)?.id||'l1',locked:false};}tab='practice';render()}
function practiceResult(ok,correct,explanation){const feedback=$('#fc23-feedback');if(!feedback)return;feedback.innerHTML=`<div class="${ok?'fc23-good':'fc23-warn'}"><strong>${ok?'Richtig gelöst!':'Noch nicht ganz.'}</strong><p>${esc(explanation)}</p>${ok?'':`<p>Richtige Lösung: <strong>${esc(correct)}</strong></p>`}</div>`;if(profile())record(exercise.lessonId,ok?1:0,1,'Übung')}
function mathCheck(){if(!exercise||exercise.kind!=='math'||exercise.locked)return;const val=$('#fc23-input')?.value.trim();if(!val){$('#fc23-feedback').innerHTML='<div class="fc23-warn">Bitte gib zuerst deine Lösung ein.</div>';return;}const ok=mathEquals(val,exercise.a);exercise.locked=true;practiceResult(ok,exercise.a,exercise.e)}
function answerTask(i){if(!exercise||exercise.locked)return;const t=exercise.task;exercise.locked=true;const ok=i===t.a;dlg.querySelectorAll('[data-fc23-choice]').forEach(c=>{let ci=Number(c.dataset.fc23Choice);c.disabled=true;(ci===t.a?c.classList.add('correct'):ci===i?c.classList.add('incorrect'):null)});practiceResult(ok,t.o[t.a],t.e)}
function examPool(){
 const g=grade(),subject=exam?.subject||'Alle';
 const ls=shuffle(originals().filter(l=>l.grade===g&&(subject==='Alle'||l.subject===subject)));
 const banks=ls.map(l=>({lesson:l,questions:shuffle(Array.isArray(QUESTIONS[l.id])?QUESTIONS[l.id]:[])}));
 const list=[],used=new Set();
 for(let round=0;round<10&&list.length<10;round++){
  for(const bank of banks){
   const l=bank.lesson,q=bank.questions[round];
   if(!q||!Array.isArray(q.options)||q.options.length<4||!q.options[q.answer]||new Set(q.options).size!==q.options.length||!q.prompt)continue;
   const key=String(q.prompt).trim().toLowerCase();if(used.has(key))continue;
   const right=q.options[q.answer],others=take(q.options.filter(x=>x!==right),3);
   if(others.length!==3)continue;
   list.push({lessonId:l.id,subject:l.subject,prompt:q.prompt,opts:shuffle([right,...others]),right,explanation:q.explanation||l.tip||'',title:l.title});
   used.add(key);if(list.length>=10)break;
  }
 }
 return list;
}
function startExam(subject='Alle',timed=false){exam={subject,timed,items:[],responses:[],index:0,start:Date.now(),submitted:false};exam.items=examPool();tab='exam';render()}
function examView(){
 if(!exam){return title('Klassenarbeit üben','Zehn Aufgaben aus den vorhandenen Lernfragen, ohne Zeitdruck oder mit einer freiwilligen Zeitvorgabe. Die Übungsnote ist keine Schulnote.')+`<div class="fc23-grid"><label class="fc23-field">Fach<select id="fc23-exam-subject"><option value="Alle">Gemischt</option>${['Mathe','Deutsch','Englisch','Geschichte','Musik','Biologie','Erdkunde'].map(s=>`<option>${s}</option>`).join('')}</select></label><label class="fc23-field">Zeitvorgabe<select id="fc23-exam-time"><option value="no">Ohne Zeitdruck</option><option value="yes">20 Minuten als Orientierung</option></select></label></div>${btn('Übungsklassenarbeit starten','startexam')}<div class="fc23-warn">Die Aufgaben stammen aus dem bestehenden Fragenpool. Nicht alle vorhandenen Fragen sind bereits fachlich einzeln überprüft.</div>`;}
 if(exam.items.length<10)return title('Zu wenige Fragen','In dieser Auswahl gibt es nicht genug geeignete Aufgaben. Wähle ein anderes Fach oder die gemischte Klassenarbeit.')+btn('Neue Auswahl','exam-reset');
 if(exam.submitted){let score=exam.items.filter((q,i)=>exam.responses[i]===q.right).length;let pct=Math.round(score*10);return title('Deine Klassenarbeit','Das ist eine Übungsbewertung und keine verbindliche Schulnote.')+`<div class="fc23-good"><div class="fc23-kpi">${score}/10</div><strong>${pct} % richtig</strong><p>${score<6?'Sieh dir die markierten Erklärungen noch einmal an.':'Du hast viele Aufgaben richtig gelöst.'}</p></div>`+exam.items.map((q,i)=>`<div class="fc23-answer"><strong>${i+1}. ${esc(q.prompt)}</strong><p>Deine Antwort: ${esc(exam.responses[i]||'Nicht beantwortet')}</p><p>Richtig: <strong>${esc(q.right)}</strong></p><p class="fc23-muted">${esc(q.explanation)}</p>${exam.responses[i]!==q.right?btn('Thema wiederholen','lesson:'+q.lessonId,'secondary'):''}</div>`).join('')+btn('Neue Klassenarbeit','exam-reset');}
 const q=exam.items[exam.index];return title('Klassenarbeit – Aufgabe '+(exam.index+1)+' von 10','Du kannst die Antworten bis zur Abgabe noch verändern.')+`<div class="fc23-progress"><span style="width:${(exam.index+1)*10}%"></span></div><div class="fc23-card"><span class="fc23-pill">${esc(q.subject)} · ${esc(q.title)}</span><h4>${esc(q.prompt)}</h4>${q.opts.map(o=>`<label class="fc23-field"><span><input type="radio" name="fc23-exam-a" value="${esc(o)}" ${exam.responses[exam.index]===o?'checked':''}> ${esc(o)}</span></label>`).join('')}</div><div class="fc23-actions">${btn('← Zurück','exam-back','secondary')}${btn(exam.index===9?'Abgeben und auswerten':'Nächste Aufgabe →',exam.index===9?'exam-finish':'exam-next')}</div>`+(exam.timed?'<p class="fc23-muted">Zeitvorgabe: 20 Minuten als Lernziel. Der Test wird nicht automatisch abgebrochen.</p>':'');
}
const passages=[
 {g:1,title:'Mila im Garten',syl:'Mi|la sieht ei|ne klei|ne Blu|me. Sie gießt die Blu|me mit Was|ser. Am nächs|ten Tag steht die Blu|me auf|recht.',q:'Was macht Mila?',opts:['Sie gießt eine Blume.','Sie malt ein Bild.','Sie fährt mit dem Bus.','Sie backt Brot.'],answer:0,why:'Im Text steht, dass Mila die Blume gießt.'},
 {g:4,title:'Ein Ausflug in die Bücherei',syl:'In der Bü|che|rei leiht Sa|mi ein Buch über Welt|raum und Pla|ne|ten aus. Er möch|te ver|ste|hen, war|um der Mond manch|mal nur als schma|le Si|chel zu se|hen ist.',q:'Warum leiht Sami das Buch aus?',opts:['Er möchte etwas über den Mond verstehen.','Er will eine Geschichte schreiben.','Er sucht einen Fahrplan.','Er möchte Tiere bestimmen.'],answer:0,why:'Sami interessiert sich für den Mond und die Planeten.'},
 {g:8,title:'Ein Garten für die Stadt',syl:'Ei|ne Klas|se plant ei|nen Ge|mein|schafts|gar|ten. Dort sol|len Men|schen aus der Nach|bar|schaft Ge|mü|se an|bau|en. Vor dem Start prüft die Klas|se, wie viel Son|nen|licht die Pflan|zen brau|chen und wer sich um das Gie|ßen küm|mert.',q:'Welche Aufgabe plant die Klasse vor dem Start?',opts:['Lichtbedarf und Pflege klären','Eine neue Straße bauen','Eine Turnhalle vermieten','Die Bücherei schließen'],answer:0,why:'Die Klasse prüft den Lichtbedarf und die Organisation der Pflege.'}
];
function passage(){return passages.filter(p=>p.g<=grade()).at(-1)||passages[0]}
function renderSyllables(raw){return raw.split(/(\s+)/).map(word=>{if(/^\s+$/.test(word))return word;return word.split('|').map((chunk,i)=>`<span class="${i%2?'fc23-syl-b':'fc23-syl-a'}">${esc(chunk)}</span>`).join('')}).join('')}
const readingView=()=>{const p=passage();currentPassage=p;return title('Lesen, Silben und Hörverstehen','Schrittweise lesen, mit oder ohne farbige Silben. Lass dir den Text bei Bedarf vorlesen.')+`<div class="fc23-card"><h4>${esc(p.title)}</h4><div class="fc23-reading ${ruler?'ruler':''}" style="--fc23-reader-scale:${scale}">${syllables?renderSyllables(p.syl):esc(p.syl.replaceAll('|',''))}</div><div class="fc23-actions">${btn(syllables?'Silbenfarben aus':'Silbenfarben an','syllable','secondary')}${btn(ruler?'Leselinien aus':'Leselinien an','ruler','secondary')}${btn('A+','font-up','secondary')}${btn('A−','font-down','secondary')}${btn('Text vorlesen','readtext','secondary')}</div></div><div class="fc23-card"><h4>Frage zum Text: ${esc(p.q)}</h4><div id="fc23-read-choices">${p.opts.map((a,i)=>`<button class="fc23-choice" data-fc23-read="${i}">${esc(a)}</button>`).join('')}</div><div id="fc23-read-feedback" aria-live="polite"></div></div><div class="fc23-card"><h4>Englisch hören</h4><p>Höre den Satz und wähle danach die passende Übersetzung. Die Vorlesestimme muss auf dem Gerät verfügbar sein.</p>${btn('Englischen Satz anhören','enlisten')}${btn('Englisch-Trainer öffnen','practice:Englisch','secondary')}<p class="fc23-muted">Eine automatische Bewertung der eigenen Aussprache ist offline im Browser nicht zuverlässig verfügbar.</p></div>`;};
let game=null;
function gamesView(){if(game){const t=game.task;return title('Lernspiel: '+game.title,'Lernen ohne Zeitdruck. Nach einer Antwort erklären wir dir die Lösung.')+`<div class="fc23-card"><h4>${esc(t.q)}</h4>${t.o.map((o,i)=>`<button class="fc23-choice" data-fc23-game="${i}">${esc(o)}</button>`).join('')}<div id="fc23-game-feedback"></div></div><div class="fc23-actions">${btn('Noch eine Runde','game:'+game.mode,'secondary')}</div>`;}
 return title('Lernspiele','Kurze Aufgaben für Mathe, Deutsch und Englisch. Ohne Rangliste und ohne Zeitdruck.')+`<div class="fc23-grid">${[['Mathe','Zahlenblitz'],['Deutsch','Wortdetektiv'],['Englisch','Englisch-Quiz']].map(([s,name])=>`<div class="fc23-card"><h4>${name}</h4><p>Mit Sofort-Rückmeldung und Lernhinweis.</p>${btn('Spielen','game:'+s)}</div>`).join('')}</div>`;}
function voiceView(){let voices=allVoices().filter(v=>/^(de|en)/i.test(v.lang||'')&&v.localService!==false);let preferred=selectedVoice('de-DE');
 return title('Natürlichere Sprachausgabe','Nutze eine auf deinem Gerät installierte, möglichst natürliche Stimme. FixClever liest langsamer, in kleineren Sinnabschnitten und mit kurzen Pausen.')+
 `<div class="fc23-card"><label class="fc23-field">Stimme auswählen<select id="fc23-voice"><option value="">Automatisch beste verfügbare Stimme</option>${voices.map(v=>`<option value="${esc(v.voiceURI)}" ${db.voice.preferred===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)}) · lokal verfügbar</option>`).join('')}</select></label><label class="fc23-field">Sprechtempo <input type="range" id="fc23-rate" min="0.65" max="1.15" step="0.05" value="${db.voice.rate}"></label><p>Aktuelles Tempo: <strong id="fc23-rate-label">${db.voice.rate}×</strong></p><label class="fc23-field">Tonhöhe <input type="range" id="fc23-pitch" min="0.85" max="1.15" step="0.05" value="${db.voice.pitch}"></label><label class="fc23-field">Sprechweise<select id="fc23-mode"><option value="calm" ${db.voice.mode==='calm'?'selected':''}>Ruhig mit längeren Pausen</option><option value="normal" ${db.voice.mode==='normal'?'selected':''}>Flüssig mit kurzen Pausen</option></select></label><div class="fc23-actions">${btn('Stimme testen','voice-test')}${btn('Vorlesen stoppen','voice-stop','secondary')}${btn('Einstellungen speichern','voice-save')}</div><p class="fc23-muted">${preferred?'Automatisch gewählte Stimme: '+esc(preferred.name):'Es wurde noch keine deutsche Stimme erkannt.'}</p></div><div class="fc23-warn">Wichtig: FixClever kann keine hochwertigen Stimmen installieren. Nur auf dem Gerät verfügbare Stimmen funktionieren zuverlässig offline. Browser können in der Stimmauswahl auch Online-Stimmen anzeigen.</div>`;
}
function parentView(){let p=profile(),last=(pdata().history||[]).slice(-20),goal=Number(pdata().weeklyGoal)||4;
 let old=profileAttempts(),ratio=old.length?Math.round(old.reduce((s,a)=>s+a.correct,0)*10/old.length):null;
 return title('Elternbereich, Fortschritt und Datensicherung','Alle Daten bleiben lokal. Dieser Bereich ist nicht mit einem Eltern-Passwort gesichert.')+
 `<div class="fc23-three"><div class="fc23-card"><div class="fc23-kpi">${old.length}</div>Bisherige benotete Übungstests</div><div class="fc23-card"><div class="fc23-kpi">${ratio===null?'–':ratio+' %'}</div>Antworten richtig</div><div class="fc23-card"><div class="fc23-kpi">${(pdata().history||[]).length}</div>Weitere Übungen</div></div><label class="fc23-field">Wochenziel: Anzahl Lernübungen<input type="number" id="fc23-weekgoal" min="1" max="30" value="${goal}"></label>${btn('Wochenziel speichern','save-goal')}`+
 `<h4>Letzte Übungen</h4>${last.length?last.slice().reverse().slice(0,8).map(x=>`<p class="fc23-muted">${new Date(x.date).toLocaleDateString('de-DE')} · ${esc(findLesson(x.lessonId)?.title||'Lernübung')} · ${x.score}/${x.total}</p>`).join(''):'<p>Noch keine Ergebnisse in den neuen Übungen.</p>'}`+
 `<h4>Sicherungsdatei</h4><p>Sichere die Kinderprofile, Testergebnisse und Einstellungen als JSON. Bewahre die Datei privat auf.</p><div class="fc23-actions">${btn('Alle Daten sichern','export')}${btn('Bisherige Lernzentrale öffnen','old-hub','secondary')}</div><label class="fc23-field">Sicherung wiederherstellen<input type="file" id="fc23-import" accept=".json,application/json"></label><div class="fc23-warn">Beim Wiederherstellen werden vorhandene lokale FixClever-Daten ersetzt. Erstelle vorher eine neue Sicherung.</div>`;
}
function checkQuality(){const base=originals(),ids=new Set(),named=new Set();let dupeID=0,dupeName=0,under5=0,under10=0,invalid=0;
 for(let l of LESSONS){if(ids.has(l.id))dupeID++;ids.add(l.id)}
 for(let l of base){let name=`${l.subject}/${l.grade}/${l.title.trim().toLowerCase()}`;if(named.has(name))dupeName++;named.add(name);if(!Array.isArray(l.examples)||l.examples.length<5)under5++;let qs=QUESTIONS[l.id];if(!Array.isArray(qs)||qs.length<10)under10++;if(Array.isArray(qs))for(let q of qs){if(!Array.isArray(q.options)||new Set(q.options).size!==q.options.length||!Number.isInteger(q.answer)||!q.options[q.answer])invalid++;}}
 return {base:base.length,entries:LESSONS.length,dupeID,dupeName,under5,under10,invalid}
}
function qualityView(){const numbers=checkQuality(),g=grade();let grades=[1,2,3,4,5,6,7,8,9,10];let main=['Mathe','Deutsch','Englisch'];
 return title('Qualitätskontrolle und NRW-Lehrplan','Die Bestandsprüfung zeigt strukturelle Auffälligkeiten. Sie ist keine amtliche Lehrplan- oder fachliche Einzelprüfung.')+
 `<div class="fc23-quality">${[['Lerneinheiten',numbers.entries],['Grundthemen',numbers.base],['Doppelte IDs',numbers.dupeID],['Gleichnamige Grundthemen',numbers.dupeName],['Weniger als 5 Beispiele',numbers.under5],['Weniger als 10 Fragen',numbers.under10],['Unklare Antwortstruktur',numbers.invalid]].map(([a,b])=>`<div><strong>${b}</strong>${a}</div>`).join('')}</div>`+
 '<h4>Grundthemen in den Hauptfächern nach Klasse</h4><div style="overflow-x:auto"><table class="fc23-card" style="width:100%;border-collapse:collapse;text-align:center"><tr><th>Klasse</th><th>Deutsch</th><th>Mathe</th><th>Englisch</th></tr>'+grades.map(g=>`<tr><td>${g}</td>${main.map(s=>`<td>${originals().filter(l=>l.subject===s&&l.grade===g).length}</td>`).join('')}</tr>`).join('')+'</table></div>'+
 `<div class="fc23-warn">Die genaue Kompetenzzuordnung zu offiziellen NRW-Lehrplänen und die fachliche Eindeutigkeit aller alten Aufgaben sind noch nicht vollständig nachgewiesen. Die Zahlen bezeichnen vorhandene Grundthemen, nicht eine offizielle Lehrplanquote.</div>${btn('Vorhandenen NRW-Navigator öffnen','open-curriculum')}`;
}
function render(){const contents={coach:coachCards,practice:renderPractice,exam:examView,reading:readingView,games:gamesView,voice:voiceView,parent:parentView,quality:qualityView};display(contents[tab]?.()||coachCards())}
function exportData(){let values={};for(let i=0;i<localStorage.length;i++){let k=localStorage.key(i);if(k&&/^fixclever[a-z0-9._-]*$/i.test(k))values[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify({type:'FixCleverBackup',format:1,created:new Date().toISOString(),version:VERSION,values},null,2)],{type:'application/json'});let url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='FixClever_Backup_'+nl()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000)}
async function importData(file){if(!file||file.size>20*1024*1024){alert('Bitte eine Sicherung unter 20 MB auswählen.');return}let data;try{data=JSON.parse(await file.text())}catch{alert('Ungültige JSON-Datei.');return}
 const values=data?.type==='FixCleverBackup'&&data.format===1&&data.values;if(!values||typeof values!=='object'||Array.isArray(values)){alert('Keine unterstützte FixClever-Sicherung.');return}
 const keys=Object.keys(values);if(!keys.length||keys.length>300||keys.some(k=>!/^fixclever[a-z0-9._-]*$/i.test(k)||typeof values[k]!=='string'||values[k].length>10*1024*1024)){alert('Ungültige Inhalte der Sicherung.');return}
 if(values['fixclever-profiles-v1']){let p;try{p=JSON.parse(values['fixclever-profiles-v1'])}catch{alert('Fehler in den Profilen.');return}if(!p||!Array.isArray(p.profiles)||p.profiles.length>30||p.profiles.some(v=>!v||typeof v.name!=='string'||!Array.isArray(v.attempts))){alert('Ungültige Profilstruktur.');return}}
 if(!confirm('Bestehende lokale Lernstände ersetzen? Bitte sichere zuvor die aktuellen Daten.'))return;
 const old={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^fixclever[a-z0-9._-]*$/i.test(k))old[k]=localStorage.getItem(k)}for(const k of Object.keys(old))localStorage.removeItem(k);for(const k of keys)localStorage.setItem(k,values[k]);alert('Daten wiederhergestellt. Die App lädt neu.');location.reload()}catch(e){try{for(const k of keys)localStorage.removeItem(k);for(const [k,v] of Object.entries(old))localStorage.setItem(k,v)}catch{}alert('Wiederherstellung nicht möglich. Bitte Speicherplatz prüfen.')}}
// Navigation and accessible modal.
const side=document.querySelector('.sidebar nav');if(side){const b=document.createElement('button');b.className='fc23-sidebar';b.type='button';b.textContent='✦ Lernstudio 2.3';b.addEventListener('click',()=>open());side.append(b)}
const float=document.createElement('button');float.className='fc23-float';float.textContent='✦ Lernstudio';float.type='button';float.addEventListener('click',()=>open());document.body.append(float);
const delegate=e=>{
 const target=e.target.closest('[data-fc23]');if(!target)return;const a=target.dataset.fc23;
 if(a==='close'){close();return}
 if(a.startsWith('lesson:')){const id=a.slice(7);close();openLesson(id);return}
 if(a.startsWith('practice:')){startPractice(a.slice(9));return}
 if(a.startsWith('daily:')){if(!profile()){alert('Bitte zuerst ein Kinderprofil auswählen.');return}const sub=a.slice(6),p=pdata(),day=nl();if(!p.daily[day])p.daily[day]={};p.daily[day][sub]=p.daily[day][sub]?0:1;save();render();return}
 if(a.startsWith('done:')){if(!profile()){alert('Bitte wähle zuerst dein Kinderprofil.');return}const day=nl();pdata().daily[day]=pdata().daily[day]||{};pdata().daily[day][a.slice(5)]=true;const sorted=Object.keys(pdata().daily).sort();for(const key of sorted.slice(0,-45))delete pdata().daily[key];save();render();return}
 if(a==='checkmath'){mathCheck();return}
 if(a==='hintmath'){if(exercise)$('#fc23-feedback').innerHTML=`<div class="fc23-note">Tipp: ${esc(exercise.h)}</div>`;return}
 if(a==='hinttask'){if(exercise)$('#fc23-feedback').innerHTML=`<div class="fc23-note">Tipp: ${esc(exercise.task.h)}</div>`;return}
 if(a==='speak-question'){speakText(exercise?.task?.q||'','en-US',target);return}
 if(a==='startexam'){startExam($('#fc23-exam-subject')?.value||'Alle',$('#fc23-exam-time')?.value==='yes');return}
 if(a==='exam-reset'){exam=null;render();return}
 if(a==='exam-back'){if(exam){exam.index=Math.max(0,exam.index-1);render()}return}
 if(a==='exam-next'||a==='exam-finish'){
  if(!exam)return;
  let checked=dlg.querySelector('input[name="fc23-exam-a"]:checked');if(!checked){alert('Bitte beantworte diese Aufgabe.');return}exam.responses[exam.index]=checked.value;
  if(a==='exam-finish'){if(exam.responses.length<10||exam.responses.some(x=>!x)){alert('Bitte alle Aufgaben beantworten.');return}exam.submitted=true;const score=exam.items.filter((q,i)=>exam.responses[i]===q.right).length;
   const byLesson=new Map();exam.items.forEach((q,i)=>{const v=byLesson.get(q.lessonId)||{correct:0,total:0};v.total++;if(exam.responses[i]===q.right)v.correct++;byLesson.set(q.lessonId,v)});for(const [id,s] of byLesson)record(id,s.correct,s.total,'Klassenarbeit');if(profile())pdata().examCount=(pdata().examCount||0)+1;save();
  }else exam.index++;
  render();return;
 }
 if(a==='syllable'){syllables=!syllables;render();return}
 if(a==='ruler'){ruler=!ruler;render();return}
 if(a==='font-up'){scale=Math.min(1.7,scale+.12);render();return}
 if(a==='font-down'){scale=Math.max(.85,scale-.12);render();return}
 if(a==='readtext'){speakText(currentPassage?.syl.replaceAll('|','')||'','de-DE',target);return}
 if(a==='enlisten'){speakText('Hello. My name is Sam. I like reading books.','en-US',target);return}
 if(a.startsWith('game:')){const mode=a.slice(5),t=(mode==='Deutsch'?take(deTasks.filter(x=>x.g<=grade()),1)[0]:take(enTasks.filter(x=>x.g<=grade()),1)[0])||deTasks[0];game={mode,task:t,title:mode==='Deutsch'?'Wortdetektiv':mode==='Englisch'?'Englisch-Quiz':'Zahlenblitz'};
  if(mode==='Mathe'){let mt=mathTask(Math.min(grade(),4));const correct=String(mt.a);game.task={q:mt.q,o:shuffle([correct,String(Number(mt.a)+1),String(Number(mt.a)+2),String(Number(mt.a)-1)]),a:-1,e:mt.e};game.task.a=game.task.o.indexOf(correct)}tab='games';render();return;}
 if(a==='voice-test'){speakText('Hallo! Ich bin dein Lernbegleiter. Wir lesen gemeinsam, in deinem Tempo. Du darfst dir für jeden Schritt so viel Zeit nehmen, wie du brauchst.','de-DE',target);return}
 if(a==='voice-stop'){stopVoice();return}
 if(a==='voice-save'){db.voice.preferred=$('#fc23-voice')?.value||'';db.voice.rate=parseFloat($('#fc23-rate')?.value)||.92;db.voice.pitch=parseFloat($('#fc23-pitch')?.value)||1;db.voice.mode=$('#fc23-mode')?.value||'calm';save();stopVoice();render();return}
 if(a==='save-goal'){const n=Number($('#fc23-weekgoal')?.value);if(!Number.isInteger(n)||n<1||n>30){alert('Bitte eine Zahl von 1 bis 30 wählen.');return}pdata().weeklyGoal=n;save();render();return}
 if(a==='export'){exportData();return}
 if(a==='old-hub'){close();window.FixCleverLernzentrale?.open?.();return}
 if(a==='open-curriculum'){close();$('#nrw-curriculum-nav')?.click();return}
};
dlg.addEventListener('click',delegate);
dlg.addEventListener('click',e=>{const b=e.target.closest('[data-fc23-tab]');if(b){stopVoice();tab=b.dataset.fc23Tab;exercise=null;game=null;exam=null;render()}
 const q=e.target.closest('[data-fc23-choice]');if(q)answerTask(Number(q.dataset.fc23Choice));
 const r=e.target.closest('[data-fc23-read]');if(r){const i=Number(r.dataset.fc23Read),p=currentPassage;dlg.querySelectorAll('[data-fc23-read]').forEach(btn=>{btn.disabled=true;(Number(btn.dataset.fc23Read)===p.answer?btn.classList.add('correct'):Number(btn.dataset.fc23Read)===i?btn.classList.add('incorrect'):null)});$('#fc23-read-feedback').innerHTML=`<div class="${i===p.answer?'fc23-good':'fc23-warn'}">${i===p.answer?'Richtig!':'Nicht ganz.'} ${esc(p.why)}</div>`}
 const gm=e.target.closest('[data-fc23-game]');if(gm&&game&&!game.done){const i=Number(gm.dataset.fc23Game),t=game.task;game.done=true;dlg.querySelectorAll('[data-fc23-game]').forEach(b=>{b.disabled=true;(Number(b.dataset.fc23Game)===t.a?b.classList.add('correct'):Number(b.dataset.fc23Game)===i?b.classList.add('incorrect'):null)});$('#fc23-game-feedback').innerHTML=`<div class="${i===t.a?'fc23-good':'fc23-warn'}">${esc(t.e)} Richtige Antwort: ${esc(t.o[t.a])}</div>`;}
});
dlg.addEventListener('input',e=>{if(e.target.id==='fc23-rate'){$('#fc23-rate-label').textContent=e.target.value+'×'}});
dlg.addEventListener('change',e=>{if(e.target.id==='fc23-import')importData(e.target.files?.[0]);if(e.target.id==='fc23-level'){db.level=e.target.value;save();render()};if(e.target.id==='fc23-difficulty'){pdata().difficulty=e.target.value;save();render()}});
dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
dlg.addEventListener('cancel',e=>{stopVoice()});
// Better assistance where learning takes place, no change to original questions or profiles.
if(typeof renderReader==='function'){const previous=renderReader;renderReader=function(){previous();const tools=document.querySelector('#reader .reader-tools');if(tools&&!tools.querySelector('.fc23-voice-btn')){const settings=document.createElement('button');settings.type='button';settings.className='fc23-voice-btn';settings.textContent='Stimme & Tempo';settings.addEventListener('click',()=>open('voice'));tools.append(settings);const practice=document.createElement('button');practice.type='button';practice.className='fc23-voice-btn';practice.textContent='Mit Hilfe üben';practice.addEventListener('click',()=>startPractice(state.lesson.subject));tools.append(practice)}}}
window.FixCleverStudio={version:VERSION,open,voice:{speak:speakText,stop:stopVoice}};
})();


