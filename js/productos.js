//DECLARACIÓN DE CLASE PRODUCTO
class Producto {
    constructor(data) {
            this.id = parseInt(data.id);
            this.nombre = data.nombre.toUpperCase();
            this.precio = parseFloat(data.precio);
            this.img= data.img;
            this.categoria = data.categoria;
            this.cantidad= data.cantidad || 1;
    }
    addCantidad() {
        this.cantidad += 1;
    }
    subTotal(){
        return this.precio * this.cantidad;                
    }
}

fetch("productos/productos.json")
.then( response => response.json())
.then( (data) => {
    localStorage.setItem('productos', JSON.stringify(data));
}).catch( mensaje => console.error(mensaje));


class ProductoModel {
    constructor() {
        //OBTENEMOS EL ARRAY DE PRODUCTOS PARSEANDO DESDE EL JSON SI EXISTE
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        //USAMOS MAP PARA CREAR UN NUEVO ARRAY DE OBJETOS DE TIPO PRODUCTO
        this.productos = productos.map(producto => new Producto(producto));
        this.categorias = arraySinDuplicados(this.productos.map(producto => producto.categoria));
    }
    buscarProducto(id) {
        return this.productos.find(producto => producto.id === id);
    }
    filtrarProductos(categoria) {
        const filtroCategoria = this.productos.filter(producto => producto.categoria == categoria);
        return filtroCategoria
    }
    buscadorProductos(nombre) {
        const filtroNombre = this.productos.filter(producto => producto.nombre.includes(nombre));
        return filtroNombre
    }
}


class ProductoView {

    listarProductos(padre, data, callback) {
        let divProductos = document.createElement('div');
        for (const producto of data) {
            let divProducto = document.createElement('div');
            divProducto.innerHTML= `<div class="card">
                                        <img src="${producto.img}" class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <p class="card-title">${producto.nombre}</p>
                                            <span class="card-text">Precio: $${producto.precio}</span>
                                            <br>
                                            <button id='${producto.id}' class = 'btnComprar btn btn-primary'>Añadir</button>
                                        </div>
                                    </div>`;
            divProductos.append(divProducto);
            divProductos.className='divProductos'
        }
        let html = document.getElementById(padre);
        html.innerHTML= '';
        html.append(divProductos);
        document.querySelectorAll(".btnComprar").forEach(b => b.onclick = callback);
    }
    generarBotones(padre, lista, callback){
        document.getElementById(padre).innerHTML=  `<br>
        <button class='btn btn-filtro'>Todos los productos</button><button class='btn btn-filtro'>${lista.join("</button><button class='btn btn-filtro'>")}</button><hr>`
        document.querySelectorAll('.btn-filtro').forEach(b => b.onclick = callback);
    }

    mostrarCarrito(lista, seleccion){
        cantidadCarrito.innerHTML = lista.length;
        productosCarrito.innerHTML = "";
        for (const producto of lista) {
                let prod = document.createElement('tr');
                prod.innerHTML = `
                        <th scope="row">
                            <button id="${producto.id}" class="btnRemove btn-carrito">X</button>   
                        </th>
                        <td>${producto.nombre} </td>
                        <td>$${producto.precio}</td>
                        <td><button id="${producto.id}" class="btnSub btn-carrito">-</button> ${producto.cantidad} <button id="${producto.id}" class="btnAdd btn-carrito">+</button></td>
                        <td>$${producto.subTotal()}</td>
                `;
                productosCarrito.append(prod);
        }
        removeProducto();
        totalCarrito();
        Toastify({
            text: `Se ha agregado el producto: ${seleccion.nombre}`,
            duration: 2000,
            style: {
                    background: "#000000",
            },
            gravity: "bottom"
        }).showToast();
    }

    buscadorProducto(padre, callback){
        document.getElementById(padre).innerHTML=  `<br>
                                                    <input id="buscador" placeholder='Nombre del producto...'></input>
                                                    <button id="buscar" class='btn-carrito' type='submit'>Buscar</button>
                                                    <hr>`
        document.getElementById('buscador').onchange = callback;
    }

    modoPago(header, padre, callback) {
        let monto = totalCarrito();
        document.getElementById(header).innerHTML = `<br>
                                                    <p>Total a pagar: $${monto}</p>
                                                    <hr>`
        document.getElementById(padre).innerHTML = `
        
        <span>Elegí el modo de pago</span>
        <br>
        <br>
        <form id="formModoPago">
                  <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="unPago" checked>
                        <label id="labelUnPago" class="form-check-label" for="unPago">Efectivo
                        </label>
                  </div>
                  <br>
                  <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="dosPagos">
                        <label id="labelDosPagos" class="form-check-label" for="dosPagos">Tarjeta de Débito
                        </label>
                  </div>
                  <br>
                  <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="tresPagos">
                        <label id="labelTresPagos" class="form-check-label" for="tresPagos"> Tarjeta de Crédito
                        </label>
                  </div>
            </form>
            <br>
            <button id="btnPago" class="btn btn-success">Pagar</button> `;

        document.querySelector(".btnPagar").onclick = callback;
    }
}


