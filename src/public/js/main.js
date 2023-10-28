"use strict";
const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const filledImageContent = document.querySelector(".filled-image__content");
const blankImageContent = document.querySelector(".blank-image__content");
const menuToggle = document.querySelector("#side-menu-toggle");
const walletListToggle = document.querySelector("#toggle-wallet__list");
const dropdown = document.querySelector(".manage-wallet__dropdown");
const walletList = document.querySelector(".mobile-nav__manage-wallet__item-list");
const walletDropdownToggle = document.querySelector("#toggle-wallet");
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
function walletDropdownToggleClickHandler() {
    if (dropdown.classList.contains("open")) {
        dropdown.classList.remove("open");
    }
    else {
        dropdown.classList.add("open");
    }
}
function walletListToggleClickHandler() {
    if (walletList.classList.contains("open")) {
        walletList.classList.remove("open");
        walletList.classList.add("close");
    }
    else {
        walletList.classList.add("open");
        walletList.classList.remove("close");
    }
}
function fileInputChangeHandler(input) {
    generateBase64FromImage(input.files[0]).then((preview) => {
        filledImageContent.style.backgroundImage = `url('${preview}')`;
    });
    blankImageContent.style.display = "none";
    filledImageContent.style.display = "block";
    filledImageContent.style.backgroundSize = "cover";
}
backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
walletDropdownToggle.addEventListener("click", walletDropdownToggleClickHandler);
walletListToggle.addEventListener("click", walletListToggleClickHandler);
