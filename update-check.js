/* FixClever 3.0.0: fallback for legacy pages that still load update-check.js. */
(()=>{
'use strict';
const VERSION='3.0.0';
const label=document.querySelector('.version');
if(label&&!document.getElementById('fc300-launch'))label.textContent='Version '+VERSION;
// index.html uses fc233-lernhilfen.js, then the 3.0.0 suite for its own update check.
// Do not insert a duplicate button or install a second event listener.
})();
