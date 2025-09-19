// Importa productos
import { productos } from "./data.js";

// Obtiene el parámetro id desde la URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Busca el producto en el array
let producto = productos.find(p => p.id === id);

// Selecciona el contenedor del detalle
const contenedorDetalle = document.getElementById("detalle");

// Función para renderizar el detalle
function renderDetalle() {
  if (!producto) {
    contenedorDetalle.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  contenedorDetalle.innerHTML = `
    <div class="detalle-card">
      <img src="${producto.img}" alt="${producto.nombre}" class="detalle-img">
      <h2 class="detalle-title">${producto.nombre}</h2>
      <p class="detalle-desc">${producto.descripcion}</p>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
      <button id="btnCarrito" ${producto.stock === 0 ? "disabled" : ""}>
        Agregar al carrito
      </button>
    </div>
  `;

  // Agrega el evento al botón "Agregar al carrito"
  const btnCarrito = document.getElementById("btnCarrito");
  if (btnCarrito) {
    btnCarrito.addEventListener("click", () => {
      if (producto.stock > 0) {
        producto.stock -= 1;
        renderDetalle(); // volver a renderizar para actualizar stock
      }
    });
  }
}

// 6. Inicializa
renderDetalle();
