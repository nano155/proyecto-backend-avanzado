import { Router } from "express";
import { PaymentStripeImpl } from "../../service/repository/paymentStripeImpl";
import { PaymentStripeService } from "../../service/dao/mongo/service/paymentStripe.service";
import { PaymentStripeController } from "./controller";


export class PaymentsRoutes {

   

    static get routes(){

        const paymentStripeService = new PaymentStripeService()
        const paymentStripeRepository = new PaymentStripeImpl(paymentStripeService)
        const paymentStripeController = new PaymentStripeController(paymentStripeRepository)


        const router = Router()

        router.post('/payment-intents/:id', paymentStripeController.CreatePaymentIntent )


        return router

    }
}