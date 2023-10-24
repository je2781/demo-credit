const backdrop = document.querySelector(".backdrop") as HTMLDivElement;
const sideDrawer = document.querySelector(".mobile-nav") as HTMLElement;
const menuToggle = document.querySelector("#side-menu-toggle") as HTMLElement;

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function displayWindowSize(){
  var w = document.documentElement.clientWidth;
  
  if(w > 768){
    backdrop.style.display = "none";
  }else{
    backdrop.style.display = "block";
  }
}

function menuToggleClickHandler() {
  window.addEventListener("resize", displayWindowSize);
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
