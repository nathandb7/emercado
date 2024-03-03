// headerLoader.js
document.addEventListener("DOMContentLoaded", function () {
  const headerContainer = document.getElementById("header-container");

  // Utilizamos fetch para cargar el encabezado
  fetch("header.html")
    .then(response => response.text())
    .then(html => {
      // Añadir el HTML al contenedor
      headerContainer.innerHTML = html;

      // Llamar a la función después de cargar el encabezado
      initializeHeader();
    })
    .catch(error => {
      console.error('Error al cargar el encabezado:', error);
    });

  // Función que contiene la lógica para inicializar el encabezado
  function initializeHeader() {
    let email = localStorage.getItem("email");
    document.getElementById('navbarDarkDropdownMenuLink').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-square" viewBox="0 0 16 16">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
  </svg> ${email}`

    const logout = document.getElementById('logout');
    if (logout) {
      logout.addEventListener('click', (e) => {
        localStorage.clear();
        window.location = "login.html";
      });
    }
  }
});
