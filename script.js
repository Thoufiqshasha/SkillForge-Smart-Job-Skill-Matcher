const selectedSkills=new Set();
const skillButtons=[...document.querySelectorAll(".skill-chip")];
const searchInput=document.getElementById("skillSearch");
const skillCount=document.getElementById("skillCount");
const selectionText=document.getElementById("selectionText");
const matchBtn=document.getElementById("matchBtn");
const emptyState=document.getElementById("emptyState");
const results=document.getElementById("results");

function updateUI(){const n=selectedSkills.size;skillCount.textContent=`${n} selected`;selectionText.textContent=n?`${n} skill${n>1?"s":""} selected. Ready to analyze.`:"Select the skills you already know."}
skillButtons.forEach(b=>b.addEventListener("click",()=>{const s=b.dataset.skill;if(selectedSkills.has(s)){selectedSkills.delete(s);b.classList.remove("active")}else{selectedSkills.add(s);b.classList.add("active")}updateUI()}));
searchInput.addEventListener("input",()=>{const q=searchInput.value.toLowerCase();skillButtons.forEach(b=>b.style.display=b.dataset.skill.toLowerCase().includes(q)?"":"none")});
matchBtn.addEventListener("click",async()=>{if(selectedSkills.size<2){selectionText.textContent="Select at least 2 skills to run the analysis.";return}matchBtn.disabled=true;matchBtn.textContent="Analyzing...";try{const r=await fetch("/api/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({skills:[...selectedSkills]})});const data=await r.json();emptyState.classList.add("hidden");results.classList.remove("hidden");const top=data.results[0];results.innerHTML=`<div class="result-summary"><div><div class="eyebrow">TOP MATCH</div><h3>${top.role}</h3></div><span>${top.score}% compatibility</span></div>${data.results.map((x,i)=>`<div class="role-card"><div class="role-top"><div class="role-name">${i+1}. ${x.role}</div><div class="score">${x.score}%</div></div><div class="bar"><div class="fill" style="width:${x.score}%"></div></div><div class="tags">${x.matched.map(s=>`<span class="tag">✓ ${s}</span>`).join("")}${x.missing.map(s=>`<span class="tag missing">+ ${s}</span>`).join("")}</div></div>`).join("")}`}catch(e){selectionText.textContent="Backend connection failed. Make sure Flask is running."}finally{matchBtn.disabled=false;matchBtn.innerHTML='Analyze My Career Fit <span>→</span>'}});
updateUI();
