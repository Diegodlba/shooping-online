# Shopping Online

Proyecto de curso: un sitio de compras online hecho con HTML, CSS y JavaScript. Muestra productos por categorías, ofertas y el detalle de cada producto, y tiene un carrito de compras.

Los productos y las categorías vienen de la API pública [Fake Store API](https://fakestoreapi.com/). Si ese servicio no responde, el sitio se ve sin productos.

## Qué incluye

- **Inicio:** productos destacados.
- **Categorías y ofertas:** listado de productos por categoría y sección de ofertas.
- **Detalle de producto:** foto, descripción y precio.
- **Carrito:** agregar productos, cambiar cantidades y quitarlos. Se guarda en el navegador (`localStorage`).
- **Registro, inicio de sesión y venta de productos:** hechos en el proyecto original (ver limitaciones).

## Limitaciones conocidas

Este proyecto usaba la API de un curso para los usuarios (`todo-api.ctd.academy`), que **ya no está en línea**. Por eso:

- **El registro y el inicio de sesión no funcionan.** El formulario valida los datos, pero la conexión con el servidor falla.
- **No aparece el nombre del usuario ni la opción de cerrar sesión**, ya que dependen de iniciar sesión.
- **La sección "Vender" no se puede usar**, porque exige haber iniciado sesión. Además, la Fake Store API no guarda los productos que se envían.

El resto del sitio (productos, categorías, ofertas, detalle y carrito) funciona sin iniciar sesión.

## Tecnologías

HTML · CSS · JavaScript · Fetch API · localStorage · Font Awesome

## Cómo ejecutarlo

No necesita instalación. Abrí la carpeta en VS Code y, con la extensión **Live Server**, iniciá `principal.html`.

## Autor

Diego de la Barrera
