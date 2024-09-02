import { Router } from "express";
import { PaymentStripeImpl } from "../../service/repository/paymentStripeImpl";
import { PaymentStripeService } from "../../service/dao/mongo/service/paymentStripe.service";
import { PaymentStripeController } from "./controller";
import { AuthRequired } from "../../middleware/auth-required";


export class PaymentsRoutes {

   

    static get routes(){

        const paymentStripeService = new PaymentStripeService()
        const paymentStripeRepository = new PaymentStripeImpl(paymentStripeService)
        const paymentStripeController = new PaymentStripeController(paymentStripeRepository)


        const router = Router()

        router.get('/payment-intent', [AuthRequired.authRequired], paymentStripeController.getPaymentIntent)
        router.post('/payment-intent/:id', [AuthRequired.authRequired], paymentStripeController.CreatePaymentIntent)
        router.delete('/payment-deleted',[AuthRequired.authRequired], paymentStripeController.cancelPaymentIntent)
        router.post('/payment-completed/:id',[AuthRequired.authRequired], paymentStripeController.completedPayment )


        return router

    }
}