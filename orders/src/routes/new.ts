import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequireAuth, ValidateRequest, NotFoundError, OrderStatus, BadRequestError } from '@nb_tickets/common';
import { body } from 'express-validator';
import { Order } from './../models/Order';
import { Ticket } from './../models/Ticket';

const router = express.Router();

const EXPIRATION_WINDOW_SECOND = 15 * 60;

router.post('/api/orders', RequireAuth, [
    body('ticketId')
        .not().isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId must be provided')
], ValidateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    
    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) throw new NotFoundError();

    // Is this ticket reserved?
    if(await ticket.IsReserved()) throw new BadRequestError('Ticket is already reserved');

    // Calculate expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND);

    // Build and save Order
    const order = Order.Build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        ticket: ticket,
        expiresAt: expiration
    })

    await order.save();

    res.status(201).send(order);
});

export { router as newOrderRouter };