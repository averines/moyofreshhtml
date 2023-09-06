// слайдер просмотренных товаров через свайпер
const swiperRecentProducts = new Swiper('.js-swiper-recent-products', {
    loop: false,
    spaceBetween: 20,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
    slidesPerView: 2,

    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 15
        },
        400: {
            slidesPerView: 2.5,
            spaceBetween: 15
        },
        575: {
            slidesPerView: 3.5,
            spaceBetween: 15
        },
        750: {
            slidesPerView: 4.5,
            spaceBetween: 20
        },
        1000: {
            slidesPerView: 5,
            spaceBetween: 20
        },
        1100: {
            slidesPerView: 5.5,
            spaceBetween: 25
        },
        1300: {
            slidesPerView: 7,
            spaceBetween: 25
        },
        1600: {
            slidesPerView: 7,
            spaceBetween: 30
        }
    }
});

const swiperMainSlider = new Swiper('.js-swiper-main-slider', {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination' },
    a11y: {
        prevSlideMessage: 'Назад',
        nextSlideMessage: 'Вперёд',
    },
    // effect: "fade",
    autoplay: {
        delay: 5000,
    },
    autoHeight: true,
});


// слайдер через фансибокс
// const sliderMain = document.getElementById("main-slider");
// if (sliderMain) { new Carousel(sliderMain, { infinite: false }) }

// слайдер Просмотренных товаров фансибокс
// const sliderViewedProducts = document.getElementById("viewedProducts");
// if (sliderViewedProducts) { new Carousel(sliderViewedProducts, { infinite: false, fill: false, slidesPerPage: 7, transition: "slide" }) }