const { Router } = require("express")
const router = Router()
const CartsManager = require("../dao/CartsManager");


// Crear un nuevo carrito
router.post('/', async (req,res)=>{
    try {
        const newCart = await CartsManager.addCart();  
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating cart' });  
    }
});

// Obtener productos de un carrito por ID
router.get('/:cid',async (req,res)=>{
    let { cid } = req.params;
    cid = Number(cid)
    const carts = await CartsManager.getCarts();
    const cart = carts.find(c => c.id == cid);
    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ error: `Cart con id ${cid} no encontrado` })
    }
    res.setHeader('Content-Type','application/json')
    res.status(200).json(cart)
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req,res)=>{
    try {
        let cartId = req.params.cid;
        cartId = Number(cartId)
        let productId = req.params.pid;
        productId = Number(productId)
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
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error adding product to cart`,
                detalle:`${error.message}`
            }
        )
    }
});

module.exports = router