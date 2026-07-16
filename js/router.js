const views=["lobbyView","gameView","storeView","accountView"];
export function showView(id){
  views.forEach(v=>document.getElementById(v)?.classList.toggle("view-active",v===id));
  window.scrollTo({top:0,behavior:"auto"});
}
export function showEntrance(){
  document.getElementById("entranceScreen").classList.add("screen-active");
  document.getElementById("appScreen").classList.remove("screen-active");
}
export function showApp(){
  document.getElementById("entranceScreen").classList.remove("screen-active");
  document.getElementById("appScreen").classList.add("screen-active");
  showView("lobbyView");
}
export function showModal(id){document.getElementById(id)?.classList.add("show")}
export function hideModal(id){document.getElementById(id)?.classList.remove("show")}
