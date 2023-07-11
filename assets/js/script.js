const body = document.querySelector("body");
const catalogNav = document.querySelector(".catalog-nav");
const catalogBtn = document.querySelector(".catalog-btn");

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

    // для мобилок блокируем клик по названию товара в мини-карточке товара
    if (e.target.classList.contains("card-color")) {
        e.preventDefault();
    }


})

let swapImagesTimer;
function swapImages(productPic, colorPics, actualIndex) {
    swapImagesTimer = setTimeout(() => {
        updateSrcset(productPic, colorPics[actualIndex]);
        swapImages(productPic, colorPics, actualIndex == colorPics.length - 1 ? 0 : actualIndex + 1);
    }, 1000);
}

function updateSrcset(productPic, colorId) {
    // console.log(colorId);
    let nowSrcset = productPic.getAttribute("srcset");
    let newSrcset = nowSrcset.replace(/\/([^\/]+)\.webp/g, (match, fileName) => match.replace(fileName, colorId));
    productPic.setAttribute("srcset", newSrcset);
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
    cardColors.forEach(i => i.classList.remove("card-color--active"));
    actualColor.classList.add("card-color--active");
    product.dataset.activeColorId = actualColor.dataset.colorId;

    // показать размеры, связанные с цветом в мини-карточке товара
    cardSizes.forEach(i => {
        i.classList.remove("card-size--showed");
        if (actualColor.dataset.colorId == i.dataset.colorId) { i.classList.add("card-size--showed") }
    })
};

function setSwiper(product) {
    let productHeadLink = product.querySelector(".product-card__head-link");
    let colorPics = product.querySelector(`[data-color-id="${product.dataset.activeColorId}"]`).dataset.images.split(",");
    let swiper = product.querySelector(".product-card__swiper");
    if (swiper) {swiper.remove()}

    if (colorPics && colorPics.length > 1) {
        let newSwiper = document.createElement("div");
        newSwiper.classList.add("product-card__swiper");
        for (let i = 0; i < colorPics.length; i++) { newSwiper.appendChild(document.createElement("div")) }
        productHeadLink.append(newSwiper);
    }
};

window.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains("card-color")) {
        let actualColor = e.target;
        let product = actualColor.closest(".product-card");
        let cardColors = product.querySelectorAll(".card-color");
        let cardSizes = product.querySelectorAll(".card-size");
        let productPic = product.querySelector(".product-card__pic");
        let colorPics = actualColor.dataset.images ? actualColor.dataset.images.split(",") : [];

        clearTimeout(swapImagesTimer);
        setActiveColor(cardColors, actualColor, product, cardSizes);
        updateSrcset(productPic, actualColor.dataset.colorId);
        updatePrices(product, actualColor.dataset.priceActual, actualColor.dataset.priceOld);
        updateLinks(product, actualColor.dataset.colorId);
        setSwiper(product);
        if (colorPics.length > 1) {swapImages(productPic, colorPics, 1)}

        actualColor.addEventListener("mouseleave", (event) => { clearTimeout(swapImagesTimer) })

        // всё по умочанию при отведении с карточки товара
        product.addEventListener("mouseleave", (event) => {
            // console.log("отвел с карточки товара");
            clearTimeout(swapImagesTimer);
            updateSrcset(productPic, cardColors[0].dataset.colorId);
            updatePrices(product, cardColors[0].dataset.priceActual, cardColors[0].dataset.priceOld);
            updateLinks(product, cardColors[0].dataset.colorId);
            setActiveColor(cardColors, cardColors[0], product, cardSizes);
        })
    }

    // при наведении на картинку создаем ручной свайпер
    if (e.target.classList.contains("product-card__head-link")) {
        let product = e.target.closest(".product-card");
        setSwiper(product);
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
            catalogTabMenu.append(button);

            button.addEventListener("click", () => {
                catalogTabMenu.classList.toggle("catalog-tab__menu--show-all");
            })
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

            catalogTabs.forEach(tab => {
                tab.classList.remove("is-active");
                if (tab.dataset.tabId == e.target.dataset.tabTarget) {
                    tab.classList.add("is-active");
                }
            })
        })
    })
}

// всплывающие окна через фансибокс
Fancybox.bind("[data-fancybox]", {});

// слайдер через фансибокс
const sliderMain = document.getElementById("sliderMain");
if (sliderMain) { new Carousel(sliderMain, { infinite: false }) }


// let nowMsk = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
// let offset = now.getTimezoneOffset();

// function checkWorktime(start, end) {
//     let now = new Date();
//     let hours = now.getHours();

//     let status;

//     if (hours > start & hours < end) {
//         status = "is-active";
//         text = `Сейчас работает, осталось ${end - hours} часов`
//     } else {
//         status = "is-close"
//     }

//     let el = document.getElementById("js-worktime");
//     if (el) {
//         el.classList.add(status);
//         el.innerText = text;
//     }
// }

// console.log(checkWorktime(10, 20))