// 1. CREAMOS el nuevo punto de entrada
document.addEventListener("DOMContentLoaded", () => {
  iniciarCatalogo();
});

// 2. CREAMOS la función async principal
async function iniciarCatalogo() {
  try {
    // 3. HACEMOS EL FETCH para obtener los productos
    const respuesta = await fetch("/assets/data/productos.json");
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const productos = await respuesta.json(); // <-- ¡Aquí están tus productos!

    // Seleccionar el contenedor principal
    const contenedorCatalogo = document.getElementById("gridProductos");
    const contenedorFiltros = document.getElementById("filtroCategoria");

    // Verificamos que los contenedores existan
    if (!contenedorCatalogo || !contenedorFiltros) {
      console.error(
        "No se pudieron encontrar los contenedores #gridProductos o #filtroCategoria."
      );
      return;
    }

    // Renderizar productos
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
          <button aria-label="Ver detalles" class="btn-detalle" data-id="${prod.id}">Ver detalles</button>
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
      // Obtener categorías únicas (usando 'productos' que vino del fetch)
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
          renderProductos(productos); // Usa 'productos' del fetch
        } else {
          const filtrados = productos.filter((p) => p.categoria === categoria);
          renderProductos(filtrados);
        }
      });
    }

    // 5. Inicialización
    function inicializarCatalogo() {
      renderFiltros(); // Llama a la función que usa 'productos'

      const categoriaGuardada = localStorage.getItem("categoria");

      if (categoriaGuardada) {
        contenedorFiltros.value = categoriaGuardada;

        if (categoriaGuardada === "Todos") {
          renderProductos(productos); // Usa 'productos' del fetch
        } else {
          // Usa 'productos' del fetch
          const filtrados = productos.filter(
            (p) => p.categoria === categoriaGuardada
          );
          renderProductos(filtrados);
        }
      } else {
        renderProductos(productos); // Usa 'productos' del fetch
      }
    }

    // 6. Inicialización de catálogo
    inicializarCatalogo();
  } catch (error) {
    // 7. Manejo de cualquier error que ocurra
    console.error("Error al cargar el catálogo:", error);
  }
}
