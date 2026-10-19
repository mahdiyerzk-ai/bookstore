/* =========================
   NAVAK CART (localStorage)
   Loaded globally from _Layout so the header badge works on every page.
========================= */

document.addEventListener("DOMContentLoaded", function () {
    const CART_KEY = "navakCart";
    const FREE_SHIPPING_FROM = 350000;
    const DISCOUNT_FROM = 500000;
    const DISCOUNT_RATE = 0.08;
    const SHIPPING_COST = 35000;
    const MAX_QTY = 20;

    const cartItemsList = document.querySelector("#cartItemsList");
    const cartItemsCount = document.querySelector("#cartItemsCount");
    const cartSubtotal = document.querySelector("#cartSubtotal");
    const cartShipping = document.querySelector("#cartShipping");
    const cartDiscount = document.querySelector("#cartDiscount");
    const cartTotal = document.querySelector("#cartTotal");
    const clearCartBtn = document.querySelector("#clearCartBtn");
    const checkoutBtn = document.querySelector("#checkoutBtn");

    /* ---------- storage ---------- */

    function getCart() {
        try {
            const data = JSON.parse(localStorage.getItem(CART_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (e) { /* storage full / blocked */ }
        updateCartBadge();
    }

    /* ---------- helpers ---------- */

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function toEnglishDigits(value) {
        return String(value)
            .replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); })
            .replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); });
    }

    function parsePrice(value) {
        if (!value) return 0;
        return Number(toEnglishDigits(value).replace(/[^\d]/g, "") || 0);
    }

    function formatPrice(value) {
        return Number(value || 0).toLocaleString("fa-IR") + " تومان";
    }

    function createBookId(title) {
        return title.trim().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
    }

    // "img/book-1.jpg" is relative to the current page; store an absolute path
    // so the image still loads on /Cart.
    function absoluteImagePath(img) {
        if (!img) return "";
        try {
            return new URL(img.getAttribute("src"), document.baseURI).pathname;
        } catch (e) {
            return img.getAttribute("src") || "";
        }
    }

    function extractProductData(button) {
        const card = button.closest(
            ".shop-product-card, .navak-product-card, .product-mini-card, .wishlist-item"
        );
        if (!card) return null;

        const titleEl = card.querySelector("h3");
        if (!titleEl) return null;

        const authorEl =
            card.querySelector(".shop-product-info p") ||
            card.querySelector(".book-card-content p") ||
            card.querySelector(".wishlist-item-info p");

        const priceEl =
            card.querySelector(".shop-product-price strong") ||
            card.querySelector(".book-price strong") ||
            card.querySelector(".wishlist-price");

        const metaEls = card.querySelectorAll(
            ".shop-product-meta span, .book-meta span, .wishlist-item-meta span"
        );

        const title = titleEl.textContent.trim();
        const price = Number(card.dataset.price || 0) || parsePrice(priceEl ? priceEl.textContent : "");

        return {
            id: card.dataset.bookId || createBookId(title),
            title: title,
            author: authorEl ? authorEl.textContent.trim() : "نویسنده نامشخص",
            image: absoluteImagePath(card.querySelector("img")),
            price: price,
            meta: Array.from(metaEls).map(function (m) { return m.textContent.trim(); }),
            quantity: 1
        };
    }

    /* ---------- cart operations ---------- */

    function addToCart(product) {
        if (!product) return;

        const cart = getCart();
        const existing = cart.find(function (item) { return item.id === product.id; });

        if (existing) {
            existing.quantity = Math.min(existing.quantity + 1, MAX_QTY);
        } else {
            cart.push(product);
        }

        saveCart(cart);
        renderCartPage();
    }

    function removeFromCart(productId) {
        saveCart(getCart().filter(function (item) { return item.id !== productId; }));
        renderCartPage();
    }

    function changeQuantity(productId, action) {
        const cart = getCart();
        const item = cart.find(function (book) { return book.id === productId; });
        if (!item) return;

        if (action === "increase") item.quantity = Math.min(item.quantity + 1, MAX_QTY);
        if (action === "decrease") item.quantity -= 1;

        saveCart(cart.filter(function (book) { return book.quantity > 0; }));
        renderCartPage();
    }

    function getCartTotals(cart) {
        const subtotal = cart.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);

        const discount = subtotal >= DISCOUNT_FROM ? Math.round(subtotal * DISCOUNT_RATE) : 0;
        const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;

        return {
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            total: subtotal + shipping - discount
        };
    }

    /* ---------- rendering ---------- */

    function updateCartBadge() {
        const count = getCart().reduce(function (sum, item) { return sum + item.quantity; }, 0);

        document.querySelectorAll("[data-cart-count]").forEach(function (badge) {
            badge.textContent = count.toLocaleString("fa-IR");
            badge.style.display = count > 0 ? "grid" : "none";
        });
    }

    function renderCartPage() {
        if (!cartItemsList) {
            updateCartBadge();
            return;
        }

        const cart = getCart();
        const totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
        const totals = getCartTotals(cart);
        const shopUrl = cartItemsList.dataset.shopUrl || "/Shop";

        if (cartItemsCount) cartItemsCount.textContent = totalItems.toLocaleString("fa-IR");
        if (cartSubtotal) cartSubtotal.textContent = formatPrice(totals.subtotal);
        if (cartShipping) cartShipping.textContent = totals.shipping === 0 ? "رایگان" : formatPrice(totals.shipping);
        if (cartDiscount) cartDiscount.textContent = totals.discount === 0 ? "۰ تومان" : formatPrice(totals.discount);
        if (cartTotal) cartTotal.textContent = formatPrice(totals.total);

        if (clearCartBtn) clearCartBtn.disabled = cart.length === 0;
        if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML =
                '<div class="cart-empty">' +
                '<i class="fa-solid fa-bag-shopping"></i>' +
                "<h2>سبد خریدت خالیه</h2>" +
                "<p>از فروشگاه کتاب‌های مورد علاقه‌ات را انتخاب کن.</p>" +
                '<a href="' + escapeHtml(shopUrl) + '">رفتن به فروشگاه</a>' +
                "</div>";
            updateCartBadge();
            return;
        }

        cartItemsList.innerHTML = cart.map(function (item) {
            const id = escapeHtml(item.id);
            const title = escapeHtml(item.title);
            const metaHtml = item.meta && item.meta.length
                ? item.meta.map(function (m) { return "<span>" + escapeHtml(m) + "</span>"; }).join("")
                : "<span>کتاب</span>";

            return (
                '<article class="cart-item" data-cart-id="' + id + '">' +
                '<div class="cart-item-img"><img src="' + escapeHtml(item.image) + '" alt="جلد کتاب ' + title + '"></div>' +
                '<div class="cart-item-info">' +
                "<h3>" + title + "</h3>" +
                "<p>" + escapeHtml(item.author) + "</p>" +
                '<div class="cart-item-meta">' + metaHtml + "</div>" +
                "</div>" +
                '<div class="cart-item-actions">' +
                '<div class="cart-item-price">' + formatPrice(item.price * item.quantity) + "</div>" +
                '<div class="cart-qty">' +
                '<button type="button" aria-label="کم کردن" data-cart-action="decrease" data-cart-id="' + id + '"><i class="fa-solid fa-minus"></i></button>' +
                "<span>" + item.quantity.toLocaleString("fa-IR") + "</span>" +
                '<button type="button" aria-label="زیاد کردن" data-cart-action="increase" data-cart-id="' + id + '"><i class="fa-solid fa-plus"></i></button>' +
                "</div>" +
                '<button class="cart-remove-btn" type="button" data-cart-remove="' + id + '">حذف از سبد</button>' +
                "</div>" +
                "</article>"
            );
        }).join("");

        updateCartBadge();
    }

    /* ---------- events (delegated, so dynamically rendered buttons work) ---------- */

    document.addEventListener("click", function (event) {
        const addBtn = event.target.closest(
            ".shop-add-btn, .small-buy-btn, .wishlist-buy-btn, [data-add-cart]"
        );

        if (addBtn) {
            event.preventDefault();
            addToCart(extractProductData(addBtn));

            if (!addBtn.dataset.originalHtml) addBtn.dataset.originalHtml = addBtn.innerHTML;
            addBtn.innerHTML = '<i class="fa-solid fa-check"></i> اضافه شد';
            clearTimeout(addBtn._cartTimer);
            addBtn._cartTimer = setTimeout(function () {
                addBtn.innerHTML = addBtn.dataset.originalHtml;
            }, 1200);
            return;
        }

        const qtyBtn = event.target.closest("[data-cart-action]");
        if (qtyBtn) {
            changeQuantity(qtyBtn.dataset.cartId, qtyBtn.dataset.cartAction);
            return;
        }

        const removeBtn = event.target.closest("[data-cart-remove]");
        if (removeBtn) {
            removeFromCart(removeBtn.dataset.cartRemove);
        }
    });

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            if (getCart().length === 0) return;
            if (confirm("همه کتاب‌ها از سبد خرید حذف شوند؟")) {
                saveCart([]);
                renderCartPage();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            if (getCart().length === 0) return;

            if (checkoutBtn.dataset.authenticated !== "true") {
                window.location.href = checkoutBtn.dataset.loginUrl || "/Account/Index";
                return;
            }

            // TODO: replace with the real checkout/order page once an Order model exists.
            alert("ثبت سفارش به‌زودی فعال می‌شود.");
        });
    }

    // keep the badge in sync if the cart changes in another tab
    window.addEventListener("storage", function (e) {
        if (e.key === CART_KEY) renderCartPage();
    });

    renderCartPage();
});
