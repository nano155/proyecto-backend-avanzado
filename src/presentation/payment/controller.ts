import { Request, Response } from "express";
import { PaymentStripe } from "../../domain/repository/paymentStripe.repository";

export class PaymentStripeController {
  constructor(private readonly paymentStripeRepository: PaymentStripe) {}

  CreatePaymentIntent = (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) return res.status(404).json("id not found!");
    if (typeof id !== 'string') return res.status(404).json("id is incorrect type");

    this.paymentStripeRepository.CreatePaymentIntent(id)
    .then((payment) => res.json(payment))
      .catch((error) => res.status(400).send(error.message));
  };
}
