import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError, NotAuthorizedError, ValidateRequest, RequireAuth } from '@nb_tickets/common';
import Ticket from './../models/Ticket';

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

    return res.send(ticket);
});

export { router as updateTicketRouter };