import express from 'express';

const router = express.Router();

router.post('/api/users/sign-out', (req, res) => {
    req.session = null;
    return res.status(200).send({});
});

export { router as signOutRouter }
