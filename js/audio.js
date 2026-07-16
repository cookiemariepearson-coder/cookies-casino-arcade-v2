let ctx=null,musicTimer=null,step=0;
function context(){if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(C)ctx=new C()}return ctx}
export async function unlockAudio(){const c=context();if(c?.state==="suspended")await c.resume();tone(330,.08);tone(495,.1,.06)}
export function tone(freq,dur=.08,delay=0,type="triangle",vol=.045){
 const c=context();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;
 o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.02)
}
export function sfx(name){
 if(name==="win")[523,659,784,1046].forEach((f,i)=>tone(f,.16,i*.07));
 else if(name==="bad"){tone(160,.15,0,"sawtooth");tone(100,.18,.08,"sawtooth")}
 else if(name==="coin"){tone(740,.05);tone(980,.07,.05)}
 else if(name==="card"){tone(420,.04);tone(610,.04,.035)}
 else tone(350,.05)
}
export function startMusic(){
 if(musicTimer)return;const notes=[82,98,110,123,110,98];
 musicTimer=setInterval(()=>{tone(notes[step%notes.length],.17,0,"sawtooth",.022);if(step%4===0)tone(523,.05,.03,"triangle",.012);step++},360)
}
export function stopMusic(){clearInterval(musicTimer);musicTimer=null}
export function coinStorm(){
 const layer=document.getElementById("coinStorm");layer.innerHTML="";layer.classList.add("show");
 for(let i=0;i<180;i++){const c=document.createElement("div");c.className="falling-coin";c.textContent="₵";c.style.left=Math.random()*100+"vw";
 c.style.setProperty("--dur",2.5+Math.random()*3.5+"s");c.style.setProperty("--delay",Math.random()*1.8+"s");c.style.setProperty("--drift",(Math.random()-.5)*280+"px");layer.append(c)}
 sfx("win");setTimeout(()=>{layer.classList.remove("show");layer.innerHTML=""},6500)
}
