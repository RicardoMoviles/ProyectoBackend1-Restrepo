import { carts } from "../data/carts.json";

class CartsManager{
    constructor(){}

    static async getProducts(){
        return carts
    }
}

export default CartsManager;