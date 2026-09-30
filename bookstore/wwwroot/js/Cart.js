/* =========================
   NAVAK CART
========================= */

document.addEventListener("DOMContentLoaded", function () {
    const CART_KEY = "navakCart";

    const cartItemsList = document.querySelector("#cartItemsList");
    const cartItemsCount = document.querySelector("#cartItemsCount");
    const cartSubtotal = document.querySelector("#cartSubtotal");
    const cartShipping = document.querySelector("#cartShipping");
    const cartDiscount = document.querySelector("#cartDiscount");
    const cartTotal = document.querySelector("#cartTotal");
    const clearCartBtn = document.querySelector("#clearCartBtn");

    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
    }

    function toEnglishDigits(value) {
        return String(value)
            .replace(/[۰-۹]/g, function (digit) {
                return "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
            })
            .replace(/[٠-٩]/g, function (digit) {
                return "٠١٢٣٤٥٦٧٨٩".indexOf(digit);
            });
    }

    function parsePrice(value) {
        if (!value) return 0;

        const english = toEnglishDigits(value);
        const onlyNumbers = english.replace(/[^\d]/g, "");

        return Number(onlyNumbers || 0);
    }

    function formatPrice(value) {
        return Number(value || 0).toLocaleString("fa-IR") + " تومان";
    }

    function createBookId(title) {
        return title
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
    }

    function extractProductData(button) {
        const card = button.closest(
            ".shop-product-card, .navak-product-card, .product-mini-card, .wishlist-item"
        );

        if (!card) return null;

        const titleEl = card.querySelector("h3");
        const authorEl =
            card.querySelector(".shop-product-info p") ||
            card.querySelector(".book-card-content p") ||
            card.querySelector(".wishlist-item-info p");

        const imgEl = card.querySelector("img");

        const priceEl =
            card.querySelector(".shop-product-price strong") ||
            card.querySelector(".book-price strong") ||
            card.querySelector(".wishlist-price");

        const metaEls =
            card.querySelectorAll(".shop-product-meta span, .book-meta span, .wishlist-item-meta span");

        if (!titleEl) return null;

        const title = titleEl.textContent.trim();
        const priceNumber = Number(card.dataset.price || 0) || parsePrice(priceEl?.textContent || "");

        return {
            id: card.dataset.bookId || createBookId(title),
            title: title,
            author: authorEl ? authorEl.textContent.trim() : "نویسنده نامشخص",
            image: imgEl ? imgEl.getAttribute("src") : "",
            price: priceNumber,
            meta: Array.from(metaEls).map(function (item) {
                return item.textContent.trim();
            }),
            quantity: 1
        };
    }

    function addToCart(product) {
        if (!product) return;

        const cart = getCart();
        const existingItem = cart.find(function (item) {
            return item.id === product.id;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }

        saveCart(cart);
        renderCartPage();
    }

    function removeFromCart(productId) {
        const cart = getCart().filter(function (item) {
            return item.id !== productId;
        });

        saveCart(cart);
        renderCartPage();
    }

    function changeQuantity(productId, action) {
        const cart = getCart();

        const item = cart.find(function (book) {
            return book.id === productId;
        });

        if (!item) return;

        if (action === "increase") {
            item.quantity += 1;
        }

        if (action === "decrease") {
            item.quantity -= 1;
        }

        const updatedCart = cart.filter(function (book) {
            return book.quantity > 0;
        });

        saveCart(updatedCart);
        renderCartPage();
    }

    function getCartTotals(cart) {
        const subtotal = cart.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);

        const discount = subtotal >= 500000 ? Math.round(subtotal * 0.08) : 0;
        const shipping = subtotal === 0 || subtotal >= 350000 ? 0 : 35000;
        const total = subtotal + shipping - discount;

        return {
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            total: total
        };
    }

    function updateCartBadge() {
        const cart = getCart();
        const count = cart.reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);

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
        const totalItems = cart.reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);

        const totals = getCartTotals(cart);

        if (cartItemsCount) {
            cartItemsCount.textContent = totalItems.toLocaleString("fa-IR");
        }

        if (cartSubtotal) cartSubtotal.textContent = formatPrice(totals.subtotal);
        if (cartShipping) cartShipping.textContent = totals.shipping === 0 ? "رایگان" : formatPrice(totals.shipping);
        if (cartDiscount) cartDiscount.textContent = totals.discount === 0 ? "۰ تومان" : formatPrice(totals.discount);
        if (cartTotal) cartTotal.textContent = formatPrice(totals.total);

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <h2>سبد خریدت خالیه</h2>
          <p>از فروشگاه کتاب‌های مورد علاقه‌ات را انتخاب کن.</p>
          <a href="shop.html">
            رفتن به فروشگاه
          </a>
        </div>
      `;

            updateCartBadge();
            return;
        }

        cartItemsList.innerHTML = cart.map(function (item) {
            const metaHtml = item.meta && item.meta.length
                ? item.meta.map(function (meta) {
                    return `<span>${meta}</span>`;
                }).join("")
                : "<span>کتاب</span>";

            return `
        <article class="cart-item" data-cart-id="${item.id}">
          <div class="cart-item-img">
            <img src="${item.image}" alt="جلد کتاب ${item.title}">
          </div>

          <div class="cart-item-info">
            <h3>${item.title}</h3>
            <p>${item.author}</p>

            <div class="cart-item-meta">
              ${metaHtml}
            </div>
          </div>

          <div class="cart-item-actions">
            <div class="cart-item-price">
              ${formatPrice(item.price * item.quantity)}
            </div>

            <div class="cart-qty">
              <button type="button" data-cart-action="decrease" data-cart-id="${item.id}">
                <i class="fa-solid fa-minus"></i>
              </button>

              <span>${item.quantity.toLocaleString("fa-IR")}</span>

              <button type="button" data-cart-action="increase" data-cart-id="${item.id}">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>

            <button class="cart-remove-btn" type="button" data-cart-remove="${item.id}">
              حذف از سبد
            </button>
          </div>
        </article>
      `;
        }).join("");

        document.querySelectorAll("[data-cart-action]").forEach(function (button) {
            button.addEventListener("click", function () {
                changeQuantity(button.dataset.cartId, button.dataset.cartAction);
            });
        });

        document.querySelectorAll("[data-cart-remove]").forEach(function (button) {
            button.addEventListener("click", function () {
                removeFromCart(button.dataset.cartRemove);
            });
        });

        updateCartBadge();
    }

    document.querySelectorAll(".shop-add-btn, .small-buy-btn, .wishlist-buy-btn, [data-add-cart]").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const product = extractProductData(button);
            addToCart(product);

            const originalHTML = button.innerHTML;

            button.innerHTML = `<i class="fa-solid fa-check"></i> اضافه شد`;

            setTimeout(function () {
                button.innerHTML = originalHTML;
            }, 1200);
        });
    });

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            saveCart([]);
            renderCartPage();
        });
    }

    renderCartPage();
    updateCartBadge();
});