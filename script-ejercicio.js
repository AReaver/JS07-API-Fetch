// URL de la API
const url = "https://reqres.in/api/users?delay=5000";

// Botón HTML
const startButton = document.getElementById("btn");

// Función al hacer clic en el botón
startButton.onclick = async () => {
  const content = document.getElementById("products-container");
  const datosLocalStorage = localStorage.getItem("userData");

  const fechaNuevaSolicitud = new Date().getTime();
  console.log(typeof fechaNuevaSolicitud);

  // Desactivar el botón mientras se completa el bloque de código
  desactivarBoton(true);

  // Si hay contenido en el local storage
  if (datosLocalStorage !== null) {
    // Obtener la fecha de la solicitud previa
    const fechaSolicitudPrevia = await obtenerFechaDelLocalStorage();

    // Si la diferencia de tiempo es mayor a un minuto (60000 milisegundos)
    if (fechaNuevaSolicitud - fechaSolicitudPrevia > 60000) {
      content.innerHTML = showSpinner();
      await borrarDatosDelLocalStorage();
      await almacenarDatosEnLocalStorage(url);
      const datosUsuariosLocalStorageJson = localStorage.getItem("userData");
      const users = JSON.parse(datosUsuariosLocalStorageJson);
      const infoParaMostrar = await mostrarEnDom(users);
      content.innerHTML = infoParaMostrar;
      desactivarBoton(false);
    } else {
      const datosUsuariosLocalStorageJson = localStorage.getItem("userData");
      const users = JSON.parse(datosUsuariosLocalStorageJson);
      const infoParaMostrar = await mostrarEnDom(users);
      content.innerHTML = infoParaMostrar;
      desactivarBoton(false);
    }
  } else {
    content.innerHTML = showSpinner();
    await almacenarDatosEnLocalStorage(url);
    const datosUsuariosLocalStorageJson = localStorage.getItem("userData");
    const users = JSON.parse(datosUsuariosLocalStorageJson);
    const infoParaMostrar = await mostrarEnDom(users);
    content.innerHTML = infoParaMostrar;
    desactivarBoton(false);
  }
};

// Obtener datos de la URL y almacenarlos en el localStorage junto con la fecha
const almacenarDatosEnLocalStorage = async (url) => {
  await fetch(url)
    .then((response) => response.json())
    .then((users) => {
      const arreglo = users.data;
      localStorage.setItem("userData", JSON.stringify(arreglo));
      localStorage.setItem("fechaSolicitud", JSON.stringify(new Date().getTime()));
    })
    .catch((error) => {
      console.log(error);
    });
};

// Mostrar datos en el DOM en una tabla
const mostrarEnDom = async (arreglo) => {
  const personas = arreglo.map((element) => `
    <table class="table table-dark"> 
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Email</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Avatar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">${element.id}</th>
          <td class="text-white">${element.email}</td>
          <td class="text-white">${element.first_name}</td>
          <td class="text-white">${element.last_name}</td>
          <td class="text-white"><img src="${element.avatar}" class="rounded-circle" alt="avatar"/></td>
        </tr>
      </tbody>
    </table>
  `);
  return personas.join(""); // Devuelve la tabla como un solo string
};

// Obtener la fecha del localStorage
const obtenerFechaDelLocalStorage = async () => {
  const fechaSolicitud = localStorage.getItem("fechaSolicitud");
  const fecha = JSON.parse(fechaSolicitud);
  return fecha;
};

// Borrar datos del localStorage
const borrarDatosDelLocalStorage = async () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("fechaSolicitud");
};

// Mostrar un spinner
const showSpinner = () => {
  const spinner = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
  return spinner;
};

// Activar o desactivar el botón
const desactivarBoton = (valor) => {
  startButton.disabled = valor;
};
