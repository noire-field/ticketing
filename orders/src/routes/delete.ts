import { RequireAuth, NotFoundError, NotAuthorizedError } from '@nb_tickets/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/Order';
import { OrderCancelledPublisher } from './../events/publishers/OrderCancelledPublisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', RequireAuth,async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if(!order) throw new NotFoundError();
    if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).Publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        },
        version: order.version
    })

    res.status(204).send(order);
});

export { router as deleteOrderRouter };