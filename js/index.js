// 1. IMPORTAMOS las funciones necesarias
import {
  agregarAlCarrito,
  updateBadge,
  recuperaCarritoDelLocalStorage,
} from "./carrito.js";

// 2. CREAMOS el nuevo punto de entrada
document.addEventListener("DOMContentLoaded", () => {
  iniciarIndex();
});

// 3. CREAMOS la función async principal
async function iniciarIndex() {
  try {
    // 4. HACEMOS EL FETCH para obtener los productos
    const respuesta = await fetch("./assets/data/productos.json");
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const productos = await respuesta.json();

    const productosDestacados = productos.slice(0, 3);

    const contenedorDestacados = document.getElementById("destacados");

    // Si el contenedor no existe, salimos para evitar errores
    if (!contenedorDestacados) {
      console.error("El contenedor #destacados no fue encontrado.");
      return;
    }

    // Definimos la función auxiliar
    const calcularStockDisponible = (producto) => {
      const carrito = recuperaCarritoDelLocalStorage();
      const productoEnCarrito = carrito.find((p) => p.id === producto.id);
      const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
      return producto.stock - cantidadEnCarrito;
    };

    // Definimos la función de renderizado
    function renderProductos(lista) {
      // Limpiar el contenedor antes de renderizar
      contenedorDestacados.innerHTML = "";
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
          if (stockDisponible > 0) {
            agregarAlCarrito(prod);
            updateBadge(true);
            // Re-renderizar para actualizar el stock disponible
            renderProductos(productosDestacados);
          }
        });

        contenedorDestacados.appendChild(card);
      });
    }

    // 5. Llama a la función
    renderProductos(productosDestacados);
  } catch (error) {
    // 6. Manejo de cualquier error que ocurra
    console.error("Error al cargar la página de inicio:", error);
  }
}
