import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders/:orderId', async (res: Response, req: Request) => {
    res.send({});
});

export { router as showOrderRouter };