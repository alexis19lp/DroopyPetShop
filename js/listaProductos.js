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

    // 8. ¡ÉXITO! 'productos' es tu array.
    // Ahora podemos llamar a las funciones que dependen de esta data.
    console.log("Productos cargados:", productos);

    // 👇 AQUÍ LLAMAS A TUS OTRAS FUNCIONES 👇
    mostrarProductosEnLaPagina(productos);
    inicializarLogicaDelCarrito(productos);
    // ...etcétera...
  } catch (error) {
    // 9. Si algo en el 'try' falla (el fetch, la conversión a JSON, o el 'throw'),
    // se ejecutará este 'catch' y nos mostrará el error en la consola.
    console.error("No se pudieron cargar los productos:", error);
  }
}

// --- TUS OTRAS FUNCIONES ---
// (Estas funciones deben estar en este mismo archivo o importadas
// si estás usando módulos para todo)

/**
 * Función que toma el array de productos y los muestra en el HTML.
 */
function mostrarProductosEnLaPagina(productos) {
  console.log("Mostrando productos...");
  const contenedor = document.getElementById("gridProductos"); // Asegúrate de tener este ID en tu HTML

  // Limpiamos el contenedor por si acaso
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    // Aquí va tu lógica para crear la tarjeta de cada producto
    const divProducto = document.createElement("div");
    divProducto.classList.add("tarjeta-producto"); // Agrégale tus clases CSS
    divProducto.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button>Agregar al carrito</button>
    `;
    contenedor.appendChild(divProducto);
  });
}

/**
 * Función que inicializa toda la lógica del carrito.
 */
function inicializarLogicaDelCarrito(productos) {
  console.log("Inicializando carrito...");
  // ...toda tu lógica del carrito...
  // Por ejemplo, aquí pondrías los 'addEventListener' a los botones "Agregar al carrito"
  // que ahora ya existen gracias a mostrarProductosEnLaPagina().
}
