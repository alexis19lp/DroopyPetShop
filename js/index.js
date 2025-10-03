// Importa los productos
import { productos } from "./data.js";
import {
  guardarEnCarritoLocalStorage,
  updateBadge,
  recuperaCarritoDelLocalStorage,
} from "./carrito.js";

const productosDestacados = productos.slice(0, 3);

// Selecciona el contenedor donde se van a renderizar
const contenedorDestacados = document.getElementById("destacados");

function renderProductos(lista) {
  lista.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        
      <img src="${prod.img}" alt="${prod.nombre}" class="card-img">
      <h3 class="card-title">${prod.nombre}</h3>
      <p class="card-desc">${prod.descripcion}</p>
      <p class="card-price">$${prod.precio}</p>
      <button class="btn-agregar">Agregar al carrito</button>
    `;

    // boton para agregar al carrito
    const btnAgregar = card.querySelector(".btn-agregar");
    btnAgregar.addEventListener("click", () => {
      guardarEnCarritoLocalStorage(prod);
      updateBadge(recuperaCarritoDelLocalStorage().length, true);
    });

    contenedorDestacados.appendChild(card);
  });
}

// 5. Llama a la función
renderProductos(productosDestacados);
