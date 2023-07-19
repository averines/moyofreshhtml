"use strict";

const body = document.querySelector("body");
const catalogNav = document.querySelector(".catalog-nav");
const catalogBtn = document.querySelector(".catalog-btn");

let productHoverTimer;
let swapImagesTimer;
let isFilterOpen = false;

const delegate = (selector) => (cb) => (e) => e.target.matches(selector) && cb(e);
const inputDelegate = delegate('input[type=text]');

// отслеживаем изменение инпутов в поиске по фильтрам
body.addEventListener('focusin', inputDelegate((el) => {

    // изменения чекбоксов
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


            if (e.target.dataset.range == "min") {
                if (e.target.value < rangeMin || e.target.value > rangeMax) {
                    e.target.value = rangeMin;
                }

                if (e.target.value != rangeMin) {
                    setTimeout(() => { e.target.closest(".catalog-filter").dataset.activeFilterCount = ""; }, 150);
                    // e.target.closest(".catalog-filter").dataset.activeFilterCount = "";
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
                    // setTimeout(() => { e.target.closest(".catalog-filter").dataset.activeFilterCount = ""; }, 150);
                    e.target.closest(".catalog-filter").dataset.activeFilterCount = "";
                }
            }

        })
    }
}));


function swapImages(productPic, colorPics, actualIndex) {
    clearTimeout(swapImagesTimer);
    swapImagesTimer = setInterval(() => {
        updateSrcset(productPic, colorPics[actualIndex]);
        actualIndex = (actualIndex + 1) % colorPics.length;
    }, 1000);
}

function updateSrcset(productPic, colorId) {
    productPic.srcset = productPic.srcset.replace(/\/([^\/]+)\.webp/g, (match, fileName) => match.replace(fileName, colorId));
}

function updatePrices(product, priceActual, priceOld) {
    if (priceActual) {
        product.querySelector(".card-price__actual span").innerText = priceActual;
    }

    if (priceOld) {
        product.querySelector(".card-price__old span").innerText = priceOld;
    }
}

function updateLinks(product, productId) {
    // TODO: сделать замену через регулярку для url вида https://optmoyo.ru/product/123456
    product.querySelector(".product-card__body-link").href = productId;
    product.querySelector(".product-card__head-link").href = productId;
}

function setActiveColor(cardColors, actualColor, product, cardSizes) {
    // сделать наведенный цвет активным
    cardColors.forEach(i => i.classList.toggle("card-color--active", i === actualColor));
    product.dataset.activeColorId = actualColor.dataset.colorId;

    // показать размеры, связанные с цветом в мини-карточке товара
    cardSizes.forEach(i => { i.classList.toggle("card-size--showed", actualColor.dataset.colorId === i.dataset.colorId) });
}

function setSwiper(product) {
    let productHeadLink = product.querySelector(".product-card__head-link");
    let colorPics = product.querySelector(`[data-color-id="${product.dataset.activeColorId}"]`).dataset.images;
    if (colorPics) {
        colorPics = colorPics.replace(" ", "").split(",");

        if (colorPics.length > 1) {
            let productPic = product.querySelector(".product-card__pic");
            let newSwiper = document.createElement("div");
            newSwiper.classList.add("product-card__swiper");
            const swiperFragment = document.createDocumentFragment();

            for (let i = 0; i < colorPics.length; i++) {
                let swiperImage = document.createElement("div");
                swiperImage.addEventListener('mouseover', () => {
                    updateSrcset(productPic, colorPics[i]);
                });
                swiperFragment.appendChild(swiperImage);
            }
            newSwiper.appendChild(swiperFragment);
            productHeadLink.append(newSwiper);

        }
    }
}

function removeSwiper(product) {
    let swiper = product.querySelector(".product-card__swiper");
    if (swiper) { swiper.remove() }
}

function setProductDefaultState(product) {
    let cardColors = product.querySelectorAll(".card-color");
    let productPic = product.querySelector(".product-card__pic");
    let cardSizes = product.querySelectorAll(".card-size");

    clearTimeout(swapImagesTimer);
    updateSrcset(productPic, cardColors[0].dataset.colorId);
    updatePrices(product, cardColors[0].dataset.priceActual, cardColors[0].dataset.priceOld);
    updateLinks(product, cardColors[0].dataset.colorId);
    setActiveColor(cardColors, cardColors[0], product, cardSizes);
    removeSwiper(product);
}

