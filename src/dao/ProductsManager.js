const fs = require('fs');
const path = require('path');
const productsFilePath = path.resolve('src/data/products.json');

class ProductsManager {
    constructor() { }

    static async getProducts() {
        if(fs.existsSync(productsFilePath)){
            return JSON.parse(await fs.promises.readFile(productsFilePath, 'utf8'));
        }else{
            return []
        }
    }

    static async addProduct(product = {}){
        let productos = await this.getProducts()
        let id = 1
        if (productos.length > 0) {
            id = Math.max(...productos.map(d => d.id)) + 1
        }

        let nuevoProducto = {
            id, 
            ...product,
        }

        productos.push(nuevoProducto)
        await fs.promises.writeFile(productsFilePath, JSON.stringify(productos, null, 5))
        return nuevoProducto
    }

    static async updateProduct(id, aModificar={}){
        let productos=await this.getProducts()
        let indiceProducto=productos.findIndex(p=>p.id===id)
        if(indiceProducto===-1){
            throw new Error(`Error: no existe id ${id}`)
        }
        productos[indiceProducto]={
            ...productos[indiceProducto],
            ...aModificar,
            id
        }
        await fs.promises.writeFile(productsFilePath, JSON.stringify(productos, null, 5))
        return productos[indiceProducto]
    }

    static async deleteProduct(id){
        let productos=await this.getProducts()
        let indiceProducto=productos.findIndex(h=>h.id===id)
        if(indiceProducto===-1){
            throw new Error(`Error: no existe id ${id}`)
        }
        let cantidad0=productos.length
        productos=productos.filter(h=>h.id!==id)   
        let cantidad1=productos.length
       
        await fs.promises.writeFile(productsFilePath, JSON.stringify(productos, null, 5))

        return cantidad0-cantidad1
    }
}

module.exports = ProductsManager;