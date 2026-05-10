export function confettiBurst(){
 const wrap=document.createElement('div'); wrap.className='confetti-wrap';
 for(let i=0;i<80;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.animationDelay=Math.random()*0.5+'s';s.style.transform=`rotate(${Math.random()*360}deg)`;wrap.appendChild(s)}
 document.body.appendChild(wrap); setTimeout(()=>wrap.remove(),2500);
}
