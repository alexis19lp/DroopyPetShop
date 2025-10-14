// Importa productos y funciones del carrito
import { productos } from "./data.js";
import {
  guardarEnCarritoLocalStorage,
  updateBadge,
  recuperaCarritoDelLocalStorage,
} from "./carrito.js";

// Obtiene el parámetro id desde la URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Busca el producto en el array
let producto = productos.find((p) => p.id === id);

// Selecciona el contenedor del detalle
const contenedorDetalle = document.getElementById("detalle");

// Función para renderizar el detalle
function renderDetalle() {
  if (!producto) {
    contenedorDetalle.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  // Función para calcular el stock disponible restando los elementos del carrito
  const calcularStockDisponible = (producto) => {
    const carrito = recuperaCarritoDelLocalStorage();
    const cantidadEnCarrito = carrito.filter(
      (p) => p.id === producto.id
    ).length;
    return producto.stock - cantidadEnCarrito;
  };

  // Calcular stock disponible
  const stockDisponible = calcularStockDisponible(producto);

  contenedorDetalle.innerHTML = `
    <div class="card">
      <img src="${producto.img}" alt="${producto.nombre}" class="card-img">
      <h2 class="detalle-title">${producto.nombre}</h2>
      <p class="detalle-desc">${producto.descripcion}</p>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p><strong>Stock disponible:</strong> ${stockDisponible}</p>
      <button aria-label="Agregar al carrito ${stockDisponible < 1 ? " (Stock agotado)" : ""}" id="btnCarrito" class="btn-agregar" ${
        stockDisponible < 1 ? "disabled" : ""
      }>
        Agregar al carrito ${stockDisponible < 1 ? " (Stock agotado)" : ""}
      </button>
    </div>
  `;

  // Agrega el evento al botón "Agregar al carrito"
  const btnCarrito = document.getElementById("btnCarrito");
  if (btnCarrito) {
    btnCarrito.addEventListener("click", () => {
      if (stockDisponible > 0) {
        // Crear objeto para el carrito con cantidad 1

        // Guardar en el carrito
        guardarEnCarritoLocalStorage(producto);

        // Actualizar badge del carrito
        const carrito = recuperaCarritoDelLocalStorage();
        updateBadge(carrito.length);

        // Volver a renderizar para actualizar stock
        renderDetalle();
      }
    });
  }
}

// 6. Inicializa
renderDetalle();
