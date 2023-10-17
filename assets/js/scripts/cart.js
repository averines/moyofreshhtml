let countInputs = document.querySelectorAll(".cart-product-count__input");
if (countInputs) {
    countInputs.forEach(i => {
        i.addEventListener('input', (e) => {
            // запретить вводить кроме чисел
            let intValue = parseInt(e.target.value);

            if (isNaN(intValue)) {
                e.target.value = "0";
            } else {
                e.target.value = intValue.toString();
            }
        });

        i.addEventListener('blur', (e) => {
            updateCartProductSizeCount(e.target.closest(".cart-product-size"));
        })
    })
}


function updateCartProductSizeCount(el) {
    let priceEl = el.querySelector('.cart-product-size__price');
    let priceValue = parseFloat(priceEl.innerText.match(/\d+,\d+/)[0].replace(",", "."));

    let countEl = el.querySelector('.cart-product-count__input');
    let countValue = parseInt(countEl.value);

    let totalValue = priceValue * countValue;
    let totalEl = el.querySelector('.cart-product-size__total');

    let minusBtn = el.querySelector('.cart-product-count__btn--minus');
    let plusBtn = el.querySelector('.cart-product-count__btn--plus');

    if (countValue > 0) {
        el.classList.remove('cart-product-size--not-added');
        totalEl.innerText = totalValue.toLocaleString("ru-RU", { style: "currency", currency: "RUB" });
        minusBtn.classList.remove('is-disabled');
    } else {
        totalEl.innerText = "";
        el.classList.add('cart-product-size--not-added');
        minusBtn.classList.add('is-disabled');
    }

    if (countValue == 999) {
        plusBtn.classList.add('is-disabled');
    } else {
        plusBtn.classList.remove('is-disabled');
    }

    updateCartProductTotalCount(el)
}

function updateCartProductTotalCount(el) {
    let cartProductSizesEl = el.closest('.cart-product__sizes')
    let cartProductSizes = cartProductSizesEl.querySelectorAll('.cart-product-size:not(.cart-product-size--not-added)');
    if (cartProductSizes.length > 0) {
        cartProductSizesEl.classList.remove('cart-product__sizes--empty');
    } else {
        cartProductSizesEl.classList.add('cart-product__sizes--empty');
    }
}

