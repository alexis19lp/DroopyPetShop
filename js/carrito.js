// funcion para guardar el elemento en el localStorage
// TODO: la clave va a ser siempre "carrito" y el valor es el listado de productos
export function guardarEnCarritoLocalStorage(valor) {
  const carrito = recuperaCarritoDelLocalStorage() || [];
  carrito.push(valor);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  console.log("Guardado en Carrito Local Storage:", valor);
}

// funcion para recuperar carrito del localStorage
export function recuperaCarritoDelLocalStorage() {
  const carrito = localStorage.getItem("carrito");
  return carrito ? JSON.parse(carrito) : [];
}

// Selecciona contenedor donde se va a mostar el listado del carrito.
const contenedorCarrito = document.getElementById("resumenCarrito");

// Renderiza el listado del carrito del localStorage
// Todo: recuperar el listado del localStorage debe ser el key "carrito"
function renderCarrito() {
  const carrito = recuperaCarritoDelLocalStorage();
  if (!contenedorCarrito) return;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }
  carrito.forEach((producto) => {
    contenedorCarrito.innerHTML += `
      <div class="productoCarrito">
      <img src="${producto.img}" alt="Imagen producto" width="50">
      <span>${producto.nombre} - $${producto.precio}</span>
      </div>
      <div class="cantidadCarrito">
        <span>${producto.cantidad}</span>
      </div>
      <div class="subtotalCarrito">
        <span>${producto.precio * producto.cantidad}</span>
      </div>
      <div class="eliminarCarrito">
        <span>Eliminar</span>
      </div>
    `;
  });
}

function ensureCartButton() {
  const nav = document.getElementById("cart");
  if (!nav) return;

  let link = nav.querySelector(".cart-link");
  if (!link) {
    link = document.createElement("a");
    link.href = "../pages/carrito.html";
    link.className = "cart-link";
    link.setAttribute("aria-label", "Carrito");
    link.innerHTML = `
   
      <span class="cart-ico" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 10 19h9v-2h-9l1.1-2h6.45a2 2 0 0 0 1.8-1.1l3.58-7.16A1 1 0 0 0 22 4h-2l-3.6 7H10.25L7 4Z"/>
          <circle cx="10" cy="21" r="1.7"/>
          <circle cx="18" cy="21" r="1.7"/>
        </svg>
      </span>
      <span id="carritoCount" class="cart-badge">0</span>
    `;
    nav.appendChild(link);
  }
}

function updateBadge(n, animate = true) {
  // Buscamos el elemento con id="carritoCount" (el numerito rojo)
  const badge = document.getElementById("carritoCount");

  // Si no existe, salimos de la función para evitar errores
  if (!badge) return;

  // Actualizamos el número que se muestra dentro del badge
  badge.textContent = n;

  // Si queremos animar (por defecto es true)...
  if (animate) {
    // 1) Quitamos la clase "bump" para “resetear” la animación
    badge.classList.remove("bump");

    // 2) Leemos badge.offsetWidth
    // El .offsetWidth es un truco para que el navegador se olvide de la animación pasada
    // y la vuelva a correr cada vez que cambia el número.
    badge.offsetWidth;

    // 3) Volvemos a agregar la clase "bump"
    //    Ahora el navegador cree que es la primera vez
    //    y ejecuta la animación de nuevo
    badge.classList.add("bump");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureCartButton();
  renderCarrito();

  let contador = 0;
  const btn = document.getElementById("btnSumar");
  btn.addEventListener("click", () => {
    contador++;
    updateBadge(contador, true);
  });
});
