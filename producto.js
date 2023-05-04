window.addEventListener("load", function () {
  const obtenerNombreUsuario = () => {
    const urlUsuario = `https://todo-api.ctd.academy/v1/users/getMe`;
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
          ).innerHTML = `<a href="#"class="cerrar-sesion"><p><i class="fa-solid fa-user"></i> ${data.firstName} ${data.lastName}</p></a>
          `;

          document
            .querySelector(".cerrar-sesion")
            .addEventListener("click", () => {
              cerrarSesion();
            });
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

  const renderizarArticulo = () => {
    const idProducto = JSON.parse(localStorage.idProducto);
    const productoSeleccionado = document.querySelector(".producto");
    const urlProductos = `https://fakestoreapi.com/products/${idProducto}`;

    const settings = {
      method: "GET",
    };

    fetch(urlProductos, settings)
      .then((res) => res.json())
      .then((producto) => {
        const precioConDescuento = Math.trunc(producto.price * 0.7);
        productoSeleccionado.innerHTML += `
              <article class="container">
                <div class="descripcion">    
                  <img src="${producto.image}" alt"imagenProducto"/>
                  <h3>Caracteristicas: </h3>
                  <p>${producto.description}</p>
                </div>
                <div class="titulo-precio">
                  <h3>${producto.title}</h3>
                  <h4>Precio</h4>
                  <p style="text-decoration: line-through"> Antes U$S${Math.trunc(
                    producto.price
                  )}</p>
                  <p style="color: red">Ahora: U$S${precioConDescuento}</p>
                <div>
              </article>
           `;
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

  renderizarArticulo();
  obtenerNombreUsuario();
});