function checkIsMobile() {
    let isMobile = window.matchMedia || window.msMatchMedia;
    if (isMobile) {
        let match_mobile = isMobile("(pointer:coarse)");
        return match_mobile.matches;
    }
    return false;
}

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
            tabs = document.querySelectorAll(`[data-tab-id*="${targetGroup}"]`);
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
        if (e.target.classList.contains("filter-controls__close")) {
            // console.log("скрываю родительский активный");
            e.target.closest(".catalog-filter").classList.remove("is-active");
        }
    }

    // отслеживаем изменение чекбокса в фильтрах
    if (e.target.classList.contains("filter-checkbox")) {
        let activeSiblingCheckboxes = e.target.closest(".filter").querySelectorAll("input.filter-checkbox:checked");
        if (activeSiblingCheckboxes.length) {
            e.target.closest(".catalog-filter").dataset.activeFilterCount = activeSiblingCheckboxes.length;
        } else {
            delete e.target.closest(".catalog-filter").dataset.activeFilterCount;
        }
    }

    if (e.target.classList.contains("filter-controls__clear")) {
        // сбрасываем чекбоксы при нажатии на кнопку Сбросить
        let activeSiblingCheckboxes = e.target.closest(".filter").querySelectorAll("input.filter-checkbox:checked");
        if (activeSiblingCheckboxes.length) {
            activeSiblingCheckboxes.forEach(i => { i.checked = false });
            delete e.target.closest(".catalog-filter").dataset.activeFilterCount;
        }

        // сбрасываем цены при нажатии кнопки Сбросить
        let filterRange = e.target.closest(".filter").querySelector(".filter-range");
        if (filterRange) {
            filterRange.querySelector('.filter-range__input[data-range="min"]').value = filterRange.dataset.rangeMin;
            filterRange.querySelector('.filter-range__input[data-range="max"]').value = filterRange.dataset.rangeMax;
            delete e.target.closest(".catalog-filter").dataset.activeFilterCount;
        }
    }

    // обработка кликов с data-action
    if (e.target.dataset.hasOwnProperty('action')) {

        // плавный переход к блоку
        if (e.target.dataset.action == "scroll") {
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
        if (e.target.dataset.action == "showmore-product-specs") {
            const productSpecs = document.querySelector(".product-specs");
            productSpecs.classList.add("is-active");
            e.target.classList.add("is-hidden");
        }

        // показать целиком описание товара
        if (e.target.dataset.action == "showmore-product-description") {
            const productDescription = document.querySelector(".product__description");
            productDescription.classList.add("is-active");
            e.target.classList.add("is-hidden");
        }
    }


})

window.addEventListener('mouseover', (e) => {
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

    //фиксируем высоту родительской обертки товара, чтобы не было сдвига, когда контент карточки становится позиционирован абсолютно (не адаптивно)
    // if (e.target.closest(".product-card")) {
    //     e.target.closest(".product-card").style.height = `${e.target.closest(".product-card").getBoundingClientRect().height}px`;
    // }
})


// подсчёт пунктов в выпадающем меню каталога и кнопка показать/скрыть для длинных меню
const catalogTabMenus = document.querySelectorAll(".catalog-tab__menu");
if (catalogTabMenus) {
    catalogTabMenus.forEach(catalogTabMenu => {
        let items = catalogTabMenu.querySelectorAll("a");
        if (items.length > 6) {
            let button = document.createElement("button");
            button.classList.add("catalog-tab__more");
            button.innerText = `${items.length - 6}`;
            button.addEventListener("click", () => { catalogTabMenu.classList.toggle("catalog-tab__menu--show-all") })
            catalogTabMenu.append(button);
        }
    })
}

// показать табы выпадающего меню каталога при наведении
const catalogTabTitles = document.querySelectorAll(".catalog-nav__titles li");
const catalogTabs = document.querySelectorAll(".catalog-tab");
if (catalogTabTitles && catalogTabs) {
    catalogTabTitles.forEach(title => {
        title.addEventListener("mouseenter", (e) => {
            catalogTabTitles.forEach(t => t.classList.remove("is-active"));
            title.classList.add("is-active");
            catalogTabs.forEach(tab => { tab.classList.toggle("is-active", tab.dataset.tabId === e.target.dataset.tabTarget) })
        })
    })
}

// всплывающие окна через фансибокс
Fancybox.bind("[data-fancybox]", {});

// слайдер через фансибокс
const sliderMain = document.getElementById("sliderMain");
if (sliderMain) { new Carousel(sliderMain, { infinite: false }) }

