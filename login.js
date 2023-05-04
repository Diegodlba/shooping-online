window.addEventListener("load", function () {
  const form = document.forms[0];
  const url = `https://todo-api.ctd.academy/v1`;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");

    const payload = {
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

    realizarLogin(settings);

    form.reset();
  });

  const realizarLogin = (settings) => {
    fetch(`${url}/users/login`, settings)
      .then((response) => {
        if (response.ok != true) {
          alert("Datos Incorrectos");
        }
        return response.json();
      })

      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("jwt", JSON.stringify(data.jwt));

          location.replace("./principal.html");
        }
      })
      .catch((err) => {
        console.log("promesa rechazada");
        console.log(err);
      });
  };
});
