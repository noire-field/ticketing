import express from 'express';

import { CurrentUser } from './../middlewares/current-user';

const router = express.Router();

router.get('/api/users/current-user', CurrentUser, (req, res) => {
    
    return res.status(200).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter }
