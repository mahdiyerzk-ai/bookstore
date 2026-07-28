/* =========================================================
   NAVAK BOOKSTORE
   Clean JavaScript for hero slider and product carousel
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initHeroSlider();
    initBookCarousel();
    initAuthPage();
});

/* =========================
   HERO SLIDER
========================= */
function initHeroSlider() {
    const slider = document.querySelector("#navakSlider");

    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll(".navak-slide"));
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    const dotsWrapper = slider.querySelector(".slider-dots");

    if (!slides.length || !prevBtn || !nextBtn || !dotsWrapper) return;

    let currentSlide = 0;
    let autoPlayId = null;

    slides.forEach(function (_, index) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "dot-btn";
        dot.setAttribute("aria-label", "رفتن به اسلاید " + (index + 1));

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", function () {
            goToSlide(index);
            resetAutoPlay();
        });

        dotsWrapper.appendChild(dot);
    });

    const dots = Array.from(dotsWrapper.querySelectorAll(".dot-btn"));

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        autoPlayId = window.setInterval(nextSlide, 4500);
    }

    function stopAutoPlay() {
        window.clearInterval(autoPlayId);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    nextBtn.addEventListener("click", function () {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener("click", function () {
        prevSlide();
        resetAutoPlay();
    });

    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    startAutoPlay();
}

/* =========================
   PRODUCT CAROUSEL
========================= */
function initBookCarousel() {
    initHorizontalCarousel({
        sectionSelector: ".book-carousel-section",
        trackSelector: ".book-carousel-track",
        cardSelector: ".navak-product-card",
        nextSelector: ".next-book",
        prevSelector: ".prev-book",
        gap: 26
    });

    initHorizontalCarousel({
        sectionSelector: ".products-section",
        trackSelector: ".featured-carousel-track",
        cardSelector: ".book-card",
        nextSelector: ".next-featured",
        prevSelector: ".prev-featured",
        gap: 28
    });
}

function initHorizontalCarousel(config) {
    const carousel = document.querySelector(config.sectionSelector);

    if (!carousel) return;

    const track = carousel.querySelector(config.trackSelector);
    const nextBtn = carousel.querySelector(config.nextSelector);
    const prevBtn = carousel.querySelector(config.prevSelector);

    if (!track || !nextBtn || !prevBtn) return;

    function getScrollAmount() {
        const card = track.querySelector(config.cardSelector);
        if (!card) return 320;

        return card.offsetWidth + config.gap;
    }

    /*
      RTL behavior:
      - The right button is "next".
      - In RTL scroll containers, moving toward the next items is a negative horizontal scroll.
    */
    nextBtn.addEventListener("click", function () {
        track.scrollBy({
            left: -getScrollAmount(),
            behavior: "smooth"
        });
    });

    prevBtn.addEventListener("click", function () {
        track.scrollBy({
            left: getScrollAmount(),
            behavior: "smooth"
        });
    });
}


/* =========================
   MOBILE BURGER MENU
========================= */
function initMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header-nav");
    const backdrop = document.querySelector(".menu-backdrop");

    if (!toggle || !nav) return;

    function openMenu() {
        document.body.classList.add("menu-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "بستن منو");
    }

    function closeMenu() {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "باز کردن منو");
    }

    toggle.addEventListener("click", function () {
        if (document.body.classList.contains("menu-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (backdrop) {
        backdrop.addEventListener("click", closeMenu);
    }

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 920) {
            closeMenu();
        }
    });
}

/* =========================
   AUTH PAGE TABS + PASSWORD
========================= */
function initAuthPage() {
    const authTabs = Array.from(document.querySelectorAll(".auth-tab"));
    const authForms = Array.from(document.querySelectorAll(".auth-form"));

    if (authTabs.length && authForms.length) {
        authTabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                const target = tab.dataset.authTab;

                authTabs.forEach(function (item) {
                    item.classList.remove("active");
                });

                authForms.forEach(function (form) {
                    form.classList.remove("active");
                });

                tab.classList.add("active");

                const targetForm = document.querySelector("#" + target + "Form");
                if (targetForm) {
                    targetForm.classList.add("active");
                }
            });
        });
    }

    document.querySelectorAll(".toggle-password").forEach(function (button) {
        button.addEventListener("click", function () {
            const input = button.parentElement.querySelector("input");
            const icon = button.querySelector("i");

            if (!input || !icon) return;

            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            icon.classList.toggle("fa-eye", !isHidden);
            icon.classList.toggle("fa-eye-slash", isHidden);
        });
    });
}
