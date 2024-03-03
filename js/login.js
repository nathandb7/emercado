const email = document.getElementById('email');
const password = document.getElementById('password');
const button = document.getElementById('button');
const mensajee = document.getElementById('mensajee');
const mensajep = document.getElementById('mensajep');

button.addEventListener('click', (e) => {
    e.preventDefault()
    const data = {
        email: email.value,
        password: password.value,
    }
    if (data.password.length >= 6 && data.email !== '' && 
    data.password !== '') {
        localStorage.setItem("email", data.email);
        window.location='index.html';
    }
    else {
        email.className += ' is-invalid'
        password.className += ' is-invalid'
        mensajee.innerHTML = '<p class="text-danger">Email inválido</p> '
        mensajep.innerHTML = '<p class="text-danger">Contraseña invalida</p>'
    }
});
