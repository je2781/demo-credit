import {generateBase64FromImage} from './helper.js';

document.addEventListener("DOMContentLoaded", function () {
  const backdrop = document.querySelector(".backdrop") as HTMLDivElement;
  const sideDrawer = document.querySelector(".mobile-nav") as HTMLElement;
  const filledImageContent = document.querySelector(
    ".filled-image__content"
  ) as HTMLElement;
  const blankImageContent = document.querySelector(
    ".blank-image__content"
  ) as HTMLElement;
  const menuToggle = document.querySelector("#side-menu-toggle") as HTMLElement;
  const walletDropdownToggle = document.querySelector(
    "#toggle-wallet"
  ) as HTMLElement;
  const walletListToggle = document.querySelector(
    "#toggle-wallet__list"
  ) as HTMLElement;
  const image = document.querySelector("#image") as HTMLInputElement;
  const dropdown = document.querySelector(
    ".manage-wallet__dropdown"
  ) as HTMLElement;
  const walletList = document.querySelector(
    ".mobile-nav__manage-wallet__item-list"
  ) as HTMLElement;

  function backdropClickHandler() {
    backdrop.style.display = "none";
    sideDrawer.classList.remove("open");
  }

  function displayWindowSize() {
    var w = document.documentElement.clientWidth;

    if (w > 768) {
      backdrop.style.display = "none";
    } else {
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
    } else {
      dropdown.classList.add("open");
    }
  }

  function walletListToggleClickHandler() {
    if (walletList.classList.contains("open")) {
      walletList.classList.remove("open");
      walletList.classList.add("close");
    } else {
      walletList.classList.add("open");
      walletList.classList.remove("close");
    }
  }

  function fileInputChangeHandler(input: HTMLInputElement) {
    generateBase64FromImage(input.files![0]).then((preview) => {
      blankImageContent.style.display = "none";
      filledImageContent.style.display = "block";
      filledImageContent.style.backgroundImage = `url('${preview}')`;
      filledImageContent.style.backgroundSize = "cover";
    });
  }

  backdrop.addEventListener("click", backdropClickHandler);
  menuToggle.addEventListener("click", menuToggleClickHandler);
  walletDropdownToggle.addEventListener(
    "click",
    walletDropdownToggleClickHandler
  );
  walletListToggle.addEventListener("click", walletListToggleClickHandler);
  image.addEventListener("change", fileInputChangeHandler.bind(this, image));
});
