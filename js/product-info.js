// Variables globales
let ProdId1 = localStorage.getItem('prodID');
let catId1 = localStorage.getItem('catID');
const proURL = `https://japceibal.github.io/emercado-api/products/${ProdId1}.json`;
const comentURL = `https://japceibal.github.io/emercado-api/products_comments/${ProdId1}.json`;
let storeCommentsArray = [];
let selectedScore = 0;
let category = {};
let fetchedComments = [];
let storeCarritoArray = [];

// Elementos del DOM
const s = document.querySelector.bind(document);
const productNameHTML = s('#productName');
const productDescriptionHTML = s('#productDescription');
const productCostHTML = s('#productCost');
const productSoldCountHTML = s('#productSoldCount');
const relatedProductsGallery = s('#related-products-gallery');
const productimagescarousel = s('#product-images-carousel');
const carouselIndicators = s('#product-images-carousel .carousel-indicators');
const carouselImages = s('#product-images-carousel .carousel-inner');
const addCart = s('#addCart');
const addGoCart = s('#addGoCart');
const commentList = s('#comment-list');
const commentForm = s('#comment-form');
const userNameInput = commentForm['user-name'];
const commentContentInput = commentForm['comment-content'];
const commentStarButtons = document.querySelectorAll('#user-review-stars .fa-star');

// Funciones

// Selecciona producto relacionado
function setProd(ProdId) {
    window.localStorage.removeItem('prodID');
    localStorage.setItem('prodID', ProdId);
}

// Muestra la galería de imágenes del producto
function showImagesGallery(imageList) {
    let carouselIndicatorsHtml = '';
    let carouselImagesHtml = '';
    imageList.forEach((image, idx) => {
        carouselIndicatorsHtml += `<button type="button" data-bs-target="#product-images-carousel" data-bs-slide-to="${idx}" ${!idx ? 'class="active"' : ''} ${!idx ? 'aria-current="true"' : ''} aria-label="Slide ${idx}" ></button>`;

        carouselImagesHtml += `<div class="carousel-item ${!idx ? 'active' : ''}">
                        <img src="${image}" class="d-block w-100" alt="img ${idx}">
                    </div>`;
    });

    carouselIndicators.innerHTML = carouselIndicatorsHtml;
    carouselImages.innerHTML = carouselImagesHtml;
}


// Resetea las estrellas de la calificación de comentarios
function resetStars() {
    commentStarButtons[0].parentElement.classList.remove('checked');

    for (let star of commentStarButtons) {
        star.classList.remove('checked');
        selectedScore = 0;
    }
}

// Renderiza los comentarios en la interfaz
function renderComments() {
    let htmlContentToAppend = '';
    const array = fetchedComments.concat(getStoreComments());

    for (let i = 0; i < array.length; i++) {
        const comment = array[i];

        htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="img/img_perfil.png" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${comment.user}</h4>
                            <small class="font-muted">
                                <div class="comment-stars">${genStars(comment.score)}</div>
                                ${comment.dateTime}
                            </small>
                        </div>
                        ${comment.description}
                    </div>
                </div>
                ${comment.id
                ? `<button class='delete-comment' data-delete-id="${comment.id}">
                            <svg width="24px" height="24px" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                            </svg>     
                        </button>`
                : ''
            }
            </div>`;
    }
    commentList.innerHTML = htmlContentToAppend;

    const buttons = document.getElementsByClassName('delete-comment');

    for (let item of buttons) {
        item.onclick = ({ currentTarget }) => {
            unstoreComment(currentTarget.dataset.deleteId);
        };
    }
}

// Genera el HTML para las estrellas de calificación de comentarios
function genStars(score) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${score === i ? 'checked' : ''}"></i>`;
    }
    return stars;
}

// Muestra productos relacionados
function relatedProducts(relacionados) {
    let relatedhtml = '';
    for (let producto of relacionados) {
        relatedhtml += `<div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <a onclick="setProd(${producto.id})" href="product-info.html"><img class="img-fluid img-thumbnail" src="${producto.image}" alt="${producto.name}">
                </a>
            </div>
        </div>`;
    }
    relatedProductsGallery.innerHTML = relatedhtml;
}

// Maneja el clic en una estrella de calificación
function handleStarClick(star, idx) {
    const clickedStar = star;

    for (let star of commentStarButtons) {
        star.classList.remove('checked');
    }
    clickedStar.parentElement.classList.add('checked');
    clickedStar.classList.add('checked');

    selectedScore = idx + 1;
}

// Maneja el envío de un nuevo comentario
function handleSubmitComment(e) {
    e.preventDefault();

    const newComment = {
        user: userNameInput.value,
        description: commentContentInput.value,
        score: selectedScore,
        dateTime: new Date().toLocaleString(),
    };

    storeComment(newComment);
    e.target.reset();
    resetStars();
}

