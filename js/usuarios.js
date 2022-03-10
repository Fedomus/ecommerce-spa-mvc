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
            for (const usuario of this.usuarios) {
                  if (usuario.email == email && usuario.pass == pass){
                        return true
                  } else {
                        return false
                  }
            }
                  
      }
}

class UsuarioView{
      login(padre){
            let divLogin = document.getElementById(padre);
            // let user = JSON.parse(localStorage.getItem('UsuarioActual')) || 'null';
            // if (user === 'null') {
            divLogin.innerHTML='<a href="#/pagina3"><button id="btn-login" class="btn btnNav">Iniciar sesión</button></a>'
      }
      interfaz(padre, callback) {
            document.getElementById(padre).innerHTML=`
            <form id='registroDatosPersonales' class="form-control form-login">
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
            document.getElementById(padre).innerHTML=`<br><h5>Iniciar sesión</h5><hr>`
      }
}

class UsuarioController{
      constructor(usuarioModel, usuarioView){
            this.usuarioModel = usuarioModel;
            this.usuarioView = usuarioView;
      }
      login(padre){
            this.usuarioView.login(padre)
      }
      interfazLogin(padre) {
            this.usuarioView.interfaz(padre, (event) => {
                  let hijos = event.target.parentNode.children;
                  let email = hijos[1].value;
                  let pass = hijos[3].value;
                  if (this.usuarioModel.login(email, pass)){
                        console.log('hola')
                  } else {
                        console.log('no');
                  }
            });
      }
      tituloLogin(padre) {
            this.usuarioView.titulo(padre);
      }
}