import Stripe from "stripe";
import { PaymentStripe } from "../../../../domain/datasource";
import { CustomError } from "../../../../domain/error/custom-error";
import { cartModel, ticketModel, userModel } from "../models";
import { envs } from "../../../../config";
import mongoose from "mongoose";

interface Ticket {
    amount: number,
    currency: string
}

export class PaymentStripeService implements PaymentStripe {
    stripe:Stripe;
    constructor(){
        this.stripe = new Stripe(envs.STRIPE_APP_SECRET_KEY)
    }
    
    async getPaymentIntent(userId: string): Promise<any> {
      try {
        const userPayment = await userModel.findById(userId);
        if (!userPayment) {
          throw CustomError.notFound('User not found!');
        }
  
        // Recuperar el PaymentIntent desde Stripe usando el ID almacenado
        const paymentIntent = await this.stripe.paymentIntents.retrieve(userPayment.payment_intentId);
  
        return paymentIntent; // Aquí devuelves todo el objeto del PaymentIntent
      } catch (error) {
        // Manejo de errores
        console.error('Error fetching PaymentIntent:', error);
        throw CustomError.internalServer('Unable to fetch PaymentIntent');
      }
    }
  

  async CreatePaymentIntent(userId:string, id: string): Promise<any> {
    try {
      
      const ticket = await ticketModel.findById(id);
      console.log(ticket);
      
      if (!ticket)
        throw CustomError.notFound("No se encontro ticket para hacer el pago");
    if(typeof ticket.amount !== 'number') throw CustomError.badRequest('type amount must be a number!');

    const ticketStripe:Ticket = {
        amount:ticket.amount * 100,
        currency:'usd'
    }
    const stripe = await this.stripe.paymentIntents.create(ticketStripe)
    await userModel.findByIdAndUpdate(userId,{payment_intentId: stripe.id})
    return stripe
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }

  async cancelPaymentIntent(userId: string): Promise<void> {
    try {
      const user = await userModel.findById(userId)
      if (!user || !user.payment_intentId) {
        throw CustomError.notFound("No payment intent found for user");
      }
        await this.stripe.paymentIntents.cancel(user.payment_intentId);
        await userModel.findByIdAndUpdate(userId,{payment_intentId:null})
    } catch (error) {
      if(error instanceof Error){
        throw CustomError.internalServer(`Failed to cancel PaymentIntent: ${error.message}`);
      }
      throw CustomError.internalServer(`Failed to cancel PaymentIntent: ${error}`);
    }
}

async completedPayment(userId: string, ticket: string):Promise<any>{
  try {
    const user = await userModel.findById(userId)
    if (!user || !user.payment_intentId) {
      throw CustomError.notFound("No payment intent found for user");
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(user.payment_intentId);

    if (paymentIntent.status !== 'succeeded') {
      throw CustomError.badRequest("PaymentIntent has not been completed successfully");
    }
    await userModel.findByIdAndUpdate(userId, { payment_intentId: null });
    
    const cart = await cartModel.findById(user.cart);
      if (!cart)
        throw CustomError.badRequest(
          `No se encontro ningun Cart con el ID ${user.cart}`
        );
      cart.products.splice(0, cart.products.length)
      await cart.save();
    
      await userModel.findByIdAndUpdate(userId,{payment_intentId:null})   
      await ticketModel.findOneAndDelete({_id:ticket})
  } catch (error) {
    if(error instanceof Error){
      throw CustomError.internalServer(`Failed to cancel PaymentIntent: ${error.message}`);
    }
    throw CustomError.internalServer(`Failed to cancel PaymentIntent: ${error}`);
  }
}
}
