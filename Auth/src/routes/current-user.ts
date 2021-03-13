import express from 'express';

import { CurrentUser } from './../middlewares/current-user';
import { RequireAuth } from './../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/current-user', CurrentUser, RequireAuth, (req, res) => {
    
    return res.status(200).send({ currentUser: req.currentUser });
});

export { router as currentUserRouter }