// слайдер Просмотренных товаров фансибокс
// const sliderViewedProducts = document.getElementById("viewedProducts");
// if (sliderViewedProducts) { new Carousel(sliderViewedProducts, { infinite: false, fill: false, slidesPerPage: 7, transition: "slide" }) }


// окончания для единиц измерения на русском языке
function getRussainDeclension(variants, number) {
    // ["час", "часа", "часов"] = ..1 час, ..2/3/4 часа, остальные часов
    let variant;
    if (number === 1 || (number > 20 && number % 10 === 1)) { variant = variants[0] }
    else if ((number >= 2 && number <= 4) || (number > 20 && number % 10 >= 2 && number % 10 <= 4)) { variant = variants[1] }
    else { variant = variants[2] }
    return variant;
}

// расчет времени до закрытия/открытия магазина
function getWorktimeStatus(element) {
    // у element должны быть атрибуты data-worktime-open и data-worktime-close со значениями в формате "23:30"
    // и data-worktime-close с перечеслением номеров дней недели

    // получаем текущую дату и время в часовом поясе Москвы
    const moscowTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
    const currentTime = new Date(moscowTime);
    const currentDayOfWeek = currentTime.getDay()

    // получаем сортированный список рабочих дней недели
    let workDays = element.dataset.worktimeDays.replace(" ", "").split(",").map(i => parseInt(i)).sort();

    // определяем номер следующего рабочего дня
    let nextWorkDayOfWeek = workDays.find(day => day > currentDayOfWeek) || workDays[0];

    const openTime = new Date();
    const [worktimeOpenHours, worktimeOpenMinutes] = element.dataset.worktimeOpen.replace(" ", "").split(":").map(i => parseInt(i));
    openTime.setHours(worktimeOpenHours);
    openTime.setMinutes(worktimeOpenMinutes);

    const closeTime = new Date();
    let [worktimeCloseHours, worktimeCloseMinutes] = element.dataset.worktimeClose.replace(" ", "").split(":").map(i => parseInt(i));
    closeTime.setHours(worktimeCloseHours);
    closeTime.setMinutes(worktimeCloseMinutes);

    let statusHours, statusMinutes, timeDiff, statusMessage;

    // проверяем, открыт ли магазин сейчас
    if (workDays.includes(currentDayOfWeek) && currentTime >= openTime && currentTime <= closeTime) {
        timeDiff = Math.abs(closeTime - currentTime); // время до закрытия магазина
        statusMessage = "Сейчас открыто, закроется через";
    } else {
        const delta = nextWorkDayOfWeek > currentDayOfWeek ? nextWorkDayOfWeek - currentDayOfWeek : 7 - currentDayOfWeek + workDays[0];
        const nextWorkDay = new Date();
        nextWorkDay.setDate(currentTime.getDate() + delta);
        nextWorkDay.setHours(openTime.getHours());
        nextWorkDay.setMinutes(openTime.getMinutes());

        timeDiff = Math.abs(nextWorkDay - currentTime); // время до открытия магазина
        statusMessage = "Сейчас закрыто, откроется через";
        element.classList.add("is-close");
    }

    statusHours = Math.floor(timeDiff / 3600000);
    statusMinutes = Math.floor((timeDiff % 3600000) / 60000);
    element.innerHTML = `${statusMessage} ${statusHours > 0 ? statusHours + "&nbsp;" + getRussainDeclension(["час", "часа", "часов"], statusHours) : ""}&nbsp;${statusMinutes}&nbsp;${getRussainDeclension(["минуту", "минуты", "минут"], statusMinutes)}`
}

const worktimeEl = document.getElementById("js-worktime");
if (worktimeEl) { getWorktimeStatus(worktimeEl) }


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

const swiper = new Swiper('.swiper', {
    loop: false,
    spaceBetween: 20,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
    slidesPerView: 2,

    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 10
        },
        400: {
            slidesPerView: 2.5,
            spaceBetween: 10
        },
        575: {
            slidesPerView: 3.5,
            spaceBetween: 10
        },
        750: {
            slidesPerView: 4.5,
            spaceBetween: 10
        },
        1000: {
            slidesPerView: 5,
            spaceBetween: 20
        },
        1100: {
            slidesPerView: 6,
            spaceBetween: 20
        },
        1300: {
            slidesPerView: 7,
        },
        1600: {
            slidesPerView: 7,
            spaceBetween: 30
        }
    }
});