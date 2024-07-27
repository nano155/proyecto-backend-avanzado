
export abstract class PaymentStripe {
    abstract CreatePaymentIntent(id:string) :Promise<any>
}