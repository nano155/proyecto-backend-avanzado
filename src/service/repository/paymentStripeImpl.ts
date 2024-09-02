import { PaymentStripe } from "../../domain/repository/paymentStripe.repository";
import { PaymentStripeService } from '../dao/mongo/service/paymentStripe.service';



export class PaymentStripeImpl implements PaymentStripe{
    
    constructor(
       public readonly paymentStripeService:PaymentStripeService
    ){}
   completedPayment(userId: string, ticketId: string): Promise<any> {
      return this.paymentStripeService.completedPayment(userId, ticketId)
   }
   getPaymentIntent(userId:string): Promise<any> {
      return this.paymentStripeService.getPaymentIntent(userId)
   }
   cancelPaymentIntent(userId: string): Promise<any> {
      return this.paymentStripeService.cancelPaymentIntent(userId)
   }
    CreatePaymentIntent(userId:string, id: string): Promise<any> {
       return this.paymentStripeService.CreatePaymentIntent(userId, id)
    }
}