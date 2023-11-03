// имитация авторизации, удалить этот скрипт на продакшене


window.addEventListener('click', (e) => {
    if (e.target.dataset.hasOwnProperty('action')) {
        e.preventDefault();
        if (e.target.dataset.action == "login") {
            console.log('Демо авторизация: вход')
            document.cookie = "auth=true";
            window.location.reload();
        }
    }

    if (e.target.classList.contains('account-menu__logout')) {
        console.log('Демо авторизация: выход')
        document.cookie = "auth=false";
        window.location.reload();
    }
})

let userBtn = document.querySelector('.user-btn__title');
let url = window.location.href;

if (document.cookie.split(';').filter((item) => item.includes('auth=true')).length) {
    console.log('Демо авторизация: авторизован');
    if (userBtn) { userBtn.innerText = 'Кабинет' }

    // заменить все ссылки с user на customer
    let userLinks = document.querySelectorAll('a[href*="user"]');
    if (userLinks) { userLinks.forEach((link) => { link.href = link.href.replace('user', 'customer') }) }

    if (url.includes('user')) {
        url = url.replace('user', 'customer');
        window.location.href = url;
    }


} else {
    console.log('Демо авторизация: не авторизован')
    if (userBtn) { userBtn.innerText = 'Войти' }

    // заменить все ссылки с customer на user
    let customerLinks = document.querySelectorAll('a[href*="customer"]');
    if (customerLinks) { customerLinks.forEach((link) => { link.href = link.href.replace('customer', 'user') }) }


    if (url.includes('customer')) {
        url = url.replace('customer', 'user');
        if (url.includes("user-account") || url.includes("user-orders") || url.includes("user-info")) {
            window.location.href = "/";
        } else {
            window.location.href = url;
        }
    }
}