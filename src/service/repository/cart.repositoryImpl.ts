import { CreateTicket } from "../../domain/dtos";
import { CartEntity, TicketEntity } from "../../domain/entity";
import { CartRepository } from "../../domain/repository";
import { CartService } from "../dao/mongo";


export class CartRepositoryImpl implements CartRepository{

    constructor(
        public readonly cartService:CartService
    ){}
    createCart(): Promise<CartEntity> {
        return this.cartService.createCart()
    }
    getCartByid(id: string): Promise<CartEntity> {
        return this.cartService.getCartByid(id)
    }
    addProductToCart(cid: string, pid: string): Promise<CartEntity> {
        return this.cartService.addProductToCart(cid, pid)
    }
    deleteProductToCart(cid: string, pid: string): Promise<CartEntity> {
        return this.cartService.deleteProductToCart(cid, pid)
    }
    deleteAllProduct(id: string): Promise<CartEntity> {
        return this.cartService.deleteAllProduct(id)
    }
    updateCartQuantity(cid: string, pid: string, quantity: number): Promise<CartEntity> {
        return this.cartService.updateCartQuantity(cid, pid, quantity)
    }
    generateTicket(ticket: CreateTicket): Promise<TicketEntity> {
        return this.cartService.generateTicket(ticket)
    }

}