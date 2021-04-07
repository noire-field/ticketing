import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequireAuth, ValidateRequest } from '@nb_tickets/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/orders', RequireAuth, [
    body('ticketId')
        .not().isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId must be provided')
], ValidateRequest, async (res: Response, req: Request) => {
    res.send({});
});

export { router as newOrderRouter };