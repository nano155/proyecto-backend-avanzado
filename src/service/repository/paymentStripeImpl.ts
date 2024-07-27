import { PaymentStripe } from "../../domain/repository/paymentStripe.repository";
import { PaymentStripeService } from '../dao/mongo/service/paymentStripe.service';



export class PaymentStripeImpl implements PaymentStripe{
    
    constructor(
       public readonly paymentStripeService:PaymentStripeService
    ){}

    CreatePaymentIntent(id: string): Promise<any> {
       return this.paymentStripeService.CreatePaymentIntent(id)
    }

}