/* =========================
   SHOP PAGE FILTER / SEARCH / SORT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    const shopGrid = document.querySelector("#shopProducts");
    const cards = Array.from(document.querySelectorAll(".shop-product-card"));
    const filterButtons = document.querySelectorAll(".shop-filter-btn");
    const searchInput = document.querySelector("#shopSearch");
    const sortSelect = document.querySelector("#shopSort");
    const resultCount = document.querySelector("#shopResultCount");
    const emptyBox = document.querySelector("#shopEmpty");

    if (!shopGrid || !cards.length) return;

    let activeFilter = "all";

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .trim();
    }

    function sortCards(visibleCards) {
        if (!sortSelect) return;

        const sortValue = sortSelect.value;

        visibleCards.sort(function (a, b) {
            const priceA = Number(a.dataset.price || 0);
            const priceB = Number(b.dataset.price || 0);
            const dateA = a.dataset.date || "";
            const dateB = b.dataset.date || "";

            if (sortValue === "low-high") {
                return priceA - priceB;
            }

            if (sortValue === "high-low") {
                return priceB - priceA;
            }

            if (sortValue === "newest") {
                return dateB.localeCompare(dateA);
            }

            return 0;
        });
    }

    function updateProducts() {
        const searchValue = searchInput ? normalizeText(searchInput.value) : "";

        let visibleCards = cards.filter(function (card) {
            const categories = card.dataset.category || "";
            const title = normalizeText(card.querySelector("h3")?.textContent || "");
            const author = normalizeText(card.querySelector(".shop-product-info p")?.textContent || "");

            const matchCategory =
                activeFilter === "all" || categories.split(" ").includes(activeFilter);

            const matchSearch =
                title.includes(searchValue) || author.includes(searchValue);

            return matchCategory && matchSearch;
        });

        sortCards(visibleCards);

        cards.forEach(function (card) {
            card.style.display = "none";
        });

        visibleCards.forEach(function (card) {
            card.style.display = "";
            shopGrid.appendChild(card);
        });

        if (resultCount) {
            resultCount.textContent = visibleCards.length.toLocaleString("fa-IR");
        }

        if (emptyBox) {
            emptyBox.classList.toggle("show", visibleCards.length === 0);
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            activeFilter = button.dataset.filter || "all";

            updateProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", updateProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", updateProducts);
    }

    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl) {
        const targetButton = document.querySelector(
            '.shop-filter-btn[data-filter="' + categoryFromUrl + '"]'
        );

        if (targetButton) {
            targetButton.click();
        } else {
            updateProducts();
        }
    } else {
        updateProducts();
    }
});