/* Cargar una imagen con input y guardar en localStorage */
let profileImage = document.getElementById('fperfil');

// Verificar si hay una imagen guardada en localStorage
if (localStorage.getItem("image") == null) {
    profileImage.src = 'img/img_perfil.png';
} else {
    profileImage.src = localStorage.getItem('image');
}

let saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', function () {
    let fileInput = document.getElementById('file').files[0];    
    // Verificar si se seleccionó un archivo
    if (fileInput == undefined) {
        saveUserData();
    } else {
        let reader = new FileReader();
        reader.onload = function (e) {
            // Guardar la imagen en localStorage como base64
            localStorage.setItem('image', e.target.result);
        };
        reader.readAsDataURL(fileInput);
        saveUserData();
    }
});

/* Guardar datos de usuario de input en localStorage */
let firstNameInput = document.getElementById('firstNameInput');
let secondNameInput = document.getElementById('secondNameInput');
let firstLastNameInput = document.getElementById('firstLastNameInput');
let secondLastNameInput = document.getElementById('secondLastNameInput');
let phoneNumberInput = document.getElementById('phoneNumberInput');

function saveUserData() {
    let userData = {
        firstName: firstNameInput.value,
        secondName: secondNameInput.value,
        firstLastName: firstLastNameInput.value,
        secondLastName: secondLastNameInput.value,
        phoneNumber: phoneNumberInput.value
    };
    localStorage.setItem('userData', JSON.stringify(userData));
}

/* Llamar datos */
let emailInput = document.getElementById('email');  
let storedEmail = localStorage.getItem("email");
if (localStorage.getItem("userData") != null) {
    emailInput.value = storedEmail;

    let userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
    firstNameInput.value = userDataFromLocalStorage.firstName || '';
    secondNameInput.value = userDataFromLocalStorage.secondName || '';
    firstLastNameInput.value = userDataFromLocalStorage.firstLastName || '';
    secondLastNameInput.value = userDataFromLocalStorage.secondLastName || '';
    phoneNumberInput.value = userDataFromLocalStorage.phoneNumber || ''; 
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
})();
