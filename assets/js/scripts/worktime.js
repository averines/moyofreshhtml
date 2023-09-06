// окончания для единиц измерения на русском языке
function getRussainDeclension(variants, number) {
    // ["час", "часа", "часов"] = ..1 час, ..2/3/4 часа, остальные часов
    let variant;
    if (number === 1 || (number > 20 && number % 10 === 1)) { variant = variants[0] }
    else if ((number >= 2 && number <= 4) || (number > 20 && number % 10 >= 2 && number % 10 <= 4)) { variant = variants[1] }
    else { variant = variants[2] }
    return variant;
}

// расчет времени до закрытия/открытия магазина
function getWorktimeStatus(element) {
    // у element должны быть атрибуты data-worktime-open и data-worktime-close со значениями в формате "23:30"
    // и data-worktime-close с перечеслением номеров дней недели

    // получаем текущую дату и время в часовом поясе Москвы
    const moscowTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
    const currentTime = new Date(moscowTime);
    const currentDayOfWeek = currentTime.getDay()

    // получаем сортированный список рабочих дней недели
    let workDays = element.dataset.worktimeDays.replace(" ", "").split(",").map(i => parseInt(i)).sort();

    // определяем номер следующего рабочего дня
    let nextWorkDayOfWeek = workDays.find(day => day > currentDayOfWeek) || workDays[0];

    const openTime = new Date();
    const [worktimeOpenHours, worktimeOpenMinutes] = element.dataset.worktimeOpen.replace(" ", "").split(":").map(i => parseInt(i));
    openTime.setHours(worktimeOpenHours);
    openTime.setMinutes(worktimeOpenMinutes);

    const closeTime = new Date();
    let [worktimeCloseHours, worktimeCloseMinutes] = element.dataset.worktimeClose.replace(" ", "").split(":").map(i => parseInt(i));
    closeTime.setHours(worktimeCloseHours);
    closeTime.setMinutes(worktimeCloseMinutes);

    let statusHours, statusMinutes, timeDiff, statusMessage;

    // проверяем, открыт ли магазин сейчас
    if (workDays.includes(currentDayOfWeek) && currentTime >= openTime && currentTime <= closeTime) {
        timeDiff = Math.abs(closeTime - currentTime); // время до закрытия магазина
        statusMessage = "Сейчас открыто, закроется через";
    } else {
        const delta = nextWorkDayOfWeek > currentDayOfWeek ? nextWorkDayOfWeek - currentDayOfWeek : 7 - currentDayOfWeek + workDays[0];
        const nextWorkDay = new Date();
        nextWorkDay.setDate(currentTime.getDate() + delta);
        nextWorkDay.setHours(openTime.getHours());
        nextWorkDay.setMinutes(openTime.getMinutes());

        timeDiff = Math.abs(nextWorkDay - currentTime); // время до открытия магазина
        statusMessage = "Сейчас закрыто, откроется через";
        element.classList.add("is-close");
    }

    statusHours = Math.floor(timeDiff / 3600000);
    statusMinutes = Math.floor((timeDiff % 3600000) / 60000);
    element.innerHTML = `${statusMessage} ${statusHours > 0 ? statusHours + "&nbsp;" + getRussainDeclension(["час", "часа", "часов"], statusHours) : ""}&nbsp;${statusMinutes}&nbsp;${getRussainDeclension(["минуту", "минуты", "минут"], statusMinutes)}`
}


const worktimeEl = document.getElementById("js-worktime");
if (worktimeEl) { getWorktimeStatus(worktimeEl) }
