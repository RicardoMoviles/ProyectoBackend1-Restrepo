const productsModel = require('./models/productsModel');

class ProductsManager {
    constructor() { }

    static async getProducts(limit = 10, page = 1, query, sort) {
        try {
        const availability = true;  // Ejemplo de búsqueda por disponibilidad (productos disponibles)

        // Construcción del filtro
        const filter = {
            $or: [
                // Filtro por categoría, si hay una consulta
                query
                    ? {
                        $expr: {
                            $eq: [{ $toLower: "$category" }, query.toLowerCase()]
                        }
                    }
                    : {},

                // Filtro por disponibilidad
                availability !== undefined
                    ? { status: availability }
                    : {}
            ]
        };

        // Construcción del objeto de ordenamiento
        const sorting = sort ? { price: sort === "asc" ? 1 : -1 } : {};

        // Ejecución de la consulta con paginación
        const response = await productsModel.paginate(filter, {
            lean: true,
            limit,
            page,
            sort: sorting
        });


        return {
            status: response ? "success" : "error",
            payload: response.docs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: response.hasPrevPage
                ? `/api/products?limit=${limit}&page=${response.prevPage}`
                : null,
            nextLink: response.hasNextPage
                ? `/api/products?limit=${limit}&page=${response.nextPage}`
                : null,
        };
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw new Error("No se pudieron obtener los productos.");
        }
    }

    static async addProduct(product = {}) {
        let productos = await this.getProducts()
        let id = 1
        if (productos.length > 0) {
            id = Math.max(...productos.map(d => d.id)) + 1
        }
        let nuevoProducto = {
            id,
            ...product,
        }
        try {
            await productsModel.create(nuevoProducto);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw new Error("No se pudo agregar el producto.");
        }
    }

    static async updateProduct(id, aModificar = {}) {
        try {
            const result = await productsModel.findByIdAndUpdate(
                id,
                aModificar,
                { new: true }
            );
            if (!result) throw new Error("Producto no encontrado para actualizar.");
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw new Error("No se pudo actualizar el producto.");
        }
    }

    static async deleteProduct(id) {
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            if (!deletedProduct) throw new Error("Producto no encontrado.");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw new Error("No se pudo eliminar el producto.");
        }
    }
}

module.exports = ProductsManager;