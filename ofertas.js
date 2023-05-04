window.addEventListener("load", function () {
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

  const renderizarOfertas = () => {
    const listadoOfertas = document.querySelector(".articulos");
    const urlCategorias = "https://fakestoreapi.com/products";

    const settings = {
      method: "GET",
    };

    fetch(urlCategorias, settings)
      .then((res) => res.json())
      .then((ofertas) => {
        ofertas.forEach((articuloOfertas) => {
          const precioConDescuento = Math.trunc(articuloOfertas.price * 0.7);
          listadoOfertas.innerHTML += `
          <article>
          <img src="${articuloOfertas.image}" alt"imagenProducto"/>
          <a href="/producto.html" class="capturando-producto" id="${
            articuloOfertas.id
          }"><h3>${articuloOfertas.title}</h3></a>
          <h4>Precio</h4>
          <p style="text-decoration: line-through"> Antes U$S${Math.trunc(
            articuloOfertas.price
          )}</p>
          <p style="color: red">Ahora: U$S${precioConDescuento}</p>
          <div class="agregarCarrito">
          <button class="botonRest"> - </button>
          <p class=prodSumados>0</p>
          <button class="botonAdd"> + </button>
          </div>
          <button class="carritoAdd"> Agregar al carrito </button>
          </article>
     `;
        });
        productoElegido();
        alCarrito();
      });
  };

  const productoElegido = () => {
    const clickProducto = document.querySelectorAll(".capturando-producto");
    clickProducto.forEach((productoID) => {
      productoID.addEventListener("click", () => {
        const productoSeleccionado = productoID.getAttribute(`id`);
        localStorage.setItem(
          "idProducto",
          JSON.stringify(productoSeleccionado)
        );
      });
    });
  };

  const alCarrito = () => {
    const sumarArticulo = document.querySelectorAll(".botonAdd");
    sumarArticulo.forEach((botonSumar) => {
      botonSumar.addEventListener("click", () => {
        const totalProductos =
          botonSumar.parentNode.querySelector(".prodSumados");
        totalProductos.textContent = parseInt(totalProductos.textContent) + 1;
      });
    });
    const restarArticulo = document.querySelectorAll(".botonRest");
    restarArticulo.forEach((botonRestar) => {
      botonRestar.addEventListener("click", () => {
        const totalProductos =
          botonRestar.parentNode.querySelector(".prodSumados");
        const cantidadActual = parseInt(totalProductos.textContent);
        totalProductos.textContent =
          cantidadActual > 0 ? cantidadActual - 1 : 0;
      });
    });

    const agregarAlCarrito = document.querySelectorAll(".carritoAdd");
    agregarAlCarrito.forEach((botonAgregarCarrito) => {
      botonAgregarCarrito.addEventListener("click", () => {
        const cantidadProducto = parseInt(
          botonAgregarCarrito.parentNode.querySelector(".prodSumados")
            .textContent
        );
        const productoID = botonAgregarCarrito.parentNode.querySelector(
          ".capturando-producto"
        ).id;

        if (cantidadProducto <= 0) {
          return;
        }

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        const productoExistente = carrito.find(
          (producto) => producto.id === productoID
        );

        if (productoExistente) {
          productoExistente.cantidad += cantidadProducto;
        } else {
          const productoAlCarrito = {
            id: productoID,
            cantidad: cantidadProducto,
          };
          carrito.push(productoAlCarrito);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
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
        location.assign("/ofertas.html");
        localStorage.removeItem("carrito");
      }
    });
  };

  renderizarOfertas();
  obtenerNombreUsuario();
});
