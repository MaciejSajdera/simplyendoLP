import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination } from "swiper/core";
import smoothscroll from "smoothscroll-polyfill";

window.addEventListener("DOMContentLoaded", (event) => {
  //Preloader
  const myPreloader = document.querySelector(".my-preloader");
  const page = document.body;

  setTimeout(() => {
    myPreloader.classList.add("my-preloader-off");
    cookiesNotification();
  }, 1000);

  setTimeout(() => {
    myPreloader.classList.add("my-preloader-none");
    page.classList.add("page-loaded");
  }, 1500);

  const cookiesNotification = () => {
    const cookiesInfo = document.querySelector(".cookie-law-notification");
    const cookiesAcceptButton = document.querySelector("#cookie-law-button");

    if (localStorage.getItem("cookiesAreAccepted")) {
      return;
    } else {
      cookiesInfo.classList.add("cookies-notification-on");
      cookiesAcceptButton.addEventListener("click", () => {
        localStorage.setItem("cookiesAreAccepted", "1");
        cookiesInfo.classList.add("cookies-notification-off");
      });
      return;
    }
  };

  //Scroll down Button
  smoothscroll.polyfill();
  const btnScrollDown = document.querySelector(".scroll-down");

  const scrollDown = (e) => {
    let pageHeight = window.innerHeight;
    window.scrollBy({
      top: pageHeight,
      behavior: "smooth",
    });
  };

  const scrollUp = (e) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const target = document.querySelector("#colophon");

  var rootElement = document.documentElement;

  function callback(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        btnScrollDown.classList.add("scroll-down-bottom");
        btnScrollDown.classList.remove("scroll-down");
        btnScrollDown.removeEventListener("click", scrollDown);
        btnScrollDown.addEventListener("click", scrollUp);
      } else {
        btnScrollDown.classList.add("scroll-down");
        btnScrollDown.classList.remove("scroll-down-bottom");
        btnScrollDown.removeEventListener("click", scrollUp);
        btnScrollDown.addEventListener("click", scrollDown);
      }
    });
  }

  let observer = new IntersectionObserver(callback);

  if (btnScrollDown) {
    observer.observe(target);
  }

  // Swiper
  SwiperCore.use([Navigation, Pagination]);

  const swiper = new Swiper(".swiper-container", {
    direction: "horizontal",
    loop: true,
    slidesPerView: 1.1,
    centeredSlides: true,
    slidesPerGroup: 1,
    grabCursor: true,
    breakpoints: {
      992: {
        slidesPerView: 1,
      },
    },

    pagination: {
      el: ".swiper-pagination",
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Direction aware transitions
  const coursesSection = document.querySelector(".courses");

  if (coursesSection) {
    const nodes = [].slice.call(coursesSection.querySelectorAll("li"), 0);
    const directions = { 0: "top", 1: "right", 2: "bottom", 3: "left" };
    const classNames = ["in", "out"]
      .map((p) => Object.values(directions).map((d) => `${p}-${d}`))
      .reduce((a, b) => a.concat(b));

    const getDirectionKey = (ev, node) => {
      const { width, height, top, left } = node.getBoundingClientRect();
      const l = ev.pageX - (left + window.pageXOffset);
      const t = ev.pageY - (top + window.pageYOffset);
      const x = l - (width / 2) * (width > height ? height / width : 1);
      const y = t - (height / 2) * (height > width ? width / height : 1);
      return Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    };

    class Item {
      constructor(element) {
        this.element = element;
        this.element.addEventListener("mouseover", (ev) =>
          this.update(ev, "in")
        );
        this.element.addEventListener("mouseout", (ev) =>
          this.update(ev, "out")
        );
      }

      update(ev, prefix) {
        this.element.classList.remove(...classNames);
        this.element.classList.add(
          `${prefix}-${directions[getDirectionKey(ev, this.element)]}`
        );
      }
    }

    const mediaQueryDesktop = window.matchMedia("(min-width: 992px)");
    function handleDesktopChange(e) {
      // Check if the media query is true
      if (e.matches) {
        // Then log the following message to the console
        console.log("Media Query Desktop Matched!");
        nodes.forEach((node) => {
          node.className = "";
          new Item(node);
        });
      }
    }

    mediaQueryDesktop.addListener(handleDesktopChange);
    handleDesktopChange(mediaQueryDesktop);

    const mediaQueryMobile = window.matchMedia("(max-width: 992px)");
    function handleMobileChange(e) {
      // Check if the media query is true
      if (e.matches) {
        // Then log the following message to the console
        console.log("Media Query Mobile Matched!");
        nodes.forEach((node) => {
          node.className = "";
          node.classList.add("in-top", "course-box--mobile");
        });
      }
    }

    mediaQueryMobile.addListener(handleMobileChange);
    handleMobileChange(mediaQueryMobile);
  }

  //FORM Modal
  const applyButton = document.querySelectorAll(".apply-button");
  const formModal = document.querySelector("#formModal");

  if (applyButton && formModal) {
    applyButton.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        formModal.classList.add("modal-opened");
        btnScrollDown.classList.add("element-hidden");
      });
    });
  }

  if (formModal) {
    formModal.addEventListener("click", (e) => {
      e.target === formModal.querySelector("#closeFormModal") ||
      e.target === formModal.querySelector("#closeFormModal svg") ||
      e.target === formModal.querySelector("#closeFormModal path")
        ? closeModal()
        : "";
    });
  }

  const closeModal = () => {
    formModal.classList.remove("modal-opened");
    btnScrollDown.classList.remove("element-hidden");
  };

  const form = document.getElementById("my-form");
  const button = document.getElementById("my-form-button");
  const status = document.getElementById("my-form-status");
  const ajaxLoader = status.querySelector("#ajax-loader");

  const courseCheckboxes = document.querySelectorAll(".course-type input");

  courseCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      this.checked ? (this.value = true) : (this.value = false);
    });
  });

  const formAcceptanceCheckbox = document.querySelectorAll(
    ".acceptance-checkbox"
  );

  // if (formAcceptanceCheckbox) {
  //   formAcceptanceCheckbox.forEach((checkbox) => {
  //     checkbox.addEventListener("click", function (e) {
  //       const submitButton = this.closest("FORM").querySelector("button");

  //       submitButton.toggleAttribute("disabled");
  //     });
  //   });
  // }

  const dataProtectionTrigger = document.querySelector(
    ".data-protection__title"
  );
  const dataProtectionExpandIcon = document.querySelector(
    ".data-protection__expand"
  );
  const dataProtectionContent = document.querySelector(
    ".data-protection__content"
  );

  const modalContent = document.querySelector(".modal-content");

  dataProtectionTrigger.addEventListener("click", (e) => {
    dataProtectionExpandIcon.classList.toggle("data-protection__expand--open");
    dataProtectionContent.classList.toggle("data-protection__content--open");
    modalContent.classList.toggle("modal-content--expanded");
    dataProtectionContent.focus();

    dataProtectionContent.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  });

  function success() {
    form.reset();
    button.style = "display: none ";
    status.innerHTML = "Thank you!";
  }

  function error() {
    status.innerHTML =
      "Oops! There was a problem. Please refresh the page and try again.";
  }

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      ajaxLoader.classList.add("loading");
      var data = new FormData(form);
      ajax(form.method, form.action, data, success, error);
    });
  }

  function ajax(method, url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        success(xhr.response, xhr.responseType);
        window.location.href = `${window.location.href}thank-you`;
      } else {
        error(xhr.status, xhr.response, xhr.responseType);
      }
    };
    xhr.send(data);
  }
});
