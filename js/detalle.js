// 1. Tus imports de 'carrito.js' se mantienen igual.
import {
  guardarEnCarritoLocalStorage,
  updateBadge,
  recuperaCarritoDelLocalStorage,
} from "./carrito.js";

// --- (Aquí estaba el 'import { productos }...' que borramos) ---
// --- (Y la lógica que dependía de 'productos' se mueve abajo) ---

// 2. CREAMOS el nuevo punto de entrada
document.addEventListener("DOMContentLoaded", () => {
  iniciarDetalle();
});

// 3. CREAMOS la función async principal
async function iniciarDetalle() {
  try {
    // 4. HACEMOS EL FETCH para obtener los productos
    const respuesta = await fetch("/assets/data/productos.json");
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const productos = await respuesta.json(); // <-- ¡Aquí están tus productos!

    // ================================================================
    // ▼ INICIO DE TU LÓGICA ORIGINAL (MOVIDA AQUÍ DENTRO) ▼
    // ================================================================

    // Obtiene el parámetro id desde la URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    // Busca el producto en el array (ahora 'productos' existe)
    let producto = productos.find((p) => p.id === id);

    // Selecciona el contenedor del detalle
    const contenedorDetalle = document.getElementById("detalle");

    // Verificamos que el contenedor exista
    if (!contenedorDetalle) {
      console.error("No se pudo encontrar el contenedor #detalle.");
      return;
    }

    // Función para renderizar el detalle
    // (La definimos aquí para que tenga acceso a 'producto')
    function renderDetalle() {
      if (!producto) {
        contenedorDetalle.innerHTML = "<p>Producto no encontrado.</p>";
        return;
      }

      // Función para calcular el stock disponible
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
          <button aria-label="Agregar al carrito ${
            stockDisponible < 1 ? " (Stock agotado)" : ""
          }" id="btnCarrito" class="btn-agregar" ${
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
            // Guardar en el carrito
            guardarEnCarritoLocalStorage(producto);

            // Actualizar badge del carrito
            const carrito = recuperaCarritoDelLocalStorage();
            updateBadge(carrito.length);

            // Volver a renderizar para actualizar stock
            // 'renderDetalle' se vuelve a llamar a sí misma
            renderDetalle();
          }
        });
      }
    }

    // 6. Inicializa (Esta es la llamada a TU función)
    renderDetalle();

    // ================================================================
    // ▲ FIN DE TU LÓGICA ORIGINAL ▲
    // ================================================================
  } catch (error) {
    // 7. Manejo de cualquier error que ocurra
    console.error("Error al cargar el detalle del producto:", error);
  }
}
