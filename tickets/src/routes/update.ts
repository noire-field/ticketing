import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError, NotAuthorizedError, ValidateRequest, RequireAuth } from '@nb_tickets/common';
import Ticket from './../models/Ticket';

import { natsWrapper } from './../nats-wrapper';
import { TicketUpdatedPublisher } from './../events/publishers/TicketUpdatedPublisher';

const router = express.Router();

router.put('/api/tickets/:id', RequireAuth, [
    body('title').notEmpty().withMessage("Title is required"),
    body('price').isFloat({ gt: 0 }).withMessage("Price must be greater than zero")
], ValidateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) throw new NotFoundError();

    if(ticket.userId !== req.currentUser!.id)
        throw new NotAuthorizedError();

    const { title, price } = req.body;

    ticket.set({ title, price });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).Publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    return res.send(ticket);
});

export { router as updateTicketRouter };