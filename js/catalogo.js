// 1. Importar productos
import { productos } from "../js/data.js";

// 2. Seleccionar el contenedor principal
const contenedorCatalogo = document.getElementById("catalogo");
const contenedorFiltros = document.getElementById("filtros");

// 3. Renderizar productos
function renderProductos(lista) {
  contenedorCatalogo.innerHTML = " ";
  lista.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}" class="card-img">
      <h3 class="card-title">${prod.nombre}</h3>
      <p class="card-desc">${prod.descripcion}</p>
      <p class="card-price">$${prod.precio}</p>
      <button class="btn-detalle" data-id="${prod.id}">Ver detalles</button>
    `;

    contenedorCatalogo.appendChild(card);
  });

  // Agregar eventos a los botones "Ver detalles"
  document.querySelectorAll(".btn-detalle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("id");
      window.location.href = "../producto.html?id=XYZ";
    });
  });
}

// 4. Renderizar filtros dinámicos según las categorías
function renderFiltros() {
  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  // Agregar botón "Todos"
  contenedorFiltros.innerHTML = `<button class="btn-filtro" data-cat="Todos">Todos</button>`;

  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.classList.add("btn-filtro");
    btn.textContent = cat;
    btn.setAttribute("data-cat", cat);
    contenedorFiltros.appendChild(btn);
  });

  // Eventos de filtrado
  document.querySelectorAll(".btn-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      const categoria = btn.getAttribute("data-cat");
      if (categoria === "Todos") {
        renderProductos(productos);
      } else {
        const filtrados = productos.filter((p) => p.categoria === categoria);
        renderProductos(filtrados);
      }
    });
  });
}

// 5. Inicialización
renderProductos(productos);
renderFiltros();
