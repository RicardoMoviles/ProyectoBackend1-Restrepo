const Router=require('express').Router;
const ProductsManager = require("../dao/productsManager");
const router=Router()


router.get('/', async (req,res)=>{
    let products;
    try {
        products = await ProductsManager.getProducts();
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
    let titulo ="Lista de productos"
    res.setHeader('Content-Type','text/html');
    res.status(200).render("home", {
        titulo,
        products: products
    });
})

router.get('/realtimeproducts',async (req,res)=>{
    let products;
    try {
        products = await ProductsManager.getProducts();
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

    res.setHeader('Content-Type','text/html')
    res.status(200).render("realTimeProducts", {
        realEstilo:"real-styles",
        products: products
    })
})


module.exports=router