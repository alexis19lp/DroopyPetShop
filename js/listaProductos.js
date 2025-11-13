import { agregarAlCarrito } from "./carrito.js"; // (Verifica que la ruta sea correcta)

// 1. Esperamos a que el HTML (DOM) se cargue completamente
document.addEventListener("DOMContentLoaded", () => {
  // 2. Una vez cargado, llamamos a nuestra función principal
  iniciarApp();
});

// 3. Esta es nuestra función principal
async function iniciarApp() {
  // 4. Vamos a 'intentar' (try) hacer la llamada al JSON
  try {
    // 5. 'await' pausa la ejecución hasta que 'fetch' termine
    const respuesta = await fetch("assets/data/productos.json");

    // 6. Verificamos si la respuesta fue exitosa (ej. no fue un error 404)
    if (!respuesta.ok) {
      throw new Error(
        `Error al cargar el JSON: ${respuesta.status} ${respuesta.statusText}`
      );
    }

    // 7. 'await' pausa de nuevo hasta que los datos se conviertan de JSON
    const productos = await respuesta.json();

    // 8. 'productos' es nuestro array.
    // Ahora podemos llamar a las funciones que dependen de esta data.
    console.log("Productos cargados:", productos);

    mostrarProductosEnLaPagina(productos);
    inicializarLogicaDelCarrito(productos);
  } catch (error) {
    // 9. Si algo en el 'try' falla (el fetch, la conversión a JSON, o el 'throw'),
    // se ejecutará este 'catch' y nos mostrará el error en la consola.
    console.error("No se pudieron cargar los productos:", error);
  }
}

/**
 * Función que toma el array de productos y los muestra en el HTML.
 */
function mostrarProductosEnLaPagina(productos) {
  console.log("Mostrando productos...");
  const contenedor = document.getElementById("gridProductos");

  // Limpiamos el contenedor por si acaso
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    // La lógica para crear la tarjeta de cada producto
    const divProducto = document.createElement("div");
    divProducto.classList.add("tarjeta-producto");
    divProducto.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button class="btn-agregar-producto" data-id="${producto.id}">
        Agregar al carrito
      </button>
    `;
    contenedor.appendChild(divProducto);
  });
}

/**
 * Función que inicializa toda la lógica del carrito.
 */
function inicializarLogicaDelCarrito(productos) {
  console.log("Inicializando carrito...");

  // 1. Seleccionamos TODOS los botones que creamos
  const botonesAgregar = document.querySelectorAll(".btn-agregar-producto");

  // 2. Recorremos cada botón
  botonesAgregar.forEach((boton) => {
    // 3. A cada botón, le añadimos un listener para el 'click'
    boton.addEventListener("click", () => {
      // 4. Cuando se hace clic, leemos el ID del 'data-id'
      const idDelProducto = boton.dataset.id;

      // 5. Buscamos el producto COMPLETO en nuestro array original
      //    usando el ID que obtuvimos.
      const productoParaAgregar = productos.find((p) => p.id == idDelProducto);

      // 6. Si lo encontramos...
      if (productoParaAgregar) {
        // 7. ¡Llamamos a la función importada!
        agregarAlCarrito(productoParaAgregar);

        console.log(`'${productoParaAgregar.nombre}' agregado al carrito.`);
      } else {
        console.error("No se encontró el producto con ID:", idDelProducto);
      }
    });
  });
}