class ProductoController {

    constructor(productoModel, productoView) {
        this.productoModel = productoModel;
        this.productoView = productoView;
    }

    mostrarProductos(header, app) {
        const eventoAgregar = (event) => {
            let hijos = event.target.parentNode.children;
            let id = parseInt(hijos[3].id);
            let seleccion = this.productoModel.buscarProducto(id);
            actualizarCarrito(seleccion);
            this.productoView.mostrarCarrito(carrito, seleccion);
        }
        this.productoView.listarProductos(app, this.productoModel.productos, eventoAgregar)
        this.productoView.generarBotones(header, this.productoModel.categorias, (event) => {
            if (event.target.innerText == 'Todos los productos'){
                this.productoView.listarProductos(app, this.productoModel.productos, eventoAgregar)
            } else {
                this.productoView.listarProductos(app,
                    this.productoModel.filtrarProductos(event.target.innerText), (event) => {
                        let hijos = event.target.parentNode.children;
                        let id = parseInt(hijos[3].id);
                        let seleccion = this.productoModel.buscarProducto(id);
                        actualizarCarrito(seleccion);
                        this.productoView.mostrarCarrito(carrito, seleccion);
                    });
            }
        })
    }

    buscar(header, app) {
        const eventoAgregar = (event) => {
            let hijos = event.target.parentNode.children;
            let id = parseInt(hijos[3].id);
            let seleccion = this.productoModel.buscarProducto(id);
            actualizarCarrito(seleccion);
            this.productoView.mostrarCarrito(carrito, seleccion);
        }
        this.productoView.listarProductos(app, this.productoModel.productos, eventoAgregar)
        this.productoView.buscadorProducto(header, () => {
            let nombre = document.getElementById('buscador').value.toUpperCase()
            this.productoView.listarProductos(app, this.productoModel.buscadorProductos(nombre), eventoAgregar)
        })
    }
    pagar(header, app) {
        $('#staticBackdrop').modal('hide')
        this.productoView.modoPago(header, app, (event) => {
            console.log(event);
        })
    }
}


//-------------------FUNCION QUE MANTIENE ACTUALIZADO EL CARRITO---------------------

function actualizarCarrito(seleccion){
    if (carrito.includes(seleccion)) {
        seleccion.addCantidad();
    } else {
        carrito.push(seleccion);
    }
    localStorage.setItem('Carrito', JSON.stringify(carrito));
    
}



// ----------------FUNCION PARA CALCULAR EL TOTAL DEL CARRITO--------------------

function totalCarrito() {
    //Realizo la suma total del carrito
    let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
    totalCarritoInterfaz.innerHTML= "Total: $"+total;
    return total;
}

// ----------------FUNCION PARA AGREGAR CANTIDAD DE UN PRODUCTO AL CARRITO--------------------

function addProducto() {
    let botones = document.getElementsByClassName('btnAdd');
    for (const boton of botones) {
        let producto = carrito.find(p => p.id == this.id);
        console.log(this.parentNode.children[1]);
        //Uso el metodo agregarCantidad para agregar
        //Modifico el dom subiendo al padre del boton(con parentNode) y obtengo sus hijos(children) para modificarlos
        this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
        this.parentNode.children[2].innerHTML = "Subtotal: " + producto.subTotal();
        //Actualizo la interfaz del total
        totalCarrito();
        localStorage.setItem('Carrito', JSON.stringify(carrito));
    }
    //Busco a que producto quiero agregar cantidad
}

// ----------------FUNCION PARA RESTAR CANTIDAD DE UN PRODUCTO AL CARRITO--------------------

function subCarrito() {
    //Busco a que producto quiero quitar cantidad
    let producto = carrito.find(p => p.id == this.id);
    //Verifico que no reste si es 1
    if (producto.cantidad > 1) {
            //Uso el metodo agregarCantidad para restar con -1
            producto.agregarCantidad(-1);
            //Modifico el dom subiendo al padre del boton(con parentNode) y obtengo sus hijos(children) para modificarlos
            this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
            this.parentNode.children[2].innerHTML = "Subtotal: " + producto.subTotal();
            //Actualizo la interfaz del total
            totalCarrito();
            localStorage.setItem('Carrito', JSON.stringify(carrito));
    }
}




//COMPONENTE A EMPLEAR CUANDO NO SE ENCUENTRA LA PAGINA SOLICITADA

const ErrorComponent = (padre) => {
    document.getElementById(padre).innerHTML ="<h2>Error 404</h2>";
}