/* Version and update notification; no silent replacement. */
(function(){
 const VERSION='1.2.0';
 const versionEl=document.querySelector('.version');
 if(!versionEl)return;
 versionEl.textContent='Version '+VERSION+' · '+LESSONS.length+' Themen';
 const button=document.createElement('button');button.className='text-button';button.textContent='Nach Update suchen';button.style.marginTop='10px';
 versionEl.after(button);
 button.addEventListener('click',async()=>{
  button.disabled=true;button.textContent='Prüfe Version …';
  try{
   const response=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});
   if(!response.ok)throw Error('HTTP '+response.status);
   const data=await response.json();
   if(!/^\d+\.\d+\.\d+$/.test(data.version))throw Error('Ungültige Versionsdatei');
   const cmp=v=>v.split('.').map(Number);const [a,b]=[cmp(data.version),cmp(VERSION)];
   const newer=a.some((n,i)=>n>b[i]&&a.slice(0,i).every((x,j)=>x===b[j]));
   if(newer){if(window.confirm('Neue Version '+data.version+' gefunden. Seite aktualisieren?'))location.reload();}
   else alert('Du verwendest FixClever '+VERSION+'. Keine neuere veröffentlichte Version gemeldet.');
  }catch(e){alert('Updateprüfung nicht möglich: '+e.message);}
  finally{button.disabled=false;button.textContent='Nach Update suchen';}
 });
})();
