function updateActiveFilterCount(filterGroup) {
    let activeSiblingCheckboxes = filterGroup.querySelectorAll("input.filter-checkbox:checked");
    if (activeSiblingCheckboxes.length) {
        filterGroup.dataset.activeFilterCount = activeSiblingCheckboxes.length;
    } else {
        delete filterGroup.dataset.activeFilterCount;
    }
}

// прячем обертку удаления фильтров на основании счетчика активных фильтров
function updateVisibilityActiveFiltersWrap() {
    let activeFiltersWrap = document.querySelector(".active-filters-wrap");
    let filterGroups = document.querySelectorAll(".catalog-filter[data-active-filter-count]");
    if (filterGroups.length) {
        activeFiltersWrap.classList.remove("active-filters-wrap--hidden");
    } else {
        activeFiltersWrap.classList.add("active-filters-wrap--hidden");
        activeFiltersWrap.querySelectorAll(".active-filter").forEach(i => i.remove());
    }
}

function setFilterRange(filterGroupId, min, max) {
    let activeFiltersWrap = document.querySelector(".active-filters-wrap");
    let activeFilter = document.createElement("button");
    activeFilter.classList.add("active-filter");
    activeFilter.innerText = `${min}-${max}₽`;
    activeFilter.dataset.action = "clear-filter";
    activeFilter.dataset.filterGroup = filterGroupId;
    activeFiltersWrap.appendChild(activeFilter);
}

function toggleFilter(filterId, filterStatus, filterText) {
    let activeFiltersWrap = document.querySelector(".active-filters-wrap");
    let activeCheckbox = document.getElementById(filterId);
    let filterGroupId = filterId.split("-")[0];
    let filterGroup = document.querySelector(`.catalog-filter[data-filter-group="${filterGroupId}"]`);

    // это чекбокс
    if (filterGroup.querySelector(".filter-checkbox")) {
        if (filterStatus) {
            // создаем кнопку
            let activeFilter = document.createElement("button");
            activeFilter.classList.add("active-filter");
            activeFilter.innerText = filterText;
            activeFilter.dataset.action = "clear-filter";
            activeFilter.dataset.filterId = filterId;
            activeFilter.dataset.filterGroup = filterGroupId;
            activeFiltersWrap.appendChild(activeFilter);
        } else {
            // снимаем чекбокс
            activeCheckbox.checked = false;

            // удаляем кнопку
            document.querySelector(`.active-filter[data-filter-id="${filterId}"]`).remove();
        }
    }

    // это интервал
    if (filterGroup.querySelector(".filter-range")) {
        // удаляем кнопку
        document.querySelector(`.active-filter[data-filter-id="${filterId}"]`).remove();
    }

    updateActiveFilterCount(filterGroup)
    updateVisibilityActiveFiltersWrap();
}



function clearFilterGroup(filterGroupId) {
    let filterGroup = document.querySelector(`.catalog-filter[data-filter-group="${filterGroupId}"]`);

    let activeCheckboxes = filterGroup.querySelectorAll("input.filter-checkbox:checked")
    if (activeCheckboxes.length) {
        activeCheckboxes.forEach(i => toggleFilter(i.id));
    } else {
        let activeRange = filterGroup.querySelector(".filter-range");
        if (activeRange) {
            activeRange.querySelector('.filter-range__input[data-range="min"]').value = activeRange.dataset.rangeMin;
            activeRange.querySelector('.filter-range__input[data-range="max"]').value = activeRange.dataset.rangeMax;
            delete filterGroup.dataset.activeFilterCount;
        }
    }
}