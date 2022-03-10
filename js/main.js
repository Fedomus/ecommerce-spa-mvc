const app = new ProductoController(new ProductoModel(), new ProductoView());
const log = new UsuarioController(new UsuarioModel(), new UsuarioView());
// LISTA DE RUTAS (ASOCIAR A CADA ACCION)
const routes = [
  { path: '/pagina0', action: 'show' },
  { path: '/pagina1', action: 'buscar' },
  { path: '/pagina2', action: 'pay' },
  { path: '/pagina3', action: 'login'},
];

//OBTENER LA RUTA ACTUAL (USAMOS EL OBJETO LOCATIOS Y SU PROPIEDAD HASH). SI "" || '/'  ENTONCES parseLocation = '/'
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/pagina0';
//BUSCAMOS EL COMPONENTE EN EL ARRAY routes QUE CORRESPONDE A LA RUTA CON FIND (EL METODO find() DEVUELVE EL VALOR DEL PRIMER ELEMENTO DEL ARRAY QUE CUMPLE CON LA FUNCIÓN)
const findActionByPath = (path, routes) => routes.find(r => r.path == path || undefined)

const router = () => {
  //OBTENER RUTA ACTUAL
  const path = parseLocation();
  const { action = 'error' } = findActionByPath(path, routes) || {};
  // OCULTAMOS #app y #notificaion
  switch (action) {
    case 'show':
      app.mostrarProductos('header', 'app');
      log.login('log');
      break;
    case 'buscar':
      app.buscar('header', 'app');
      log.login('log');
      break;
    case 'pay':
      app.pagar('header', 'app');
      break;
    case 'login':
      log.interfazLogin('app', 'log');
      log.tituloLogin('header');
      break;
    default:
      ErrorComponent('app')
      break;
  }
};

//---------------------------- SECCION DE DECLARACION DE EVENTOS PARA EL ROUTER ----------------------------//
//CADA VEZ QUE SE DETECTA LA CARGA DE LA VENTANA SE LLAMA A LA FUNCION ROUTER
window.onload = () => { router(); }
//CADA VEZ QUE SE DETECTA UN CAMBIO EN EL HASH (EJEMPLO la URL CAMBIA DE #/pagina1 a #/pagina2) SE LLAMA A LA FUNCION ROUTER
window.onhashchange = () => { router(); }

