"use strict";

const body = document.querySelector("body");
const catalogNav = document.querySelector(".catalog-nav");
const catalogBtn = document.querySelector(".catalog-btn");

let productHoverTimer;
let swapImagesTimer;
let isFilterOpen = false;

const delegate = (selector) => (cb) => (e) => e.target.matches(selector) && cb(e);
const inputDelegate = delegate('input[type=text]');

function checkIsMobile() {
    let isMobile = window.matchMedia || window.msMatchMedia;
    if (isMobile) {
        let match_mobile = isMobile("(pointer:coarse)");
        return match_mobile.matches;
    }
    return false;
}


// отслеживаем изменение инпутов в фильтрах товаров
body.addEventListener('focusin', inputDelegate((el) => {

    // поиск по фильтру
    if (el.target.classList.contains("filter-search__input")) {
        el.target.addEventListener("input", (e) => {
            let filter = e.target.closest(".filter");
            let clearBtn = filter.querySelector(".filter-search__clear");
            let filterRowValues = filter.querySelectorAll(".filter-value");
            let filterContent = filter.querySelector(".filter-content");

            clearBtn.addEventListener("click", () => {
                e.target.value = "";
                clearBtn.classList.remove("is-active");
                filterRowValues.forEach(i => i.closest(".filter-content__row").classList.remove("is-hidden"));
                filterContent.classList.remove("is-noresults");
            })

            if (e.target.value.length) {
                let hiddenCount = 0;
                clearBtn.classList.add("is-active");

                filterRowValues.forEach(i => {
                    if (!i.innerText.toLowerCase().includes(e.target.value.toLowerCase())) {
                        i.closest(".filter-content__row").classList.add("is-hidden");
                        hiddenCount += 1;
                    } else {
                        i.closest(".filter-content__row").classList.remove("is-hidden");
                    }
                });
                filterContent.classList.toggle("is-noresults", hiddenCount == filterRowValues.length)
            } else {
                clearBtn.classList.remove("is-active");
                filterRowValues.forEach(i => i.closest(".filter-content__row").classList.remove("is-hidden"));
                filterContent.classList.remove("is-noresults");
            }
        })
    }

    // изменения диапазона
    if (el.target.classList.contains("filter-range__input")) {
        el.target.addEventListener("blur", (e) => {
            let rangeMin = parseInt(e.target.closest(".filter-range").dataset.rangeMin);
            let rangeMax = parseInt(e.target.closest(".filter-range").dataset.rangeMax);
            e.target.value = parseInt(e.target.value.replace(/\D/gi, '')) || 0;

            let filterGroup = e.target.closest(".catalog-filter")

            if (e.target.dataset.range == "min") {
                if (e.target.value < rangeMin || e.target.value > rangeMax) {
                    e.target.value = rangeMin;
                }

                if (e.target.value != rangeMin) {
                    setTimeout(() => { filterGroup.dataset.activeFilterCount = ""; }, 150);
                    // e.target.closest(".catalog-filter").dataset.activeFilterCount = "";
                    setFilterRange(filterGroup.dataset.filterGroup, e.target.value, rangeMax)
                }
            }

            if (e.target.dataset.range == "max") {
                if (e.target.value < rangeMin + 1) {
                    e.target.value = rangeMin + 1;
                }

                if (e.target.value > rangeMax) {
                    e.target.value = rangeMax;
                }

                if (e.target.value != rangeMax) {
                    // setTimeout(() => { filterGroup.dataset.activeFilterCount = ""; }, 150);
                    e.target.closest(".catalog-filter").dataset.activeFilterCount = "";
                    setFilterRange(filterGroup.dataset.filterGroup, rangeMin, e.target.value)
                }
            }

        })
    }
}));



