const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const mostrartabla = document.getElementById('mostrartabla');
const fragment = document.createDocumentFragment()
//tabla
const btnmostrarTabla = document.getElementById('mispedidos');
const tablaProductos = document.getElementById('contenedortablar');


let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => { 
  fetchData() 
  eventos();
  mensajeInicio();
});

function eventos(){
  cards.addEventListener('click', e => { 
    addCarrito(e);
  });
  items.addEventListener('click', e => { 
    btnAumentarDisminuir(e) 
  });
  btnmostrarTabla.addEventListener('click', mostrarTablaProductos);
}
//mensaje inicio

function mensajeInicio(){
    Swal.fire({
        icon: 'question',
        title: '¿Como realizar una Compra en nuestra Tienda?',
        html: '<p>1.En Cada Producto hay un boton que dice comprar.</p>'+'<p>2.Dar click o precionar en el para añadir el producto.</p>'+
        '<p>3.Verificar que el producto este dentro del carrito en la seccion MIS PEDIDOS.</p>'+'<p>4.Seleccionar la cantidad del producto y el mismo carrito le dara el total de todos los productos a pagar</p>'+
        '<p>5.Hacer una captura de pantalla al contenido del carrito</p>'+'<p>6.Precionar el botón CONFIRMAR COMPRAR, y envianos la captura ahi.</p>',
      })
}



// Traer productos
const fetchData = async () => {
    const res = await fetch('BaseDatos.json');
    const data = await res.json()
    pintarCards(data)
}

// Pintar productos
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src",producto.Url)
        templateCard.querySelector('button').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-info')) {
      Swal.fire({
        icon:"success",
        title:"PRODUCTO AGREGADO!",
        timer: 2000,
        showConfirmButton: false
        
      })
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = item => {
    const producto = {
        nombre: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('.btn-info').dataset.id,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => { 
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad 
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad 
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>
        `
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
/// tabla mostrar 
function mostrarTablaProductos(e){
    e.preventDefault();
    if(tablaProductos.classList.contains('mostrar')){
        tablaProductos.classList.remove('mostrar');
    }else{
        tablaProductos.classList.add('mostrar');
    }

}
