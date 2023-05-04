window.addEventListener("load", function () {
  const form = document.forms[0];
  const firstName = document.querySelector("#inputFirstName");
  const lastName = document.querySelector("#inputLastName");
  const email = document.querySelector("#inputEmail");
  const password = document.querySelector("#inputPassword");
  const passwordRepetida = document.querySelector("#inputPasswordRepetida");
  const url = `https://todo-api.ctd.academy/v1`;

  const firstNameError = document.querySelector("#firstNameError");
  const lastNameError = document.querySelector("#lastNameError");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const passwordRepetidaError = document.querySelector(
    "#passwordRepetidaError"
  );

  const estadoUsuario = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordRepetida: "",
  };

  const estadoErroresOK = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    passwordRepetida: false,
  };

  const mostrarErrores = () => {
    estadoErroresOK.firstName
      ? firstNameError.classList.remove("visible")
      : firstNameError.classList.add("visible");

    estadoErroresOK.lastName
      ? lastNameError.classList.remove("visible")
      : lastNameError.classList.add("visible");

    estadoErroresOK.email
      ? emailError.classList.remove("visible")
      : emailError.classList.add("visible");

    estadoErroresOK.password
      ? passwordError.classList.remove("visible")
      : passwordError.classList.add("visible");

    estadoErroresOK.passwordRepetida
      ? passwordRepetidaError.classList.remove("visible")
      : passwordRepetidaError.classList.add("visible");
  };

  form.addEventListener("change", function () {
    estadoUsuario.firstName = firstName.value;
    estadoUsuario.lastName = lastName.value;
    estadoUsuario.email = email.value;
    estadoUsuario.password = password.value;
    estadoUsuario.passwordRepetida = passwordRepetida.value;

    estadoErroresOK.firstName = validarFirstName(estadoUsuario.firstName);
    estadoErroresOK.lastName = validarLastName(estadoUsuario.lastName);
    estadoErroresOK.email = validarEmail(estadoUsuario.email);
    estadoErroresOK.password = validarPassword(estadoUsuario.password);
    estadoErroresOK.passwordRepetida = validarPasswordRepetida(
      estadoUsuario.passwordRepetida
    );

    // finalmente muestro los errores presentes
    mostrarErrores();
  });

  const validarFirstName = (name) => {
    let resultado = false;

    // si pasa las pruebas lo damos por válido 👇
    if (name.length > 3 && !isNaN(name)) {
      resultado = true;
    }

    return resultado;
  };

  const validarLastName = (surname) => {
    let resultado = false;

    // si pasa las pruebas lo damos por válido 👇
    if (surname.length > 3 && !isNaN(surname)) {
      resultado = true;
    }

    return resultado;
  };

  const validarEmail = (email) => {
    let resultado = false;

    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

    if (regex.test(email)) {
      resultado = true;
    }

    return resultado;
  };

  const validarPassword = (pass) => {
    let resultado = false;

    if (pass.length > 5 && !pass.includes(" ")) {
      resultado = true;
    }

    return resultado;
  };

  const validarPasswordRepetida = (passRepetida) => {
    let resultado = false;

    if (passRepetida === password.value) {
      resultado = true;
    }

    return resultado;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };

    const settings = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (
      estadoErroresOK.firstName &&
      estadoErroresOK.lastName &&
      estadoErroresOK.email &&
      estadoErroresOK.password &&
      estadoErroresOK.passwordRepetida
    ) {
      realizarSignUp(settings);
    }
  });

  const realizarSignUp = (settings) => {
    fetch(`${url}/users`, settings)
      .then((response) => {
        if (response.ok != true) {
          alert("Alguno de los datos es incorrecto.");
        }
        return response.json();
      })

      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("jwt", JSON.stringify(data.jwt));

          location.assign("/principal.html");
        }
      })
      .catch((err) => {
        console.log("promesa rechazada");
        console.log(err);
      });
  };
});
