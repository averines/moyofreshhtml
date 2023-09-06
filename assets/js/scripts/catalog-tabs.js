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