window.addEventListener('click', (e) => {
    // показать/спрятать пункт аккордеона
    if (e.target.classList.contains("accordion__title")) { e.target.closest(".accordion__item").classList.toggle("is-opened") }

    // добавить/убрать в избранное в карточке товара
    if (e.target.classList.contains("product-card__fav")) {
        if (e.target.classList.contains("is-active")) {
            e.target.classList.remove("is-active");
        } else {
            e.target.classList.add("is-active");
            e.target.innerHTML = "<span></span>";
        }
    }

    // спрятать ранее открытое меню каталога при клике вне его контейнера
    if (catalogNav.classList.contains("is-active")) {
        if (!e.target.closest(".catalog-nav__inner")) {
            body.classList.remove("is-dropdown-open");
            catalogNav.classList.remove("is-active");
            catalogBtn.classList.remove("is-active");
        }
    } else {
        // показать выпадающее меню каталога
        if (e.target.classList.contains("catalog-btn")) {
            e.target.classList.add("is-active");
            body.classList.add("is-dropdown-open");
            catalogNav.classList.add("is-active");
        }
    }

    // показать вкладку, используя атрибут "data-tab-target", скрыть прочие вкладки из этой группы
    if (e.target.dataset.hasOwnProperty('tabTarget')) {
        let target = e.target.dataset.tabTarget;
        let targetGroup = target.split("-")[0];
        if (targetGroup) {
            let tabs = document.querySelectorAll(`[data-tab-id*="${targetGroup}"]`);
            if (tabs) { tabs.forEach(t => { t.classList.toggle("is-active", t.dataset.tabId == target) }) }
        }
    }

    // выпадающее меню сортировки
    if (e.target.classList.contains("sort-list__link")) {
        let sortList = e.target.closest(".sort-list");

        if (e.target.classList.contains("is-active")) {
            e.preventDefault();
            sortList.classList.toggle("is-active");
        } else {
            sortList.classList.remove("is-active");
            sortList.querySelectorAll('.sort-list__link').forEach(i => i.classList.remove("is-active"));
            e.target.classList.add("is-active");
        }
    }

    // показать все цвета в мини-карточке товара
    if (e.target.classList.contains("card-color__more")) {
        e.target.closest(".card-colors").classList.add("card-colors--show-all")
        e.target.classList.add("is-hidden");
    }

    // показать все фильтры на странице каталога
    if (e.target.classList.contains("catalog-filter__more")) {
        e.target.closest(".catalog-filters").classList.add("catalog-filters--show-all")
        e.target.classList.add("is-hidden");
    }

    // для мобилок блокируем клик по названию товара в мини-карточке товара
    if (e.target.classList.contains("card-color")) {
        if (checkIsMobile()) { e.preventDefault() }
    }

    //  добавить/удалить в козину по клику на рамер в мини-карточке товара
    if (e.target.classList.contains("card-size")) {
        e.target.classList.toggle("card-size--active");

        // получаем активные (добавленные в корзину) размеры этого цвета
        let activeSiblingSizes = e.target.closest(".card-sizes").querySelectorAll(`.card-size--active[data-color-id="${e.target.dataset.colorId}"]`);

        // помечаем/убираем цвет добавленным в корзину
        let activeColor = e.target.closest(".product-card").querySelector(`.card-color[data-color-id="${e.target.dataset.colorId}"]`);
        activeColor.classList.toggle("card-color--incart", activeSiblingSizes.length > 0)
    }

    // показать/скрыть меню фильтра
    if (!e.target.closest(".catalog-filter__content")) {
        if (e.target.classList.contains("catalog-filter__title")) {
            if (e.target.closest(".catalog-filter").classList.contains("is-active")) {
                // console.log("скрываю родительский активный");
                e.target.closest(".catalog-filter").classList.remove("is-active");
            } else {
                // console.log("скрываю все активные");
                let activeFilter = body.querySelector(".catalog-filter.is-active");
                if (activeFilter) { activeFilter.classList.remove("is-active") }

                // console.log("показываю родительский");
                e.target.closest(".catalog-filter").classList.add("is-active");
            }
        } else {
            // console.log("скрываю все активные");
            let activeFilter = body.querySelector(".catalog-filter.is-active");
            if (activeFilter) { activeFilter.classList.remove("is-active") }
        }
    } else {
        if (e.target.dataset.action == "close-filter") {
            // console.log("скрываю родительский активный");
            e.target.closest(".catalog-filter").classList.remove("is-active");
        }
    }

    // отслеживаем изменение чекбокса в фильтрах
    if (e.target.classList.contains("filter-checkbox")) {
        let filterText = e.target.closest(".filter-content__row").querySelector(".filter-value").innerText;
        toggleFilter(e.target.id, e.target.checked, filterText)
        updateActiveFilterCount(e.target.closest(".catalog-filter"));
        updateVisibilityActiveFiltersWrap()
    }

    // обработка кликов с data-action ===========================
    if (e.target.dataset.hasOwnProperty('action')) {

        // плавный переход к блоку
        if (e.target.dataset.action.includes("scroll")) {
            e.preventDefault();
            let scrollToEl;
            if (e.target.getAttribute('href')) {
                scrollToEl = e.target.getAttribute('href');
                scrollToEl = scrollToEl.replace("#", "");
            } else {
                scrollToEl = e.target.dataset.scrollTarget;
            }
            document.getElementById(scrollToEl).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // показать все характеристики товара
        if (e.target.dataset.action.includes("showmore-product-specs")) {
            const productSpecs = document.querySelector(".product-specs");
            productSpecs.classList.add("is-active");
            e.target.classList.add("is-hidden");
        }

        // показать целиком описание товара
        if (e.target.dataset.action.includes("showmore-product-description")) {
            const productDescription = document.querySelector(".product__description");
            productDescription.classList.add("is-active");
            e.target.classList.add("is-hidden");
        }

        // переключение статуса покупателя на странице Регистрация
        if (e.target.dataset.action.includes("set-customer-status")) {
            let cardRegister = document.querySelectorAll(".register-card");
            cardRegister.forEach(i => { i.classList.remove("register-card--active") });
            e.target.closest(".register-card").classList.add("register-card--active");
            document.querySelector("[data-customer-status-title-target]").innerText = e.target.dataset.customerStatusTitle;
            document.querySelector("[data-customer-status-minsumm-target]").innerText = e.target.dataset.customerStatusMinsumm;

            let formRegisterInn = document.querySelector("[data-customer-inn]");
            if (e.target.dataset.customerStatusId == "3") {
                formRegisterInn.classList.remove("d-none");
            } else {
                formRegisterInn.classList.add("d-none");
            }
        }

        // сбросить все фильтры в каталоге товаров
        if (e.target.dataset.action == "clear-filters") {
            let filterGroups = document.querySelectorAll(".catalog-filter");
            filterGroups.forEach(filterGroup => {
                filterGroup.querySelectorAll("input.filter-checkbox").forEach(i => i.checked = false);
                updateActiveFilterCount(filterGroup);
                updateVisibilityActiveFiltersWrap();
            });
        }

        // удалить одну группу фильтров в каталоге товаров
        if (e.target.dataset.action == "clear-filter-group") {
            clearFilterGroup(e.target.dataset.filterGroup)
        }

        // удалить один фильтр в каталоге товаров
        if (e.target.dataset.action == "clear-filter") {
            toggleFilter(e.target.dataset.filterId)
        }

        // переключить видимость пароля
        if (e.target.dataset.action == "toggle-password") {
            e.target.classList.toggle("is-active");
            e.target.closest(".form-field").querySelector("input.form-field__password").type = e.target.classList.contains("is-active") ? "text" : "password";
        }

    }
})

window.addEventListener('mouseover', (e) => {
    // свайп фоток товара при наведении на иконку цвета
    if (e.target.classList.contains("card-color")) {
        let actualColor = e.target;
        let product = actualColor.closest(".product-card");
        let cardColors = product.querySelectorAll(".card-color");
        let cardSizes = product.querySelectorAll(".card-size");
        let productPic = product.querySelector(".product-card__pic");
        let colorPics = actualColor.dataset.images ? actualColor.dataset.images.split(",") : [];

        clearTimeout(swapImagesTimer);
        removeSwiper(product);
        setActiveColor(cardColors, actualColor, product, cardSizes);
        updateSrcset(productPic, actualColor.dataset.colorId);
        updatePrices(product, actualColor.dataset.priceActual, actualColor.dataset.priceOld);
        updateLinks(product, actualColor.dataset.colorId);
        if (colorPics.length > 1) { swapImages(productPic, colorPics, 1) }

        // прекращаем автосвайпать при отведении с иконки цвета
        actualColor.addEventListener("mouseleave", () => { clearTimeout(swapImagesTimer) })

        // всё по умочанию при отведении с карточки товара после наведения на цвет
        product.addEventListener("mouseleave", () => { setProductDefaultState(product) })
    }

    // при наведении на ссылку с фоткой создаем ручной свайпер
    if (e.target.classList.contains("product-card__head-link")) {
        productHoverTimer = setTimeout(() => {
            setSwiper(e.target.closest(".product-card"));
            let product = e.target.closest(".product-card");

            // всё по умочанию при отведении с карточки товара после наведения на фотку
            product.addEventListener("mouseleave", () => {
                clearTimeout(productHoverTimer);
                setProductDefaultState(product);
            })
        }, 250)
    }

    // убираем отметку непрочитанной новости
    if (e.target.classList.contains("notice-card--active")) {
        e.target.classList.remove("notice-card--active");
    }

    //фиксируем высоту родительской обертки товара, чтобы не было сдвига, когда контент карточки становится позиционирован абсолютно (не адаптивно)
    // if (e.target.closest(".product-card")) {
    //     e.target.closest(".product-card").style.height = `${e.target.closest(".product-card").getBoundingClientRect().height}px`;
    // }
})


// добавляем плейсхолдеры в блоке Просмотренные товары на странице Товара
const productPlaceholdersEl = document.querySelector(".product-cards--placeholder");
if (productPlaceholdersEl) {
    let productCards = productPlaceholdersEl.querySelectorAll(".product-card");
    if (productCards.length) {
        const placeholders = document.createDocumentFragment();
        for (let i = 0; i < 7 - productCards.length; i++) {
            let placeholder = document.createElement("div");
            placeholder.classList.add("product-card-placeholder");
            placeholders.appendChild(placeholder);
        }

        productPlaceholdersEl.appendChild(placeholders);
    }
}


// всплывающие окна через фансибокс
Fancybox.bind("[data-fancybox]", {
    l10n: {
        CLOSE: "Закрыть",
        NEXT: "Вперед",
        PREV: "Назад",
        MODAL: "Можно закрыть, нажав ESC",
        ERROR: "Ошибка",
        IMAGE_ERROR: "Изображение не найдено",
        ELEMENT_NOT_FOUND: "HTML не найден",
        AJAX_NOT_FOUND: "Ошибка при загрузке AJAX: Контент не найден",
        AJAX_FORBIDDEN: "Ошибка при загрузке AJAX: Запрещено",
        IFRAME_ERROR: "Ошибка при загрузке",
    },
});