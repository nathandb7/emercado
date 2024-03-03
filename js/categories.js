const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

/**
 * Ordena un array de categorías según el criterio especificado.
 * @param {string} criteria - Criterio de ordenación.
 * @param {Array} array - Array de categorías a ordenar.
 * @returns {Array} - Array ordenado.
 */
function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort((a, b) => (a.name > b.name) ? -1 : (a.name < b.name) ? 1 : 0);
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort((a, b) => {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);
            return (aCount > bCount) ? -1 : (aCount < bCount) ? 1 : 0;
        });
    }
    return result;
}

/**
 * Redirige a la página de productos filtrada por la categoría especificada.
 * @param {number} id - ID de la categoría.
 */
function redirectToProductsByCategory(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

/**
 * Actualiza y muestra la lista de categorías en la interfaz.
 * @param {string} sortCriteria - Criterio de ordenación.
 * @param {Array} categoriesArray - Array de categorías.
 */
function updateCategoriesDisplay(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray !== undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    // Muestra las categorías ordenadas
    showCategoriesList();
}

/**
 * Muestra la lista de categorías filtrada y ordenada.
 */
function showCategoriesList() {
    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        if (((minCount === undefined) || (minCount !== undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount === undefined) || (maxCount !== undefined && parseInt(category.productCount) <= maxCount))) {

            htmlContentToAppend += `
            <div onclick="redirectToProductsByCategory(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `;
        }
    }

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            showCategoriesList();
        }
    });

    const addEventListenerById = (id, eventType, callback) => {
        document.getElementById(id).addEventListener(eventType, callback);
    };

    addEventListenerById("sortAsc", "click", () => updateCategoriesDisplay(ORDER_ASC_BY_NAME));
    addEventListenerById("sortDesc", "click", () => updateCategoriesDisplay(ORDER_DESC_BY_NAME));
    addEventListenerById("sortByCount", "click", () => updateCategoriesDisplay(ORDER_BY_PROD_COUNT));
    addEventListenerById("clearRangeFilter", "click", () => clearRangeFilter());

    addEventListenerById("rangeFilterCount", "click", () => {
        minCount = parseAndValidateInput("rangeFilterCountMin");
        maxCount = parseAndValidateInput("rangeFilterCountMax");
        showCategoriesList();
    });
});

/**
 * Limpia el filtro de rango y muestra la lista completa de categorías.
 */
function clearRangeFilter() {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    minCount = undefined;
    maxCount = undefined;
    showCategoriesList();
}

/**
 * Parsea y valida la entrada de un elemento de input.
 * @param {string} inputId - ID del elemento de input.
 * @returns {number|undefined} - Valor parseado o undefined si no es válido.
 */
function parseAndValidateInput(inputId) {
    const inputValue = document.getElementById(inputId).value;
    const parsedValue = parseInt(inputValue);

    if (isNaN(parsedValue) || parsedValue < 0) {
        return undefined;
    }

    return parsedValue;
}
