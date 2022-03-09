//---------------------Funciones para quitar, agregar o restar productos del carrito----------------------

function removeProducto() {
        let botones = document.getElementsByClassName('btnRemove');
        for (const boton of botones) {
                boton.addEventListener('click', function () {
                        let seleccion = carrito.find(producto => producto.id == this.id);
                        let indice = carrito.indexOf(seleccion);
                        carrito.splice(indice, 1)
                        localStorage.setItem('Carrito', JSON.stringify(carrito));
                        carritoHTML(carrito)
                        totalCarrito();
                        Toastify({
                                text: `Se ha quitado el producto: ${seleccion.nombre}`,
                                duration: 2000,
                                style: {
                                        background: "#000000",
                                },
                                gravity: "bottom"
                        }).showToast();
                })
        }        
}

function carritoHTML(lista) {
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
}

//---------------Funcion calcular total carrito-------------------------------
function totalCarrito() {
        //Realizo la suma total del carrito
        let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
        totalCarritoInterfaz.innerHTML= "Total: $"+total;
        return total;
}

// -----------------BOTONES DE BUSQUEDA------------------------------------------

function arraySinDuplicados(lista) {
        let unicos = [];
        lista.forEach(producto => {
                !unicos.includes(producto) && unicos.push(producto);
        });
        return unicos;
}


