import express, { Request, Response } from 'express';

const router = express.Router();

router.delete('/api/orders/:orderId', async (res: Response, req: Request) => {
    res.send({});
});

export { router as deleteOrderRouter };