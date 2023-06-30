const body = document.querySelector("body");
const catalogNav = document.querySelector(".catalog-nav");
const catalogBtn = document.querySelector(".catalog-btn");

window.addEventListener('click', (e) => {
    // показать/спрятать пунк аккордеона
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