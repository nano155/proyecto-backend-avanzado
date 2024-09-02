
export abstract class PaymentStripe {
    abstract CreatePaymentIntent(userId:string, id:string) :Promise<any>
    abstract cancelPaymentIntent(userId:string) :Promise<any>
    abstract getPaymentIntent(userId:string):Promise<any>
    abstract completedPayment(userId: string, ticketId: string):Promise<any>
}