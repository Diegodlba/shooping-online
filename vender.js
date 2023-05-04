window.addEventListener("load", function () {
  if (this.localStorage.jwt == null) {
    Swal.fire({
      title: "Para ingresar a esta sección debe estar logueado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008f39	",
      cancelButtonColor: "#d63030",
      cancelButtonText: "Continuar navegando!",
      confirmButtonText: "Loguearme!",
    }).then((result) => {
      if (result.isConfirmed) {
        location.assign("/login.html");
      } else {
        location.assign("/principal.html");
      }
    });
  }

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

  const furmularioAgregarProducto = () => {
    const formArticulo = document.querySelector("article");
    formArticulo.innerHTML = `
    <form>
        <div>
            <h2>Cargar producto</h2>
        </div>
        <div>
            <input type="text" id="inputTituloProducto" placeholder="Título del producto" autofocus/>
            <p>
          <small class="error" id="tituloProductoError"
            >Máximo 30 carácteres</small
          >
        </p>
        </div>
        <div>
            <input type="number "id="inputPrecio" placeholder="Precio en dólares" />
            <p>
          <small class="error" id="precioError"
            >Éste campo permite solamente números</small
          >
        </p>
        </div>
        <div>
            <input type="text" id="inputDescripcion" placeholder="Descripción del producto" />
            <p>
          <small class="error" id="descripcionError"
            >Máximo 60 carácteres</small
          >
        </p>
        </div>
        <div>
            <input type="url" id="inputImagen" placeholder="Imagen producto (Solamente url)" />
            <p>
          <small class="error" id="imagenError"
            >Éste campo acepta unicamente url</small
          >
        </p> 
        </div>
        <div>   
            <select name="Categoría" id="selectCategoria">
                <option value="electronic">electronic</option>
                <option value="jewelery" selected>jewelery</option>
                <option value="men's clothing">men's clothing</option>
                <option value="women's clothing">women's clothing</option>
            </select>
        </div>
        <div>
            <button type="submit">Crear producto</button>
        </div>
    </form>
    `;
  };
  furmularioAgregarProducto();

  const form = document.forms[0];
  const title = document.querySelector("#inputTituloProducto");
  const price = document.querySelector("#inputPrecio");
  const description = document.querySelector("#inputDescripcion");
  const image = document.querySelector("#inputImagen");
  const category = document.querySelector("#selectCategoria");

  const tituloProductoError = document.querySelector("#tituloProductoError");
  const precioError = document.querySelector("#precioError");
  const descripcionError = document.querySelector("#descripcionError");
  const imagenError = document.querySelector("#imagenError");

  const estadoProducto = {
    title: "",
    price: "",
    description: "",
    image: "",
  };

  const estadoErroresOK = {
    title: false,
    price: false,
    description: false,
    image: false,
  };

  const mostrarErrores = () => {
    estadoErroresOK.title
      ? tituloProductoError.classList.remove("visible")
      : tituloProductoError.classList.add("visible");

    estadoErroresOK.price
      ? precioError.classList.remove("visible")
      : precioError.classList.add("visible");

    estadoErroresOK.description
      ? descripcionError.classList.remove("visible")
      : descripcionError.classList.add("visible");

    estadoErroresOK.image
      ? imagenError.classList.remove("visible")
      : imagenError.classList.add("visible");
  };

  form.addEventListener("change", () => {
    estadoProducto.title = title.value;
    estadoProducto.price = price.value;
    estadoProducto.description = description.value;
    estadoProducto.image = image.value;

    estadoErroresOK.title = validarTituloProducto(estadoProducto.title);
    estadoErroresOK.price = validarPrecio(estadoProducto.price);
    estadoErroresOK.description = validarDescripcion(
      estadoProducto.description
    );
    estadoErroresOK.image = validarImagen(estadoProducto.image);

    mostrarErrores();
  });

  const validarTituloProducto = (title) => {
    let resultado = false;
    if (title.length <= 30) {
      resultado = true;
    }
    return resultado;
  };

  const validarPrecio = (price) => {
    let resultado = false;
    if (!isNaN(price)) {
      resultado = true;
    }
    return resultado;
  };

  const validarDescripcion = (description) => {
    let resultado = false;
    if (description.length <= 60) {
      resultado = true;
    }
    return resultado;
  };

  const validarImagen = (image) => {
    let resultado = false;
    if (/^https?:\/\/.+/.test(image)) {
      resultado = true;
    }
    return resultado;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.jwt);

    const articulo = {
      id: "",
      title: title.value,
      price: price.value,
      category: category.value,
      description: description.value,
      image: image.value,
    };

    const settings = {
      method: "POST",
      body: JSON.stringify(articulo),
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    };
    if (
      estadoErroresOK.title &&
      estadoErroresOK.price &&
      estadoErroresOK.description &&
      estadoErroresOK.image
    ) {
      cargarProducto(settings);
      articlePosCargaProducto();
    }
    form.reset();
  });

  const cargarProducto = (settings) => {
    const url = `https://fakestoreapi.com/products`;

    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => {
        console.log("promesa rechazada");
        console.log(err);
      });
  };

  const problemaApi = () => {
    const asideError = document.querySelector("aside");
    asideError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>
    <h1>API</h1>
    <p>Al completar el formulario para cargar el producto el mismo no queda realmente cargado en la base de datos, por lo cual no se encontrará dentro de los productos en la web. <br>
      La lógica está efectuada y la pueden ver en el siguiente link: </p>`;
  };

  const articlePosCargaProducto = () => {
    const formArticulo = document.querySelector("article");
    formArticulo.innerHTML = ``;
    const asideError = document.querySelector("aside");
    asideError.innerHTML = ``;
    const mainPosCargarProducto = document.querySelector("main");
    mainPosCargarProducto.innerHTML = `
      <article class="pos-carga-producto">
          <h2> Su producto quedaría cargado de la siguiente manera </h2>
          <p>Titulo: ${title.value}</p>
          <p>Precio de venta: U$S ${price.value}</p>
          <p>Descripción: ${description.value}</p>
          <p>Categoría de producto: ${category.value}</p>
          <img src="${image.value}" alt="Imagen del producto: (${image.value})"/>
          <button class="continuar-cargando"> Continuar cargando productos </button>
      </article>
    `;

    const botonContinuarCargando = document.querySelector(
      ".continuar-cargando"
    );
    botonContinuarCargando.addEventListener("click", () => {
      console.log("Se clickeo");
      location.replace("./vender.html");
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

  problemaApi();
  obtenerNombreUsuario();
});
