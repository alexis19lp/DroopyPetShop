// Importa los productos
import { productos } from "./data.js";

// Selecciona los 3 productos 
const productosDestacados = productos.slice(0, 3);

// Selecciona el contenedor donde se van a renderizar
const contenedorDestacados = document.getElementById("destacados");

// Función para renderizar productos
function renderProductos(lista) {
  lista.forEach(prod => {
    // Crea la tarjeta
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}" class="card-img">
      <h3 class="card-title">${prod.nombre}</h3>
      <p class="card-desc">${prod.descripcion}</p>
      <p class="card-price">$${prod.precio}</p>
      <button class="btn-agregar">Agregar al carrito</button>
    `;

    // Agrega al contenedor
    contenedorDestacados.appendChild(card);
  });
}

// 5. Llama a la función
renderProductos(productosDestacados);
