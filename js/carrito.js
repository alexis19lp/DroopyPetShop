/*
================================================================
FUNCIONES DE DATOS (LOGICA DEL CARRITO)
================================================================
*/

export function agregarAlCarrito(producto) {
  const carrito = recuperaCarritoDelLocalStorage() || [];

  // Buscamos si el producto ya existe en el carrito
  const productoExistente = carrito.find((item) => item.id === producto.id);

  if (productoExistente) {
    // Si existe, solo incrementamos la cantidad
    productoExistente.cantidad++;
  } else {
    // Si no existe, lo agregamos con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Guardamos el carrito actualizado
  guardarCarritoEnLocalStorage(carrito);
  console.log("Producto agregado/actualizado en Carrito:", carrito);

  // Actualizamos el badge
  updateBadge();
}

/**
 * Función para guardar el array COMPLETO en localStorage
 */
function guardarCarritoEnLocalStorage(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Cada vez que guardamos, actualizamos el badge
  updateBadge();
}

/**
 * Función para recuperar carrito del localStorage.
 * Es exportada porque la usamos en agregarAlCarrito.
 */
export function recuperaCarritoDelLocalStorage() {
  const carrito = localStorage.getItem("carrito");
  return carrito ? JSON.parse(carrito) : [];
}

/*
================================================================
FUNCIONES DE RENDERIZADO (PINTAR EN EL HTML)
================================================================
*/

// Selecciona contenedores (sin cambios)
const contenedorCarrito = document.getElementById("carritoProductos");
const contenedorResumen = document.getElementById("resumenCarrito");

/**
 * Renderiza el listado del carrito del localStorage
 */
function renderCarrito() {
  const carrito = recuperaCarritoDelLocalStorage();

  if (!contenedorCarrito) return;

  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML =
      "<p class='mensaje-carrito-vacio'>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach((producto) => {
    contenedorCarrito.innerHTML += `
      <div class="filaCarrito">
        
        <div class="productoCarrito">
          <img src="${producto.img}" alt="${producto.nombre}" width="50">
          <div class="infoProducto">
            <span class="nombreProducto">${producto.nombre}</span>
            <span class="idProducto">ID: ${producto.id}</span>
          </div>
        </div>
        
        <div class="precioCarrito">
          <span>$${producto.precio}</span>
        </div>
        
        <div class="cantidadCarrito">
          <input 
            type="number" 
            class="form-control form-control-sm input-cantidad" 
            value="${producto.cantidad}" 
            min="1" 
            data-id="${producto.id}"
            style="width: 70px;"
          >
        </div>
        
        <div class="subtotalCarrito">
          <span>$${producto.precio * producto.cantidad}</span>
        </div>

        <div class="eliminarCarrito">
          <button 
            class="btn btn-danger btn-sm btn-eliminar" 
            data-id="${producto.id}"
            aria-label="Eliminar producto"
          >
            &times; </button>
        </div>

      </div>
    `;
  });
}

/**
 * Muestra un resumen del carrito.
 * Añade botón "Vaciar"
 */
function renderResumen() {
  const carrito = recuperaCarritoDelLocalStorage();

  if (!contenedorResumen) return;

  // ¡IMPORTANTE! Limpiamos el contenedor
  contenedorResumen.innerHTML = "";

  let totalProductos = 0;
  let totalPrecio = 0;

  if (carrito.length > 0) {
    // Calculamos los totales basados en la nueva estructura
    totalProductos = carrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    );
    totalPrecio = carrito.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
  }

  contenedorResumen.innerHTML = `
    <h2>Resumen</h2>
    <p>Total de productos: ${totalProductos}</p>
    <p>Total de precio: $${totalPrecio.toFixed(2)}</p>
    <button aria-label="Seguir comprando" class="btn-agregar" id="btn-seguir-comprando">
      Seguir comprando
    </button>
    ${
      carrito.length > 0
        ? `<button aria-label="Vaciar carrito" class="btn-danger" id="btn-vaciar-carrito">
      Vaciar Carrito
    </button>`
        : ""
    }
  `;

  // Asignamos los listeners a los botones que acabamos de crear
  document
    .getElementById("btn-seguir-comprando")
    .addEventListener("click", () => {
      window.location.href = "../pages/productos.html";
    });

  // Listener para el nuevo botón (solo si existe)
  const btnVaciar = document.getElementById("btn-vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", manejarVaciarCarrito);
  }
}

