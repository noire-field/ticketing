import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { RequireAuth, ValidateRequest, BadRequestError, NotAuthorizedError, NotFoundError, CurrentUser, OrderStatus } from '@nb_tickets/common';
import { Order } from './../models/Order';
import { Payment } from './../models/Payment';
import { stripe } from './../stripe';
import { natsWrapper } from './../nats-wrapper';
import { PaymentCreatedPublisher } from './../events/publishers/PaymentCreatedPublisher';

const router = express.Router();

router.post('/api/payments', CurrentUser, RequireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], ValidateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if(!order) throw new NotFoundError();

    if(order.userId !== req.currentUser!.id)
        throw new NotAuthorizedError();
    if(order.status === OrderStatus.Cancelled)
        throw new BadRequestError('This order is already cancelled');

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100, // Convert to cent
        source: token
    });

    const payment = Payment.Build({
        orderId,
        stripeId: charge.id
    })

    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).Publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    return res.status(201).send({ success: true, id: payment.id });
})

export { router as createChargeRouter }