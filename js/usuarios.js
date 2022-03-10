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
            return (email == this.email && pass == this.pass)
      }
}

class UsuarioView{
      login(padre){
            let divLogin = document.getElementById(padre);
            // let user = JSON.parse(localStorage.getItem('UsuarioActual')) || 'null';
            // if (user === 'null') {
            divLogin.innerHTML='<a href="#/pagina3"><button class="btn btnNav">Iniciar sesión</button></a>'
            
      }
}

class UsuarioController{
      constructor(usuarioModel, usuarioView){
            this.usuarioModel = usuarioModel;
            this.usuarioView = usuarioView;
      }
      login(padre){
            this.usuarioView.login(padre, () => {

            })
      }
}