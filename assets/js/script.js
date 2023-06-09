
window.addEventListener('click', (e) => {
    if (e.target.classList.contains("accordion__title")) {
        e.target.closest(".accordion__item").classList.toggle("is-opened");
    }
})