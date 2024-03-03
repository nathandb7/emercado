// URL del carrito de usuario
let cart_url = `https://japceibal.github.io/emercado-api/user_cart/25801.json`;

// Factor de conversión de UYU a USD
const UYU_TO_USD = 42;

// Funciones de selección del DOM
const s = document.querySelector.bind(document);
const sAll = document.querySelectorAll.bind(document);

// Elementos del DOM
const cartProductList = s('#cart-products'),
    totalElement = s('#cart-total'),
    subtotalElement = s('#cart-subtotal'),
    envioElement = s('#cart-envio'),
    totalProductCountElement = s('#total-product-count'),
    radio15 = s('#radio15'),
    radio7 = s('#radio7'),
    radio5 = s('#radio5');

let products;
let totalProductCount = 0;
let total;

// Obtener datos del carrito del usuario mediante una solicitud fetch
fetch(cart_url)
    .then(respuesta => respuesta.json())
    .then(datos => {
        products = datos.articles;
        console.log(products)
        showCartProducts()
    });

// Funciones de actualización de valores

// Actualizar el valor total del carrito
function updateTotal() {
    total = array.reduce((accum, product) => {
        let total = accum + product.count * product.unitCost;
        if (product.currency === 'UYU') {
            total /= UYU_TO_USD;
        }

        return total;
    }, 0);
    subtotalElement.innerHTML = total.toFixed(2);
}

// Actualizar el subtotal de un producto específico
function updateSubtotal(idx) {
    let subtotal;

    subtotal = array[idx].count * array[idx].unitCost;

    if (array[idx].currency === 'UYU') {
        subtotal /= UYU_TO_USD;
    }
    document.getElementById(`product-subtotal-${idx}`).innerHTML =
        'USD ' + subtotal.toFixed(2);
}

// Actualizar el costo de envío según la opción seleccionada
let radios = document.getElementsByName('costoenvio');
function updateCostoEnvio() {
    let porcentaje = 0;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            porcentaje = radios[i].value;
        }
    }
    envioElement.innerHTML = (total * porcentaje / 100).toFixed(2);
    totalElement.innerHTML = (parseInt(envioElement.innerHTML) + total).toFixed(2);
}

// Configurar eventos de cambio para los botones de costo de envío
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', updateCostoEnvio);
}

// Mostrar productos y ejecutar funciones
function showCartProducts() {
    array = products.concat(getCarritoPrducts());
    console.log(array)
    cartProductList.innerHTML = array.reduce((currentHtml, product, idx) => {
        return (currentHtml + `
                <tr>
                <span class="badge badge-primary" id="product-count-badge-${idx}">${product.count}</span>
                <th scope="row"><img src="${product.image}" class="img-thumbnail"/></th>
                <td>${product.name}</td>
                <td>${product.currency} ${product.unitCost}</td>
                <td><input type="number" class="product-count-input" data-product-idx="${idx}" value="${product.count}" min="0"/></td>
                <td><span id="product-subtotal-${idx}">0</span></td>
                <td>
              <div class="list-group-item list-group-item-action border-0">
            ${product.id
                ? `<button class='delete-product' data-delete-id="${product.id}">
                                <svg width="24px" height="24px" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                </svg>     
                    </button>`
                : ''
            }
            </td>
            </div>
            </tr>
            `
        );
    }, '');
    updateTotal();
    for (let productCountInput of sAll('.product-count-input')) {
        const idx = productCountInput.dataset.productIdx;
        updateSubtotal(idx);
        productCountInput.addEventListener('input', ({ target }) => {
            array[idx].count = +target.value;
            document.getElementById(
                `product-count-badge-${idx}`
            ).innerHTML = +target.value;
            updateSubtotal(idx);
            updateTotal();
            updateCostoEnvio();
        });
    }
    const buttons = document.getElementsByClassName('delete-product');
    updateCostoEnvio();
    for (let item of buttons) {
        item.onclick = ({ currentTarget }) => {
            unstoreProduct(currentTarget.dataset.deleteId);
        };
    }
}

// Obtener productos almacenados en el carrito desde localStorage
function getCarritoPrducts() {
    const products = JSON.parse(localStorage.getItem('cart'))?.array || [];

    return products;
}

// Almacenar un producto en el carrito en localStorage
function storeCarrito(product) {
    storeCarritoArray = getCarritoPrducts();

    const newData = {
        array: storeCarritoArray.concat({ ...product }),
    };

    localStorage.setItem('cart', JSON.stringify(newData));
}

// Eliminar un producto del carrito almacenado en localStorage
function unstoreProduct(id) {
    storeCarritoArray = getCarritoPrducts();

    const newData = {
        array: storeCarritoArray.filter((cart) => cart.id !== +id),
    };

    localStorage.setItem('cart', JSON.stringify(newData));

    if (id == 50924) {
        products = [];
    }
    showCartProducts();
}

// Configurar eventos de cambio para los botones de forma de pago
let rformadepago = document.getElementsByName('formadepago');
let numeroTarjeta = document.getElementsByName('ntarjeta'),
    codigoseguridad = document.getElementsByName('cseguridad'),
    vencimiento = document.getElementsByName('vencimiento'),
    numeroCuenta = document.getElementsByName('ncuenta');

for (let i = 0; i < rformadepago.length; i++) {
    rformadepago[i].addEventListener('click', function () {
        if (this.value == 'tarjeta') {
            numeroTarjeta[0].disabled = false;
            codigoseguridad[0].disabled = false;
            vencimiento[0].disabled = false;
            numeroCuenta[0].disabled = true;
        } else {
            numeroTarjeta[0].disabled = true;
            codigoseguridad[0].disabled = true;
            vencimiento[0].disabled = true;
            numeroCuenta[0].disabled = false;
        }
    });
}

// Validación de formularios
(function () {
    'use strict'

    // Obtener todos los formularios a los que se aplicarán estilos de validación personalizados de Bootstrap
    let forms = document.querySelectorAll('.needs-validation')

    // Recorrerlos y evitar la presentación
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                if (!document.getElementById('tarjeta').checked || !document.getElementById('transferencia').checked) {
                    document.getElementById('test').classList.remove('d-none');
                    document.getElementById('tyc').classList.add('text-danger');
                    event.preventDefault();
                }
                if (document.getElementById('tarjeta').checked || document.getElementById('transferencia').checked) {
                    document.getElementById('test').classList.add('d-none');
                    document.getElementById('tyc').classList.remove('text-danger');
                    event.preventDefault();
                }
                if (form.checkValidity()) {
                    document.getElementById('comprado').classList.remove('d-none');
                }
                form.classList.add('was-validated')
            }, false)
        })
})();
