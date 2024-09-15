const Router = require('express').Router;
const ProductsManager = require("../dao/productsManager");
const router = Router()


router.get('/', async (req, res) => {
    try {
        const products = await ProductsManager.getProducts();
        //const cart = await CartsManager.getCartProducts(cartId);

        if (!products || !products.payload) {
            return res.status(404).render("error", { error: "Productos o carrito no encontrado" });
        }

        let titulo = "Lista de productos"
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("home", {
            titulo,
            title: "Home",
            products: products.payload,
            page: products.page || 1,
            totalPages: products.totalPages || 1
        });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

router.get('/realtimeproducts', async (req, res) => {
    let products;
    try {
        products = await ProductsManager.getProducts();
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }

    res.setHeader('Content-Type', 'text/html')
    res.status(200).render("realTimeProducts", {
        realEstilo: "real-styles",
        products: products
    })
})


module.exports = router