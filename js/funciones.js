// Funcion para quitar productos

function removeProducto() {
        let botones = document.getElementsByClassName('btnRemove');
        for (const boton of botones) {
                boton.addEventListener('click', function () {
                        let seleccion = carrito.find(producto => producto.id == this.id);
                        let indice = carrito.indexOf(seleccion);
                        carrito.splice(indice, 1)
                        localStorage.setItem('Carrito', JSON.stringify(carrito));
                        carritoHTML(carrito);
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


