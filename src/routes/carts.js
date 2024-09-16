const { Router } = require("express")
const router = Router()
const CartsManager = require("../dao/CartsManager");
const { isValidObjectId } = require("mongoose");


// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartsManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating cart' });
    }
});

// Obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    let { cid } = req.params;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ message: "ID de carrito inválido" });
    }
    try {
        const cart = await CartsManager.getCartProducts(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Cart con id ${cid} no encontrado` })
        }
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json(cart)
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )    
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;

        if (!cartId || !productId) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios" });
        }

        if (!isValidObjectId(cartId) || !isValidObjectId(productId)) {
            return res.status(400).json({ message: "ID de carrito o producto inválido" });
        }

        const updatedProducts = await CartsManager.addProductToCart(cartId, productId);
        res.status(200).json(updatedProducts);
    } catch (error) {
        if (error.message.includes('Cart with id')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Product with id')) {
            return res.status(404).json({ error: error.message });
        }
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error adding product to cart`,
                detalle: `${error.message}`
            }
        )
    }
});

module.exports = router