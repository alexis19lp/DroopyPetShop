const form = document.getElementById("formFinalizarCompra");
const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");

form.addEventListener("submit", validarYConfirmarCompra);

function validarYConfirmarCompra(event) {
  event.preventDefault();

  // Obtiene los campos
  const nombre = document.getElementById("nombre");
  const direccion = document.getElementById("direccion");
  const email = document.getElementById("email");

  // Limpia clases previas
  [nombre, direccion, email].forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
  });

  let valido = true;

  // Valida el nombre
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}$/;
  if (!nombre.value.trim() || !nombreRegex.test(nombre.value)) {
    nombre.classList.add("is-invalid");
    valido = false;
  } else {
    nombre.classList.add("is-valid");
  }

  // Valida la dirección
  if (!direccion.value.trim() || direccion.value.trim().length < 5) {
    direccion.classList.add("is-invalid");
    valido = false;
  } else {
    direccion.classList.add("is-valid");
  }

  // Valida el email
  if (!email.value.includes("@") || !email.value.includes(".")) {
    email.classList.add("is-invalid");
    valido = false;
  } else {
    email.classList.add("is-valid");
  }

  // Si todo está OK, muestra mensaje de confirmación
  if (valido) {
    form.style.display = "none";
    mensajeConfirmacion.style.display = "block";
  }
}

