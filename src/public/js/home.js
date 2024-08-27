const socket = io();
socket.on('actualizarProductos', (products) => {
    const list = document.getElementById('productList');
    list.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
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
});