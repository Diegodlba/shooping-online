window.addEventListener("load", function () {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  // if (this.localStorage.jwt == null) {
  //   alert("Por favor loguearse para continuar con la compra");
  //   location.assign("/login.html");
  // }

  const obtenerNombreUsuario = () => {
    const urlUsuario = "https://todo-api.ctd.academy/v1/users/getMe";
    if (localStorage.jwt != null) {
      const token = JSON.parse(localStorage.jwt);
      const settings = {
        method: "GET",
        headers: {
          authorization: token,
        },
      };
      fetch(urlUsuario, settings)
        .then((response) => response.json())
        .then((data) => {
          document.querySelector(
            ".nombreUsuario"
          ).innerHTML = `  <a href="/carrito.html"><i class="fa-solid fa-cart-shopping"></i></a>
            <a href="#"class="cerrar-sesion"><p><i class="fa-solid fa-user"></i> ${data.firstName} ${data.lastName}</p></a>
            `;

          document
            .querySelector(".cerrar-sesion")
            .addEventListener("click", () => cerrarSesion());
        })
        .catch((error) => console.log(error));
    }
  };

  const flechaNav = document.querySelector("nav i");
  flechaNav.addEventListener("click", () => {
    const nav = document.querySelector("nav ul");
    nav.classList.toggle("visible-nav");
    flechaNav.classList.toggle("rotated");
  });

  const renderizarProductosCarrito = () => {
    const productosCarrito = document.querySelector("main");
    let sumaTotal = 0;

    if (localStorage.getItem("carrito") == null) {
      productosCarrito.innerHTML = `<div class="carrito-vacio">
      <h1> El carrito está vacío </h1>
      <a href="/categoria.html"><i class="fa-sharp fa-solid fa-cart-plus"></i></a>
      </div>`;
    }

    const promesasProductos = carrito.map((productoCarrito) => {
      const urlProductos = `https://fakestoreapi.com/products/${productoCarrito.id}`;
      const settings = {
        method: "GET",
      };
      return fetch(urlProductos, settings)
        .then((res) => res.json())
        .then((producto) => {
          const precioConDescuento = Math.trunc(producto.price * 0.7);
          const valorTotal = precioConDescuento * productoCarrito.cantidad;
          sumaTotal += valorTotal;
          return `
          <article class="container">
            <div class="descripcion">
              <img src="${producto.image}" alt"imagenProducto"/>
              <h3>Caracteristicas: </h3>
              <p>${producto.description}</p>
            </div>
            <div class="titulo-precio">
              <h3>x${productoCarrito.cantidad} ${producto.title}</h3>
              <h4>Precio</h4>
              <p style="text-decoration: line-through"> Antes U$S${Math.trunc(
                producto.price
              )}</p>
              <p style="color: red">Ahora: U$S${precioConDescuento}</p>
              <div class="modificar-cantidad">
              <a class="restar-producto"><i class="fa-solid fa-square-minus"></i></a>
              <p>${productoCarrito.cantidad}</p>
              <i class="fa-solid fa-square-plus sumar-producto"></i>
              </div>
            </div>
            <div class="total-acciones">
              <p>Valor total: U$S ${valorTotal}</p>
              <a class="eliminar-producto"><i class="fa-sharp fa-solid fa-trash"></i></a>
            </div>
          </article>
          `;
        });
    });

    Promise.all(promesasProductos).then((productosHTML) => {
      if (carrito.length == 0) {
        productosCarrito.innerHTML = `
        <div class="carrito-vacio">
        <h1> El carrito está vacío </h1>
        <a href="/categoria.html"><i class="fa-sharp fa-solid fa-cart-plus"></i></a>
        </div>`;
      } else {
        productosCarrito.innerHTML =
          productosHTML.join("") +
          `
        <div class="suma-total">
        <p>Total: U$S ${sumaTotal}</p>
        <button>Finalizar</button>
        </div>
      `;
        actualizarCantidades();
      }
      eliminarProducto();
    });
  };

  const actualizarCantidades = () => {
    const botonesRestar = document.querySelectorAll(".restar-producto");
    const botonesSumar = document.querySelectorAll(".sumar-producto");

    for (let i = 0; i < botonesRestar.length; i++) {
      botonesRestar[i].addEventListener("click", () => {
        carrito[i].cantidad = Math.max(1, carrito[i].cantidad - 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarProductosCarrito();
      });
    }

    for (let i = 0; i < botonesSumar.length; i++) {
      botonesSumar[i].addEventListener("click", () => {
        carrito[i].cantidad += 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarProductosCarrito();
      });
    }
  };

  const eliminarProducto = () => {
    const eliminar = document.querySelectorAll(".eliminar-producto");
    eliminar.forEach((boton, index) => {
      boton.addEventListener("click", () => {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        Swal.fire({
          title: 'Producto eliminado con exito',
          showConfirmButton: false,
          showCancelButton: false,
          position: 'bottom',
          timer: 1000,
          timerProgressBar: true
        });
        renderizarProductosCarrito();
      });
    });
  };

  const cerrarSesion = () => {
    Swal.fire({
      title: "Seguro que desea cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008f39	",
      cancelButtonColor: "#d63030",
      cancelButtonText: "Cancelar!",
      confirmButtonText: "Si, cerrar sesión!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("jwt");
        location.assign("/principal.html");
        localStorage.removeItem("carrito");
      }
    });
  };

  renderizarProductosCarrito();
  obtenerNombreUsuario();
});
