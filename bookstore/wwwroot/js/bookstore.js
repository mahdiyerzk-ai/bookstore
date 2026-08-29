/* =====================================================
   NAVAK BOOKSTORE - JAVASCRIPT
===================================================== */

/* ================= MOBILE MENU ================= */
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const mobileMenu = document.querySelector(".mobile-menu");
    const backdrop = document.querySelector(".mobile-menu-backdrop");
    const mobileLinks = document.querySelectorAll(".mobile-nav a");

    function openMenu() {
        if (!mobileMenu || !backdrop) return;
        mobileMenu.classList.add("active");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        if (!mobileMenu || !backdrop) return;
        mobileMenu.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (menuToggle) menuToggle.addEventListener("click", openMenu);
    if (menuClose) menuClose.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);

    mobileLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
    });
});

/* ================= HERO SLIDER ================= */
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector("#navakSlider");
    if (!slider) return;

    const slides = slider.querySelectorAll(".navak-slide");
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    const dotsWrapper = slider.querySelector(".slider-dots");

    let currentSlide = 0;
    let autoPlay;

    slides.forEach(function (_, index) {
        const dot = document.createElement("button");
        dot.className = index === 0 ? "dot-btn active" : "dot-btn";
        dot.type = "button";
        dot.setAttribute("aria-label", "رفتن به اسلاید " + (index + 1));

        dot.addEventListener("click", function () {
            goToSlide(index);
            resetAutoPlay();
        });

        dotsWrapper.appendChild(dot);
    });

    const dots = dotsWrapper.querySelectorAll(".dot-btn");

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        currentSlide = index;

        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;

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
        autoPlay = setInterval(nextSlide, 4500);
    }

    function stopAutoPlay() {
        clearInterval(autoPlay);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            prevSlide();
            resetAutoPlay();
        });
    }

    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    startAutoPlay();
});

/* ================= BOOK CAROUSELS - RTL ================= */
document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll("[data-book-carousel]");

    carousels.forEach(function (carousel) {
        const track = carousel.querySelector(".book-carousel-track");
        const nextBtn = carousel.querySelector("[data-carousel-next]");
        const prevBtn = carousel.querySelector("[data-carousel-prev]");

        if (!track || !nextBtn || !prevBtn) return;

        function getScrollAmount() {
            const card = track.querySelector(".product-mini-card");
            if (!card) return 318;

            const gap = 26;
            return card.offsetWidth + gap;
        }

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
    });
});

/* ================= FAVORITE BUTTONS ================= */
document.addEventListener("DOMContentLoaded", function () {
    const favoriteButtons = document.querySelectorAll(".favorite-btn");

    favoriteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            button.classList.toggle("active");

            const icon = button.querySelector("i");
            if (!icon) return;

            icon.classList.toggle("fa-regular");
            icon.classList.toggle("fa-solid");
        });
    });
});

/* ================= AUTH PAGE ================= */
document.addEventListener("DOMContentLoaded", function () {
    const authTabs = document.querySelectorAll(".auth-tab");
    const authForms = document.querySelectorAll(".auth-form");

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
                if (targetForm) targetForm.classList.add("active");
            });
        });
    }

    const passwordButtons = document.querySelectorAll(".toggle-password");

    passwordButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const input = button.parentElement.querySelector("input");
            const icon = button.querySelector("i");

            if (!input || !icon) return;

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    });
});


/* ================= MOBILE SUBMENU ================= */

