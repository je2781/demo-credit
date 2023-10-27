"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const filledImageContent = document.querySelector(".filled-image__content");
const blankImageContent = document.querySelector(".blank-image__content");
const image = document.querySelector("#image");
const menuToggle = document.querySelector("#side-menu-toggle");
const walletDropdownToggle = document.querySelector("#toggle-wallet");
const walletListToggle = document.querySelector("#toggle-wallet__list");
const dropdown = document.querySelector(".manage-wallet__dropdown");
const walletList = document.querySelector(".mobile-nav__manage-wallet__item-list");
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
    if (dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
    }
    else {
        dropdown.classList.add("open");
    }
}
function walletListToggleClickHandler() {
    if (walletList.classList.contains('open')) {
        walletList.classList.remove('open');
        walletList.classList.add('close');
    }
    else {
        walletList.classList.add("open");
        walletList.classList.remove("close");
    }
}
function fileInputChangeHandler(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const imagePreview = yield generateBase64FromImage(input.files[0]);
        blankImageContent.style.display = 'none';
        filledImageContent.style.display = 'block';
        filledImageContent.style.backgroundImage = `url('${imagePreview}')`;
        filledImageContent.style.backgroundSize = 'cover';
    });
}
backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
walletDropdownToggle.addEventListener("click", walletDropdownToggleClickHandler);
walletListToggle.addEventListener("click", walletListToggleClickHandler);
image.addEventListener("change", fileInputChangeHandler.bind(this, image));
