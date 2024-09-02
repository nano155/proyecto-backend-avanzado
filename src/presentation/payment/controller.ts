import { Request, Response } from "express";
import { PaymentStripe } from "../../domain/repository/paymentStripe.repository";
import { AuthenticatedRequest } from "../../middleware/auth-required";

export class PaymentStripeController {
  constructor(private readonly paymentStripeRepository: PaymentStripe) {}

  getPaymentIntent = (req:AuthenticatedRequest, res:Response) =>{
    const userId = req.user?.payload;
    if (!userId) return res.status(404).json("User ID not found!");
    this.paymentStripeRepository.getPaymentIntent(userId.id)
    .then((payment) => res.json(payment))
      .catch((error) => res.status(400).send(error.message));
  }

  CreatePaymentIntent = (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.payload;
    if (!userId) return res.status(404).json("User ID not found!");
    const id = req.params.id;
    if (!id) return res.status(404).json("id not found!");
    if (typeof id !== 'string') return res.status(404).json("id is incorrect type");

    this.paymentStripeRepository.CreatePaymentIntent(userId.id, id)
    .then((payment) => res.json(payment))
      .catch((error) => res.status(400).send(error.message));
  };

  cancelPaymentIntent = (req:AuthenticatedRequest, res:Response)=>{
    const userId = req.user?.payload;
    if (!userId) return res.status(404).json("User ID not found!");

    this.paymentStripeRepository.cancelPaymentIntent(userId.id)
    .then(payment => res.json('Payment deleted!'))
    .catch((error) => res.status(400).send(error.message));

  }

  completedPayment = (req:AuthenticatedRequest, res:Response) =>{

    const userId = req.user?.payload
    if (!userId) return res.status(404).json("User ID not found!");
    const ticketId = req.params.id
    if (!ticketId) return res.status(404).json("User ID not found!");

    this.paymentStripeRepository.completedPayment(userId.id, ticketId)
    .then(payment => res.json('Payment Completed'))
    .catch((error) => res.status(400).send(error.message));
  }
}
