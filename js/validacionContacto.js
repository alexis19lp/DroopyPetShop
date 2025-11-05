const form = document.querySelector("form");

form.addEventListener("submit", validarFormulario);

function validarFormulario(event) {
  event.preventDefault();

  // Obtiene los campos
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");

  // Limpia clases previas
  [nombre, email, mensaje].forEach((input) => {
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

  // Valida el email
  if (!email.value.includes("@") || !email.value.includes(".")) {
    email.classList.add("is-invalid");
    valido = false;
  } else {
    email.classList.add("is-valid");
  }

  // Valida el mensaje
  if (mensaje.value.trim().length < 10) {
    mensaje.classList.add("is-invalid");
    valido = false;
  } else {
    mensaje.classList.add("is-valid");
  }

  // Si todo está OK, muestra mensaje de éxito
  if (valido) {
    alert("¡Formulario enviado con éxito!");
    form.reset();
    [nombre, email, mensaje].forEach((input) =>
      input.classList.remove("is-valid")
    );
  }
}
