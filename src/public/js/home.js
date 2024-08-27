document.addEventListener('DOMContentLoaded', async () => {
    const socket = io();
    const list = document.getElementById('productList');

    // Obtener productos iniciales
    try {
        const response = await fetch('/api/products/'); // Solicitud GET sin body
        if (response.ok) {
            const data = await response.json();
            const products = data || [];
            renderProducts(products, list, socket)
        } else {
            console.error('Error al obtener productos:', response.statusText);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }

    socket.on('actualizarProductos', (products) => {
        renderProducts(products, list, socket)
    });

});

renderProducts = (products, list, socket) => {
    list.innerHTML = ''; // Vaciar la lista actual

    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $${product.price}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            // Eliminar el elemento `li` del DOM
            list.removeChild(li);
            // Emitir el evento para borrar el producto en el servidor
            socket.emit('borrarProducto', product.id);
        };
        
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}