/*
===================================================
BADGE DEL ICONO DEL CARRITO
===================================================
*/

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

/**
 * Actualiza el número en el ícono del carrito.
 * Es exportada porque se usa en agregarAlCarrito.
 */
export function updateBadge(animate = true) {
  ensureCartButton(); // Aseguramos que el botón exista
  const badge = document.getElementById("carritoCount");
  if (!badge) return;

  const carrito = recuperaCarritoDelLocalStorage();

  // Nueva lógica: sumamos las cantidades de cada producto
  const totalProductos = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );

  badge.textContent = totalProductos;

  if (animate) {
    badge.classList.remove("bump");
    badge.offsetWidth; // Truco para forzar "reflow" y reiniciar la animación
    badge.classList.add("bump");
  }
}

/*
================================================================
MANEJADORES DE EVENTOS
================================================================
*/

/**
 * Maneja el cambio de cantidad desde el input.
 */
function manejarCambioCantidad(event) {
  // Verificamos que el evento venga de nuestro input
  if (!event.target.classList.contains("input-cantidad")) {
    return;
  }

  const productoId = event.target.dataset.id;
  const nuevaCantidad = parseInt(event.target.value);

  if (nuevaCantidad < 1) {
    event.target.value = 1; // Reseteamos a 1 si es inválido
    return;
  }

  const carrito = recuperaCarritoDelLocalStorage();

  // Buscamos el producto y actualizamos su cantidad
  const carritoActualizado = carrito.map((producto) => {
    if (producto.id == productoId) {
      producto.cantidad = nuevaCantidad;
    }
    return producto;
  });

  // Guardamos, y volvemos a renderizar TODO
  guardarCarritoEnLocalStorage(carritoActualizado);
  renderCarrito();
  renderResumen();
}

/**
 * Maneja el clic en el botón de eliminar producto.
 */
function manejarEliminarProducto(event) {
  // Buscamos el botón más cercano que tenga la clase
  const botonEliminar = event.target.closest(".btn-eliminar");

  if (!botonEliminar) {
    return;
  }

  const productoId = botonEliminar.dataset.id;

  // Confirmación
  if (!confirm("¿Quitar este producto del carrito?")) {
    return;
  }

  const carrito = recuperaCarritoDelLocalStorage();

  // Filtramos el array, quitando el producto
  const carritoActualizado = carrito.filter(
    (producto) => producto.id != productoId
  );

  // Guardamos y volvemos a renderizar TODO
  guardarCarritoEnLocalStorage(carritoActualizado);
  renderCarrito();
  renderResumen();
}

/**
 * Maneja el clic en el botón de vaciar carrito.
 */
function manejarVaciarCarrito() {
  if (!confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
    return;
  }

  // Guardamos un array vacío
  guardarCarritoEnLocalStorage([]);

  // Volvemos a renderizar TODO
  renderCarrito();
  renderResumen();
}

/*
================================================================
INICIALIZACIÓN
================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  ensureCartButton();

  // Solo renderizamos si estamos en la página del carrito
  if (contenedorCarrito || contenedorResumen) {
    renderCarrito();
    renderResumen();
  }

  // Usamos delegación de eventos en el contenedor del carrito
  // para los botones de editar y eliminar, ya que se crean dinámicamente.
  if (contenedorCarrito) {
    contenedorCarrito.addEventListener("change", manejarCambioCantidad);
    contenedorCarrito.addEventListener("click", manejarEliminarProducto);
  }

  // El botón de vaciar se crea en renderResumen

  // Actualizamos el badge al cargar la página
  updateBadge(false); // false = no animar al cargar
});
