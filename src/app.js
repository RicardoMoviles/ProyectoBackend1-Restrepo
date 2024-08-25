const express = require("express")
const {engine} = require("express-handlebars")
const app = express()
const PORT=8080

const cartsRouter = require('./routes/carts.js');
const productsRouter = require('./routes/products.js');
const vistasRouter = require('./routes/vistasRouter.js');


app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//configurar el handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")



app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', vistasRouter );

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})