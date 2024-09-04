"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const custom_error_1 = require("../../../../domain/error/custom-error");
const models_1 = require("../models");
const config_1 = require("../../../../config");
class PaymentStripeService {
    constructor() {
        this.stripe = new stripe_1.default(config_1.envs.STRIPE_APP_SECRET_KEY);
    }
    async getPaymentIntent(userId) {
        try {
            const userPayment = await models_1.userModel.findById(userId);
            if (!userPayment) {
                throw custom_error_1.CustomError.notFound('User not found!');
            }
            // Recuperar el PaymentIntent desde Stripe usando el ID almacenado
            const paymentIntent = await this.stripe.paymentIntents.retrieve(userPayment.payment_intentId);
            return paymentIntent; // Aquí devuelves todo el objeto del PaymentIntent
        }
        catch (error) {
            // Manejo de errores
            console.error('Error fetching PaymentIntent:', error);
            throw custom_error_1.CustomError.internalServer('Unable to fetch PaymentIntent');
        }
    }
    async CreatePaymentIntent(userId, id) {
        try {
            const ticket = await models_1.ticketModel.findById(id);
            console.log(ticket);
            if (!ticket)
                throw custom_error_1.CustomError.notFound("No se encontro ticket para hacer el pago");
            if (typeof ticket.amount !== 'number')
                throw custom_error_1.CustomError.badRequest('type amount must be a number!');
            const ticketStripe = {
                amount: ticket.amount * 100,
                currency: 'usd'
            };
            const stripe = await this.stripe.paymentIntents.create(ticketStripe);
            await models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: stripe.id });
            return stripe;
        }
        catch (error) {
            throw custom_error_1.CustomError.internalServer(`Internal error ${error}`);
        }
    }
    async cancelPaymentIntent(userId) {
        try {
            const user = await models_1.userModel.findById(userId);
            if (!user || !user.payment_intentId) {
                throw custom_error_1.CustomError.notFound("No payment intent found for user");
            }
            await this.stripe.paymentIntents.cancel(user.payment_intentId);
            await models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: null });
        }
        catch (error) {
            if (error instanceof Error) {
                throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error.message}`);
            }
            throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error}`);
        }
    }
    async completedPayment(userId, ticket) {
        try {
            const user = await models_1.userModel.findById(userId);
            if (!user || !user.payment_intentId) {
                throw custom_error_1.CustomError.notFound("No payment intent found for user");
            }
            const paymentIntent = await this.stripe.paymentIntents.retrieve(user.payment_intentId);
            if (paymentIntent.status !== 'succeeded') {
                throw custom_error_1.CustomError.badRequest("PaymentIntent has not been completed successfully");
            }
            await models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: null });
            const cart = await models_1.cartModel.findById(user.cart);
            if (!cart)
                throw custom_error_1.CustomError.badRequest(`No se encontro ningun Cart con el ID ${user.cart}`);
            cart.products.splice(0, cart.products.length);
            await cart.save();
            await models_1.userModel.findByIdAndUpdate(userId, { payment_intentId: null });
            await models_1.ticketModel.findOneAndDelete({ _id: ticket });
        }
        catch (error) {
            if (error instanceof Error) {
                throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error.message}`);
            }
            throw custom_error_1.CustomError.internalServer(`Failed to cancel PaymentIntent: ${error}`);
        }
    }
}
exports.PaymentStripeService = PaymentStripeService;
