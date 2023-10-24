"use strict";
const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
function backdropClickHandler() {
    backdrop.style.display = "none";
    sideDrawer.classList.remove("open");
}
function displayWindowSize() {
    var w = document.documentElement.clientWidth;
    if (w > 768) {
        backdrop.style.display = "none";
    }
    else {
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
