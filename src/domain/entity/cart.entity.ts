

export class CartEntity {
    id: string;
    products: { quantity: number; productId: string }[];
  
    constructor(id: string, products: { quantity: number; productId: string }[]) {
      this.id = id;
      this.products = products;
    }
  
    static fromObject(cart: { id: string; products?: any[] }): CartEntity {
      const { id, products = [] } = cart;
      return new CartEntity(id, products);
    }
  }