document.addEventListener("DOMContentLoaded", function () {
    const submenuToggles = document.querySelectorAll(".mobile-submenu-toggle");

    submenuToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            const submenu = toggle.closest(".mobile-submenu");

            if (!submenu) return;

            submenu.classList.toggle("open");

            const isOpen = submenu.classList.contains("open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    });
});

/* ================= FAVORITE / WISHLIST ================= */

document.addEventListener("DOMContentLoaded", function () {
    const WISHLIST_KEY = "navakWishlist";

    function getWishlist() {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    }

    function saveWishlist(items) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    }

    function createBookId(title) {
        return title
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
    }

    function extractBookData(button) {
        const card = button.closest(".product-mini-card, .navak-product-card");

        if (!card) return null;

        const titleEl = card.querySelector("h3");
        const authorEl = card.querySelector(".book-card-content p");
        const imgEl = card.querySelector("img");
        const priceEl = card.querySelector(".book-price strong");
        const metaEls = card.querySelectorAll(".book-meta span");

        if (!titleEl) return null;

        const title = titleEl.textContent.trim();

        return {
            id: card.dataset.bookId || createBookId(title),
            title: title,
            author: authorEl ? authorEl.textContent.trim() : "نویسنده نامشخص",
            image: imgEl ? imgEl.getAttribute("src") : "",
            price: priceEl ? priceEl.textContent.trim() : "",
            meta: Array.from(metaEls).map(function (item) {
                return item.textContent.trim();
            })
        };
    }

    function isBookSaved(bookId) {
        return getWishlist().some(function (book) {
            return book.id === bookId;
        });
    }

    function updateFavoriteButtons() {
        const buttons = document.querySelectorAll(".favorite-btn");

        buttons.forEach(function (button) {
            const book = extractBookData(button);
            if (!book) return;

            const icon = button.querySelector("i");
            const saved = isBookSaved(book.id);

            button.classList.toggle("active", saved);

            if (icon) {
                icon.classList.toggle("fa-solid", saved);
                icon.classList.toggle("fa-regular", !saved);
            }
        });
    }

    function toggleFavorite(button) {
        const book = extractBookData(button);
        if (!book) return;

        let wishlist = getWishlist();

        if (isBookSaved(book.id)) {
            wishlist = wishlist.filter(function (item) {
                return item.id !== book.id;
            });
        } else {
            wishlist.push(book);
        }

        saveWishlist(wishlist);
        updateFavoriteButtons();
        renderWishlistPage();
    }

    document.querySelectorAll(".favorite-btn").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(button);
        });
    });

    function renderWishlistPage() {
        const list = document.querySelector("#wishlistList");
        const count = document.querySelector("#wishlistCount");

        if (!list) return;

        const wishlist = getWishlist();

        if (count) {
            count.textContent = wishlist.length.toLocaleString("fa-IR");
        }

        if (wishlist.length === 0) {
            list.innerHTML = `
        <div class="wishlist-empty">
          <i class="fa-regular fa-heart"></i>
          <h2>هنوز کتابی ذخیره نکردی</h2>
          <p>از صفحه اصلی روی قلب کتاب‌ها بزن تا اینجا نمایش داده شوند.</p>
          <a href="index.html#bestSellers" class="wishlist-back-btn">
            دیدن کتاب‌ها
            <i class="fa-solid fa-arrow-left"></i>
          </a>
        </div>
      `;
            return;
        }

        list.innerHTML = wishlist.map(function (book) {
            const metaHtml = book.meta && book.meta.length
                ? book.meta.map(function (item) {
                    return `<span>${item}</span>`;
                }).join("")
                : "<span>کتاب</span>";

            return `
        <article class="wishlist-item" data-book-id="${book.id}">
          <div class="wishlist-item-img">
            <img src="${book.image}" alt="جلد کتاب ${book.title}">
          </div>

          <div class="wishlist-item-info">
            <h3>${book.title}</h3>
            <p>${book.author}</p>

            <div class="wishlist-item-meta">
              ${metaHtml}
            </div>
          </div>

          <div class="wishlist-item-actions">
            <div class="wishlist-price">
              ${book.price ? book.price + " تومان" : "قیمت نامشخص"}
            </div>

            <a href="#" class="wishlist-buy-btn">
              <i class="fa-solid fa-bag-shopping"></i>
              افزودن
            </a>

            <button class="wishlist-remove-btn" type="button" data-remove-book="${book.id}">
              حذف
            </button>
          </div>
        </article>
      `;
        }).join("");

        document.querySelectorAll("[data-remove-book]").forEach(function (button) {
            button.addEventListener("click", function () {
                const bookId = button.dataset.removeBook;

                const newWishlist = getWishlist().filter(function (book) {
                    return book.id !== bookId;
                });

                saveWishlist(newWishlist);
                renderWishlistPage();
                updateFavoriteButtons();
            });
        });
    }

    const clearButton = document.querySelector("#clearWishlist");

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            saveWishlist([]);
            renderWishlistPage();
            updateFavoriteButtons();
        });
    }

    updateFavoriteButtons();
    renderWishlistPage();
});

/* ================= CONTACT FORM ================= */

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector("#contactForm");
    const contactMessage = document.querySelector("#contactFormMessage");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (contactMessage) {
            contactMessage.textContent = "پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.";
        }

        contactForm.reset();
    });
});