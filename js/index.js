// 1. Tus imports de 'carrito.js' se mantienen igual.
// Siguen siendo necesarios para la lógica del carrito.
import {
  guardarEnCarritoLocalStorage,
  updateBadge,
  recuperaCarritoDelLocalStorage,
} from "./carrito.js";

// --- (Aquí estaba el 'import { productos }...' que borramos) ---

// 2. CREAMOS el nuevo punto de entrada
document.addEventListener("DOMContentLoaded", () => {
  iniciarIndex();
});

// 3. CREAMOS la función async principal
async function iniciarIndex() {
  try {
    // 4. HACEMOS EL FETCH para obtener los productos
    const respuesta = await fetch("assets/data/productos.json");
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const productos = await respuesta.json(); // <-- ¡Aquí están tus productos!

    // ================================================================
    // ▼ INICIO DE TU LÓGICA ORIGINAL (MOVIDA AQUÍ DENTRO) ▼
    // ================================================================

    // Ahora que 'productos' existe, podemos ejecutar esta línea
    const productosDestacados = productos.slice(0, 3);

    // Selecciona el contenedor (es mejor hacerlo aquí)
    const contenedorDestacados = document.getElementById("destacados");

    // Si el contenedor no existe, salimos para evitar errores
    if (!contenedorDestacados) {
      console.error("El contenedor #destacados no fue encontrado.");
      return;
    }

    // Definimos tu función auxiliar (ahora dentro de iniciarIndex)
    const calcularStockDisponible = (producto) => {
      const carrito = recuperaCarritoDelLocalStorage();
      const cantidadEnCarrito = carrito.filter(
        (p) => p.id === producto.id
      ).length;
      return producto.stock - cantidadEnCarrito;
    };

    // Definimos tu función de renderizado (ahora dentro de iniciarIndex)
    function renderProductos(lista) {
      lista.forEach((prod) => {
        // Calcular stock disponible
        const stockDisponible = calcularStockDisponible(prod);

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="${prod.img}" alt="${prod.nombre}" class="card-img">
          <h3 class="card-title">${prod.nombre}</h3>
          <p class="card-desc">${prod.descripcion}</p>
          <p class="card-price">$${prod.precio}</p>
          <button aria-label="Agregar al carrito ${
            stockDisponible < 1 ? " (Stock agotado)" : ""
          }" class="btn-agregar" ${
          stockDisponible < 1 ? "disabled" : ""
        }>Agregar al carrito ${
          stockDisponible < 1 ? " (Stock agotado)" : ""
        }</button>
        `;

        // boton para agregar al carrito
        const btnAgregar = card.querySelector(".btn-agregar");
        btnAgregar.addEventListener("click", () => {
          guardarEnCarritoLocalStorage(prod);
          updateBadge(recuperaCarritoDelLocalStorage().length, true);
        });

        // Ahora 'contenedorDestacados' existe y se puede usar
        contenedorDestacados.appendChild(card);
      });
    }

    // 5. Llama a la función (esto estaba al final de tu archivo)
    renderProductos(productosDestacados);

    // ================================================================
    // ▲ FIN DE TU LÓGICA ORIGINAL ▲
    // ================================================================
  } catch (error) {
    // 6. Manejo de cualquier error que ocurra
    console.error("Error al cargar la página de inicio:", error);
  }
}
