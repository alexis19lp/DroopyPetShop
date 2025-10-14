// funcion para guardar el elemento en el localStorage
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
const contenedorCarrito = document.getElementById("carritoProductos");

// Renderiza el listado del carrito del localStorage
function renderCarrito() {
  const carrito = recuperaCarritoDelLocalStorage();
  if (!contenedorCarrito) return;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  // Agrupar productos por ID y calcular cantidades usando Map
  const productosAgrupados = new Map();
  carrito.forEach((producto) => {
    if (productosAgrupados.has(producto.id)) {
      productosAgrupados.get(producto.id).cantidad++;
    } else {
      productosAgrupados.set(producto.id, {
        ...producto,
        cantidad: 1,
      });
    }
  });

  // Renderizar productos agrupados
  productosAgrupados.forEach((producto) => {
    contenedorCarrito.innerHTML += `
      <div class="filaCarrito">
        <div class="productoCarrito">
          <img src="${producto.img}" alt=${producto.nombre} width="50">
          <div class="infoProducto">
            <span class="nombreProducto">${producto.nombre}</span>
            <span class="idProducto">ID: ${producto.id}</span>
          </div>
        </div>
        <div class="precioCarrito">
          <span>$${producto.precio}</span>
        </div>
        <div class="cantidadCarrito">
          <span>${producto.cantidad}</span>
        </div>
        <div class="subtotalCarrito">
          <span>$${producto.precio * producto.cantidad}</span>
        </div>
      </div>
    `;
  });
}

//// Selecciona contenedor donde se va a mostar el resumen del carrito.
const contenedorResumen = document.getElementById("resumenCarrito");

// Funcion para mostrar un resumen del carrito con un total de productos y un total de precio con un boton para seguir comprando.
function renderResumen() {
  const carrito = recuperaCarritoDelLocalStorage();
  if (!contenedorResumen) return;

  const totalProductos = carrito.length;
  const totalPrecio = carrito.reduce(
    (total, producto) => total + producto.precio,
    0
  );

  contenedorResumen.innerHTML = `
    <h2>Resumen</h2>
    <p>Total de productos: ${totalProductos}</p>
    <p>Total de precio: ${totalPrecio}</p>
    <button class="btn-agregar">Seguir comprando</button>
  `;

  const btnSeguirComprando = contenedorResumen.querySelector("button");
  btnSeguirComprando.addEventListener("click", () => {
    window.location.href = "../pages/productos.html";
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

export function updateBadge(n, animate = true) {
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
  renderResumen();
  const carrito = recuperaCarritoDelLocalStorage();

  updateBadge(carrito.length, true);
});
