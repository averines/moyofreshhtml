const body = document.querySelector("body");
const catalogNav = document.querySelector(".catalog-nav");
const catalogBtn = document.querySelector(".catalog-btn");

let swapImagesTimer;
function swapImages(productPic, colorPics, actualIndex) {
    clearTimeout(swapImagesTimer);
    swapImagesTimer = setInterval(() => {
        updateSrcset(productPic, colorPics[actualIndex]);
        actualIndex = (actualIndex + 1) % colorPics.length;
    }, 1000);
}

let productHoverTimer;

function updateSrcset(productPic, colorId) {
    productPic.srcset = productPic.srcset.replace(/\/([^\/]+)\.webp/g, (match, fileName) => match.replace(fileName, colorId));
};

function updatePrices(product, priceActual, priceOld) {
    if (priceActual) {
        product.querySelector(".card-price__actual span").innerText = priceActual;
    }

    if (priceOld) {
        product.querySelector(".card-price__old span").innerText = priceOld;
    }
};

function updateLinks(product, productId) {
    // TODO: сделать замену через регулярку для url вида https://optmoyo.ru/product/123456
    product.querySelector(".product-card__body-link").href = productId;
    product.querySelector(".product-card__head-link").href = productId;
};

function setActiveColor(cardColors, actualColor, product, cardSizes) {
    // сделать наведенный цвет активным
    cardColors.forEach(i => i.classList.toggle("card-color--active", i === actualColor));
    product.dataset.activeColorId = actualColor.dataset.colorId;

    // показать размеры, связанные с цветом в мини-карточке товара
    cardSizes.forEach(i => { i.classList.toggle("card-size--showed", actualColor.dataset.colorId === i.dataset.colorId) });
};

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
};

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

window.addEventListener('click', (e) => {
    // показать/спрятать пункт аккордеона
    if (e.target.classList.contains("accordion__title")) {
        e.target.closest(".accordion__item").classList.toggle("is-opened");
    }

    // добавить/убрать в избранное в карточке товара
    if (e.target.classList.contains("product-card__fav")) {
        if (!e.target.classList.contains("is-active")) {
            e.target.classList.toggle("is-active");
            e.target.innerHTML = "<span></span>";
        } else {
            e.target.classList.remove("is-active");
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
            if (tabs) {
                tabs.forEach(t => {
                    t.classList.remove("is-active")
                    if (t.dataset.tabId == target) {
                        t.classList.add("is-active");
                    }
                });
            }
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
            document.querySelectorAll('.sort-list__link').forEach(i => i.classList.remove("is-active"));
            e.target.classList.add("is-active");
        }
    }

    // имитация добавления/удаления в козину по клику на рамер в мини-карточке товара
    if (e.target.classList.contains("card-size")) {
        e.target.classList.toggle("card-size--active");
    }

    // показать все цвета в мини-карточке товара
    if (e.target.classList.contains("card-color__more")) {
        // через каждый каждый цвет
        // let cardColors = e.target.closest(".card-colors").querySelectorAll(".card-color--hidden");
        // cardColors.forEach(i => i.classList.remove("card-color--hidden"));

        // через родителя
        e.target.closest(".card-colors").classList.add("card-colors--show-all")
        e.target.classList.add("is-hidden");
    }

    // TODO: для мобилок блокируем клик по названию товара в мини-карточке товара
    if (e.target.classList.contains("card-color")) {
        e.preventDefault();
    }

    if (e.target.classList.contains("catalog-filter__title")) {
        e.target.classList.toggle("is-active");
        body.classList.add("is-filter-open");
    }

    // спрятать ранее открытое меню фильтра при клике вне его контейнера
    // if (!e.target.closest(".catalog-filter__content")) {
    //     body.classList.remove("is-filter-open");
    //     e.target.closest(".catalog-filter").querySelector(".catalog-filter__title").classList.remove("is-active");
    // }



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
        product.addEventListener("mouseleave", () => {
            setProductDefaultState(product);
        })
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
    if (e.target.closest(".product-card")) {
        e.target.closest(".product-card").style.height = `${e.target.closest(".product-card").getBoundingClientRect().height}px`;
    }
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
            catalogTabs.forEach(tab => { tab.classList.toggle("is-active", tab.dataset.tabId === e.target.dataset.tabTarget); })
        })
    })
}

// всплывающие окна через фансибокс
Fancybox.bind("[data-fancybox]", {});

// слайдер через фансибокс
const sliderMain = document.getElementById("sliderMain");
if (sliderMain) { new Carousel(sliderMain, { infinite: false }) }


function getRussainDeclension(variants, number) {
    // ["час", "часа", "часов"] = ..1 час, ..2/3/4 часа, остальные часов
    let variant;
    if (number === 1 || (number > 20 && number % 10 === 1)) {
        variant = variants[0];
    } else if ((number >= 2 && number <= 4) || (number > 20 && number % 10 >= 2 && number % 10 <= 4)) {
        variant = variants[1];
    } else {
        variant = variants[2];
    }
    return variant;
}

// расчет времени до закрытия/открытия магазина на странице Контакты
function getWorktimeStatus(element) {
    // Получаем текущую дату и время в часовом поясе Москвы
    const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
    const currentTime = new Date(now);

    const openTime = new Date();
    openTime.setHours(parseInt(element.dataset.timeOpen.split(":")[0]));
    openTime.setMinutes(parseInt(element.dataset.timeOpen.split(":")[1]));

    const closeTime = new Date();
    closeTime.setHours(parseInt(element.dataset.timeClose.split(":")[0]));
    closeTime.setMinutes(parseInt(element.dataset.timeClose.split(":")[1]));

    let hours, minutes, timeDiff, message;

    // Проверяем, открыт ли магазин
    if (currentTime >= openTime && currentTime <= closeTime) {
        timeDiff = Math.abs(closeTime - currentTime); // время до закрытия магазина
        message = "Сейчас открыто, закроется через";
    } else {
        const nextDay = new Date();
        nextDay.setDate(currentTime.getDate() + 1);
        nextDay.setHours(openTime.getHours());
        nextDay.setMinutes(openTime.getMinutes());
        timeDiff = Math.abs(nextDay - currentTime); // время до открытия магазина
        message = "Сейчас закрыто, откроется через";
        element.classList.add("is-close");
    }

    hours = Math.floor(timeDiff / 3600000);
    minutes = Math.floor((timeDiff % 3600000) / 60000);
    element.innerHTML = `${message} ${hours > 0 ? hours + "&nbsp;" + getRussainDeclension(["час", "часа", "часов"], hours) : ""}&nbsp;${minutes}&nbsp;${getRussainDeclension(["минуту", "минуты", "минут"], minutes)}`
}

const worktimeEl = document.getElementById("js-worktime");
if (worktimeEl) { getWorktimeStatus(worktimeEl) }
