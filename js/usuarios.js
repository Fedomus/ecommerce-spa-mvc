class Usuario {
      constructor(data) {
            this.id = parseInt(data.id);
            this.nombre = data.nombre.toUpperCase();
            this.email = data.email;
            this.pass = data.pass;
      }
}

fetch('usuarios/usuarios.json')
.then( response => response.json())
.then( (data) => {
      localStorage.setItem('Usuarios', JSON.stringify(data));
}).catch( mensaje => console.error(mensaje));

class UsuarioModel{
      constructor(){
            const usuarios = JSON.parse(localStorage.getItem('Usuarios')) || [];
            this.usuarios = usuarios.map(usuario => new Usuario(usuario));
      }
      login(email, pass){
            return this.usuarios.find(usuario => usuario.email == email && usuario.pass == pass) || 'null';
      }
}

class UsuarioView{
      login(padre, callback){
            let divLogin = document.getElementById(padre);
            // let user = JSON.parse(localStorage.getItem('UsuarioActual')) || 'null';
            // if (user === 'null') {
            divLogin.innerHTML='<a href="#/pagina3"><button id="btn-login" class="btn btnNav">Iniciar sesión</button></a>'
            document.querySelector('#btn-login').onclick= callback;
      }
      interfaz(padre, callback) {
            document.getElementById(padre).innerHTML=`
            
            <form id='registroDatosPersonales' class="form-control form-login">
            <span>(email: 1111@1111.com - pass: 1111)</span>
                  <label style="text-align: center;"></label>
                  <input type="email" class="form-control" id="email" placeholder="nombre@ejemplo.com" required>
                  <br>
                  <input type="password" class="form-control" id="pass" placeholder="Contraseña" required>
                  <br>
                  <a href="#/pagina4" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Registrarme</a>
                  <button id="ingresar" type="button" class="btn btn-primary">Ingresar</button>
            </form>
            
            `
            document.getElementById('ingresar').onclick = callback;
      }
      titulo(padre){
            document.getElementById(padre).innerHTML=`<br><h5>Iniciar sesión</h5><hr>`;
            
      }
      linkUsuario(divUser, nombre){
            document.getElementById(divUser).innerHTML=`
            
            <div class="dropdown">
          <button class="btn dropdown-toggle btnNav" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          ${nombre}
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="">Mi cuenta</a></li>
            <li><a id="logOut" class="dropdown-item" href="">Salir</a></li>
          </ul>
        </div>
     `
     document.querySelector('#logOut').onclick = () => {
           localStorage.removeItem('UsuarioActivo');
     }
      }
}

class UsuarioController{
      constructor(usuarioModel, usuarioView){
            this.usuarioModel = usuarioModel;
            this.usuarioView = usuarioView;
      }
      login(padre){
            let usuario = JSON.parse(localStorage.getItem('UsuarioActivo')) || 'null';
            if (usuario == 'null'){
                  this.usuarioView.login(padre, (event) => {
                        event.target.parentNode.innerHTML='';
                  })
            } else {
                  this.usuarioView.linkUsuario(padre, usuario.nombre)
            }
      }
      interfazLogin(padre, divUser) {
            this.usuarioView.interfaz(padre, (event) => {
                  let hijos = event.target.parentNode.children;
                  let email = hijos[1].value;
                  let pass = hijos[3].value;
                  let usuario = this.usuarioModel.login(email, pass);
                  if (usuario != 'null'){
                        localStorage.setItem('UsuarioActivo', JSON.stringify(usuario))
                        history.back();
                  } else {
                        console.log('no');
                  }
            });
            
      }
      tituloLogin(padre) {
            this.usuarioView.titulo(padre);
      }
}