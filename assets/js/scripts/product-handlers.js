
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