const express = require("express")
const {engine} = require("express-handlebars")
const {Server} = require("socket.io")
const ProductsManager = require("./dao/ProductsManager.js");
const http = require('http');
const socketIo = require('socket.io');
const connDB = require("./connDB.js");
const config = require("./config/config.js");

const app = express()
const server = http.createServer(app)
const io = socketIo(server);
const PORT=config.PORT

const cartsRouter = require('./routes/carts.js');
const productsRouter = require('./routes/products.js');
const vistasRouter = require('./routes/vistasRouter.js');

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static("./src/public"))

app.use((req, res, next) => {
    req.io = io;
    next();
});

//configurar el handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter);
app.use('/', vistasRouter )


server.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})


io.on('connection', (socket) => {
    console.log('cliente conectado');
    
    socket.on('borrarProducto', async (productId) => {
        try {
            await ProductsManager.deleteProduct(productId);
        } catch (error) {
            console.error('Error deleting product via WebSocket:', error.message);
        }
    }); 
});

connDB()