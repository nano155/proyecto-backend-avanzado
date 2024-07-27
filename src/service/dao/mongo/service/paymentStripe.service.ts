import Stripe from "stripe";
import { PaymentStripe } from "../../../../domain/datasource";
import { CustomError } from "../../../../domain/error/custom-error";
import { ticketModel } from "../models";
import { envs } from "../../../../config";

interface Ticket {
    amount: number,
    currency: string
}

export class PaymentStripeService implements PaymentStripe {
    stripe:Stripe;
    constructor(){
        this.stripe = new Stripe(envs.STRIPE_APP_SECRET_KEY)
    }

  async CreatePaymentIntent(id: string): Promise<any> {
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket)
        throw CustomError.notFound("No se encontro ticket para hacer el pago");
    if(typeof ticket.amount !== 'number') throw CustomError.badRequest('type amount must be a number!');

    const ticketStripe:Ticket = {
        amount:ticket.amount,
        currency:'usd'
    }
    const stripe = await this.stripe.paymentIntents.create(ticketStripe)

    console.log(stripe);
    return stripe
    } catch (error) {
      throw CustomError.internalServer(`Internal error ${error}`);
    }
  }
}