// Obtiene los comentarios almacenados localmente
function getStoreComments() {
    const array = JSON.parse(localStorage.getItem('comments'))?.array || [];
    array.forEach((comment, idx) => (comment.id = idx + 1));

    return array;
}

// Almacena un comentario localmente
function storeComment(comment) {
    storeCommentsArray = getStoreComments();
    const newData = {
        array: storeCommentsArray.concat({ ...comment }),
    };
    localStorage.setItem('comments', JSON.stringify(newData));
    renderComments();
}

// Elimina un comentario almacenado localmente
function unstoreComment(id) {
    storeCommentsArray = getStoreComments();

    const newData = {
        array: storeCommentsArray.filter((comment) => comment.id !== +id),
    };

    localStorage.setItem('comments', JSON.stringify(newData));

    renderComments();
}

// Obtiene los productos almacenados en el carrito localmente
function getCarritoPrducts() {
    const array = JSON.parse(localStorage.getItem('cart'))?.array || [];
    return array;
}

// Almacena un producto en el carrito localmente
function storeCarrito(product, id) {
    let storeCarritoArray = getCarritoPrducts();
    let productoExistente = false;

    storeCarritoArray.forEach(item => {
        if (item.id === id) {
            // El producto ya existe en el carrito, actualiza el count
            item.count += 1;
            productoExistente = true;
        }
    });

    if (!productoExistente) {
        // El producto no existe en el carrito, agrégalo con count inicial de 1
        storeCarritoArray.push({ ...product, count: 1 });
    }

    // Actualizar el carrito en el localStorage después de la operación
    actualizarLocalStorage(storeCarritoArray);
}

// Función para actualizar el localStorage con el nuevo array del carrito
function actualizarLocalStorage(carritoArray) {
    let newData = {
        array: carritoArray,
    };

    localStorage.setItem('cart', JSON.stringify(newData));
}

// Evento cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    try {
        // Configurar eventos para clics en estrellas
        for (let [idx, star] of commentStarButtons.entries()) {
            star.onclick = () => handleStarClick(star, idx);
        }

        // Configurar evento de envío de formulario de comentario
        commentForm.onsubmit = handleSubmitComment;

        // Realizar la solicitud fetch para obtener los datos del producto
        fetch(proURL)
            .then(respuesta => {
                // Verificar si la solicitud fue exitosa
                if (!respuesta.ok) {
                    // Lanzar error si la respuesta no es exitosa
                    throw new Error(`Error en la solicitud: ${respuesta.status} - ${respuesta.statusText}`);
                }
                // Parsear la respuesta a formato JSON
                return respuesta.json();
            })
            .then(datos => {
                // Actualizar la información del producto en la página
                productNameHTML.innerHTML = datos.name;
                productDescriptionHTML.innerHTML = datos.description;
                productCostHTML.innerHTML = `${datos.currency} ${datos.cost}`;
                productSoldCountHTML.innerHTML = datos.soldCount;
                relatedProducts(datos.relatedProducts);
                showImagesGallery(datos.images);

                // Crear un nuevo objeto de producto para el carrito
                const newProduct = {
                    count: 1,
                    currency: datos.currency,
                    id: datos.id,
                    image: datos.images[0],
                    name: datos.name,
                    unitCost: datos.cost,
                };

                // Configurar evento de clic para el botón de compra
                addCart.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Almacenar el nuevo producto en el carrito
                    storeCarrito(newProduct, newProduct.id);
                    Swal.fire({
                        icon: 'success',
                        title: 'Agregado al carrito correctamente',
                        showConfirmButton: false,
                        timer: 1500
                      });
                });
                // Configurar evento de clic para el botón de compra
                addGoCart.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Almacenar el nuevo producto en el carrito
                    storeCarrito(newProduct, newProduct.id);
                    // Redirigir a la página de carrito
                    window.location.href = "cart.html";
                });
            })
            .catch(error => {
                // Manejar errores en caso de problemas con la solicitud fetch
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salió mal!",
                    footer: `${error}`,
                    confirmButtonText: "Volver al inicio",
                }).then(() => {
                    // Redirigir a index.html al hacer clic en el botón de confirmación
                    window.location.href = "index.html";
                });
            });
    } catch (error) {
        // Manejar errores en caso de problemas con el bloque try
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal!",
            footer: `${error}`
        });
    }

    // Realizar la solicitud fetch para obtener los comentarios del producto
    fetch(comentURL)
        .then(respuesta => respuesta.json())
        .then(datos => {
            // Almacenar los comentarios obtenidos
            fetchedComments = datos;
            // Renderizar los comentarios en la página
            renderComments();
        });
});


