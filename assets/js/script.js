const body = document.querySelector("body");

window.addEventListener('click', (e) => {
    if (e.target.classList.contains("accordion__title")) {
        e.target.closest(".accordion__item").classList.toggle("is-opened");
    }

    if (e.target.classList.contains("product-card__fav")) {
        if (!e.target.classList.contains("is-active")) {
            e.target.classList.toggle("is-active");
            e.target.innerHTML = "<span></span>";
        } else {
            e.target.classList.remove("is-active");
        }
    }

    if (e.target.classList.contains("catalog-btn")) {
        e.target.classList.toggle("is-active");
        body.classList.toggle("is-dropdown-open");
    }

})