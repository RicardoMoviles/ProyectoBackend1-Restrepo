const express = require("express")
const app = express()
const PORT=8080

const cartsRouter = require('./routes/carts.js');
const productsRouter = require('./routes/products.js');

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})