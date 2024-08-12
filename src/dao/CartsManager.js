const fs = require('fs');
//const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cartsFilePath = path.resolve('src/data/carts.json');
const ProductsManager = require("../dao/productsManager");

class CartsManager{
    constructor(){}

    static async getCarts() {
        if (fs.existsSync(cartsFilePath)) {
            return JSON.parse(await fs.promises.readFile(cartsFilePath, 'utf-8'));
        } else {
            return [];
        }
    }

    static async addCart() {
        const carts = await this.getCarts();
        let id = 1
        if (carts.length > 0) {
            id = Math.max(...carts.map(c => c.id)) + 1
        }
        const newCart = {
            //id: uuidv4(), 
            id,
            products: []
        };

        carts.push(newCart);

        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 5));

        return newCart;
    }

    static async getCartProducts(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cartId);

            if (!cart) {
                return null;
            }

            return cart.products;
        } catch (error) {
            console.error('Error retrieving cart products:', error.message);
            throw new Error('Error retrieving cart products');
        }
    }

    static async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found.`);
        }
    
        const products = await ProductsManager.getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error(`Product with id ${productId} not found.`);
        }
    
        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }
    
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 5));
    
        return cart.products;
    }
}

module.exports = CartsManager;