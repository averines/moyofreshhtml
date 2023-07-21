"use strict";


// плавно перемещаем к элементу с атрибутом data-scroll-onload
// const scrollHereElements = document.querySelectorAll('[data-scroll-onload]');
// if (scrollHereElements) {
//     scrollHereElements.forEach(scrollHereElement => {
//         scrollHereElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
//     })
// }


// показываем кнопку прокрутки, если промотали достаточно
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
    let wScrollRatio;
    window.addEventListener('scroll', function () {
        wScrollRatio = window.scrollY / window.innerHeight;
        scrollToTopBtn.classList.toggle("is-active", wScrollRatio > 1)
    });
}
