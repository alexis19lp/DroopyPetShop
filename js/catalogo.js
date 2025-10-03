// 1. Importar productos
import { productos } from "../js/data.js";

// 2. Seleccionar el contenedor principal
const contenedorCatalogo = document.getElementById("gridProductos");
const contenedorFiltros = document.getElementById("filtroCategoria");

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
      const id = e.target.getAttribute("data-id");
      window.location.href = `./detalle.html?id=${id}`;
    });
  });
}

// 4. Renderizar filtros dinámicos según las categorías
function renderFiltros() {
  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  // Limpiar el select
  contenedorFiltros.innerHTML = "";

  // Agregar opción "Todos"
  const opcionTodos = document.createElement("option");
  opcionTodos.value = "Todos";
  opcionTodos.textContent = "Todos";
  contenedorFiltros.appendChild(opcionTodos);

  // Agregar opciones para cada categoría
  categorias.forEach((cat) => {
    const opcion = document.createElement("option");
    opcion.value = cat;
    opcion.textContent = cat;
    contenedorFiltros.appendChild(opcion);
  });

  // Evento de filtrado
  contenedorFiltros.addEventListener("change", (e) => {
    const categoria = e.target.value;
    localStorage.setItem("categoria", categoria);
    if (categoria === "Todos") {
      renderProductos(productos);
    } else {
      const filtrados = productos.filter((p) => p.categoria === categoria);
      renderProductos(filtrados);
    }
  });
}

// 5. Inicialización
function inicializarCatalogo() {
  renderFiltros();

  const categoriaGuardada = localStorage.getItem("categoria");

  if (categoriaGuardada) {
    contenedorFiltros.value = categoriaGuardada;

    if (categoriaGuardada === "Todos") {
      renderProductos(productos);
    } else {
      const filtrados = productos.filter(
        (p) => p.categoria === categoriaGuardada
      );
      renderProductos(filtrados);
    }
  } else {
    renderProductos(productos);
  }
}

// 6. Inicialización
inicializarCatalogo();
