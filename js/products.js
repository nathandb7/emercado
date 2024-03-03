let catId = localStorage.getItem('catID');
const productsUrl = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;

let divListaProductos = document.getElementById('prod-list-container');
let btnFilter = document.getElementById('rangeFilterCount');
let btnLimpiar = document.getElementById('clearRangeFilter');
let inputMin = document.getElementById('rangeFilterCountMin');
let inputMax = document.getElementById('rangeFilterCountMax');
let btnPrecioA = document.getElementById('sortAsc');
let btnPrecioD = document.getElementById('sortDesc');
let btnRel = document.getElementById('sortByCount');
let productos = [];

function setProd(prodId) {
    localStorage.setItem('prodID', prodId);
    window.location = "product-info.html";
}

function buscarProducto(input, selector) {
    document.addEventListener("keyup", e => {
        if (e.target.matches(input)) {
            let valor = e.target.value.toLowerCase();
            document.querySelectorAll(selector).forEach(el =>
                el.textContent.toLowerCase().includes(valor)
                    ? el.classList.remove("filter")
                    : el.classList.add("filter")
            );
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    btnPrecioA.addEventListener('click', function () { ordenarProductos('cost', 'asc'); });
    btnPrecioD.addEventListener('click', function () { ordenarProductos('cost', 'desc'); });
    btnRel.addEventListener('click', function () { ordenarProductos('soldCount', 'desc'); });

    btnFilter.addEventListener('click', function () { mostrarProductos(); });
    btnLimpiar.addEventListener('click', function () { window.location = 'products.html'; });

    fetch(productsUrl)
        .then(response => response.json())
        .then(data => {
            productos = data.products;
            if (productos.length === 0) {
                // Mostrar SweetAlert
                Swal.fire({
                    icon: 'info',
                    title: 'Parece que no hay productos en esta categoría actualmente',
                    showCancelButton: true,
                    confirmButtonText: 'Volver a Categorías',
                    cancelButtonText: 'Cerrar',
                }).then((result) => {
                    if (result.value) {
                        // Aquí puedes redirigir a la página de categorías
                        window.location.href = 'categorias.html';
                    }
                });
            } else {
                mostrarProductos();
            }            
        });

    buscarProducto(".buscar", ".producto");
});

function ordenarProductos(criterio, orden) {
    productos.sort((product1, product2) => {
        const valor1 = (criterio === 'cost') ? product1[criterio] : parseInt(product1[criterio]);
        const valor2 = (criterio === 'cost') ? product2[criterio] : parseInt(product2[criterio]);

        if (valor1 < valor2) {
            return (orden === 'asc') ? -1 : 1;
        } else if (valor1 > valor2) {
            return (orden === 'asc') ? 1 : -1;
        } else {
            return 0;
        }
    });

    mostrarProductos();
}

function mostrarProductos() {
    const filtro = filtrarProductos();
    divListaProductos.innerHTML = '';

    for (let product of filtro) {
        divListaProductos.innerHTML += `
            <div onclick="setProd(${product.id})" class="list-group-item list-group-item-action producto">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <div>
                                <small class="text-muted">${product.soldCount} vendidos</small>
                            </div>
                        </div>
                        ${product.description}
                    </div>
                </div>
            </div>
        `;
    }
}

function filtrarProductos() {
    return productos.filter(product => {
        const costo = product.cost;
        const valorMin = inputMin.value || 0;
        const valorMax = inputMax.value || Infinity;

        return (costo >= valorMin && costo <= valorMax);
    });
}
