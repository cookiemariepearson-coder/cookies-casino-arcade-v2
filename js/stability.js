const timers=new Map();

export function clearGameTimer(name){
  const timer=timers.get(name);
  if(!timer)return;
  timer.type==="interval" ? clearInterval(timer.id) : clearTimeout(timer.id);
  timers.delete(name);
}

export function gameTimeout(name,callback,delay){
  clearGameTimer(name);
  const id=setTimeout(()=>{
    timers.delete(name);
    callback();
  },delay);
  timers.set(name,{type:"timeout",id});
  return id;
}

export function gameInterval(name,callback,delay){
  clearGameTimer(name);
  const id=setInterval(callback,delay);
  timers.set(name,{type:"interval",id});
  return id;
}

export function clearGameTimers(prefix=""){
  for(const name of [...timers.keys()]){
    if(!prefix || name.startsWith(prefix))clearGameTimer(name);
  }
}
