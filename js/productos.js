//DECLARACIÓN DE CLASE PRODUCTO
class Producto {
    constructor(data) {
            this.id = parseInt(data.id);
            this.nombre = data.nombre.toUpperCase();
            this.precio = parseFloat(data.precio);
            this.img= data.img;
            this.categoria = data.categoria;
            this.stock= data.stock;
    }
    addCantidad() {
        this.cantidad += 1;
    }
    subTotal(cantidad){
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
        return this.productos.find(producto => producto.id == id);
    }
    filtrarProductos(categoria) {
        const filtroCategoria = this.productos.filter(producto => producto.categoria == categoria);
        return filtroCategoria
    }
    buscadorProductos(nombre) {
        const filtroNombre = this.productos.filter(producto => producto.nombre.includes(nombre));
        return filtroNombre
    }
    actualizarCarrito(seleccion, cantidad){
        if (carrito.includes(seleccion)) {
            seleccion.cantidad = cantidad;
        } else {
            seleccion.cantidad = cantidad;
            carrito.push(seleccion);
        }
        localStorage.setItem('Carrito', JSON.stringify(carrito));  
    }
}

class ProductoView {
    listarProductos(padre, data, callback) {
        let divProductos = document.createElement('div');
        for (const producto of data) {
            let divProducto = document.createElement('div');
            divProducto.id=producto.id;
            divProducto.classList='card verDetalle';
            divProducto.innerHTML= `
                                        <img src="${producto.img}" class="card-img-top" alt="...">
                                        <h5 class="card-text">$${producto.precio}</h5>
                                        <span class="card-title">${producto.nombre}</span>
                                    `;
            divProductos.append(divProducto);
            divProductos.className='divProductos'
        }
        let html = document.getElementById(padre);
        html.innerHTML= '';
        html.append(divProductos);
        document.querySelectorAll(".verDetalle").forEach(b => b.onclick = callback);
    }

    generarBotones(padre, lista, callback){
        document.getElementById(padre).innerHTML=  `<br>
        <button class='btn btn-filtro'>Todos los productos</button><button class='btn btn-filtro'>${lista.join("</button><button class='btn btn-filtro'>")}</button><hr>`
        document.querySelectorAll('.btn-filtro').forEach(b => b.onclick = callback);
    }

    mostrarDetalle(titulo, padre, producto, callback){
        document.getElementById(titulo).innerHTML= `Titulo`
        document.getElementById(padre).innerHTML='';
        let imagenGrande = document.createElement('div');
        let seccionComprar = document.createElement('div');
        imagenGrande.className = "imagen";
        let listaStock = [];
        for (let i = 2; i <= producto.stock; i++){
            listaStock.push(i)
        }
        seccionComprar.className='seccionComprar'
        imagenGrande.innerHTML= `<img src="${producto.img}" class="imagenGrande">`
        seccionComprar.innerHTML=`<h4 id="${producto.id}">${producto.nombre}</h4>
                                <h5>$${producto.precio}</h5>
                                <span>Descripcion</span>
                                <br>
                                <p>Cantidad:</p>
                                <select id="cantidad" class="form-select form-select-sm" aria-label=".form-select-sm example">
                                    <option selected>1</option>
                                    <option>${listaStock.join("</option><option>")}</option>
                                </select>
                                <br>
                                <button class="btn btn-primary btnComprar">Comprar</button>
                                ` 
        document.getElementById(padre).append(imagenGrande, seccionComprar);
        document.querySelector(".btnComprar").onclick = callback;
    }

    mostrarCarrito(lista, seleccion, cantidad){
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
                    <td>${producto.cantidad}</td>
                    <td>$${producto.subTotal(producto.cantidad)}</td>
            `;
            productosCarrito.append(prod);
        }
        removeProducto();
        totalCarrito(cantidad);
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
        <div class="modoPago">
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
            <button id="btnPago" class="btn btn-success">Pagar</button> 
        </div>`;

        document.querySelector("#btnPago").onclick = callback;
    }
}


class ProductoController {

    constructor(productoModel, productoView) {
        this.productoModel = productoModel;
        this.productoView = productoView;
    }

    mostrarProductos(header, app) {
        const eventoVerDetalle = (event) => {
            let id = event.target.parentNode.id;
            let seleccion = this.productoModel.buscarProducto(id);
            this.productoView.mostrarDetalle(header, app, seleccion, (e) => {
                let hijos = e.target.parentNode.children;
                let id = parseInt(hijos[0].id);
                let seleccion = this.productoModel.buscarProducto(id);
                let cantidad = hijos[5].value
                this.productoModel.actualizarCarrito(seleccion, cantidad);
                this.productoView.mostrarCarrito(carrito, seleccion, cantidad);
            });
            // actualizarCarrito(seleccion);
            // this.productoView.mostrarCarrito(carrito, seleccion);
        }
        this.productoView.listarProductos(app, this.productoModel.productos, eventoVerDetalle)
        this.productoView.generarBotones(header, this.productoModel.categorias, (event) => {
            if (event.target.innerText == 'Todos los productos'){
                this.productoView.listarProductos(app, this.productoModel.productos, eventoVerDetalle)
            } else {
                this.productoView.listarProductos(app,
                    this.productoModel.filtrarProductos(event.target.innerText), eventoVerDetalle)
                    
            }
        })
    }

    buscar(header, app) {
        const eventoVerDetalle = (event) => {
            let id = event.target.parentNode.id;
            let seleccion = this.productoModel.buscarProducto(id);
            this.productoView.mostrarDetalle(header, app, seleccion, (e) => {
                let hijos = e.target.parentNode.children;
                let id = parseInt(hijos[0].id);
                let seleccion = this.productoModel.buscarProducto(id);
                let cantidad = hijos[5].value
                this.productoModel.actualizarCarrito(seleccion, cantidad);
                this.productoView.mostrarCarrito(carrito, seleccion, cantidad);
            });
            // actualizarCarrito(seleccion);
            // this.productoView.mostrarCarrito(carrito, seleccion);
        }
        this.productoView.listarProductos(app, this.productoModel.productos, eventoVerDetalle)
        this.productoView.buscadorProducto(header, () => {
            let nombre = document.getElementById('buscador').value.toUpperCase()
            this.productoView.listarProductos(app, this.productoModel.buscadorProductos(nombre), eventoVerDetalle)
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

function carritoVacio(padre) {
    if (carrito.length == 0) {
            padre.innerHTML = `<span>Aún no has agregado productos al carrito</span>`;
    }
}

// ----------------FUNCION PARA CALCULAR EL TOTAL DEL CARRITO--------------------

function totalCarrito() {
    //Realizo la suma total del carrito
    let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
    totalCarritoInterfaz.innerHTML= "Total: $"+total;
    return total;
}

//COMPONENTE A EMPLEAR CUANDO NO SE ENCUENTRA LA PAGINA SOLICITADA

const ErrorComponent = (padre) => {
    document.getElementById(padre).innerHTML ="<h2>Error 404</h2>";
}