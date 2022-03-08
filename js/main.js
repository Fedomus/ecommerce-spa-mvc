const app = new ProductoController(new ProductoModel(), new ProductoView());
// LISTA DE RUTAS (ASOCIAR A CADA ACCION)
const routes = [
  { path: '/pagina0', action: 'show' },
  { path: '/pagina1', action: 'buscar' },
  { path: '/pagina2', action: 'pay' },
 
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
      break;
    case 'buscar':
      app.buscar('header', 'app');
      break;
    case 'pay':
      app.pagar('header', 'app');
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

