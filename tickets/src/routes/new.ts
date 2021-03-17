import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { RequireAuth, ValidateRequest } from '@nb_tickets/common';
import Ticket from './../models/Ticket';

const router = express.Router();

router.post('/api/tickets', RequireAuth, [
    body("title").notEmpty().withMessage('Title is required'),
    body("price").isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
], ValidateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.Build({ title, price, userId: req.currentUser!.id });

    await ticket.save();

    return res.status(201).send(ticket);
});

export { router as createTicketRouter };