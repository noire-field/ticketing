import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { ValidateRequest } from './../middlewares/validate-request'

import { User } from './../models/User';

import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/sign-up', [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({ min: 4, max: 32 }).withMessage("Password must be between 4 and 32 characters")
], ValidateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });

    if(existingUser)
        throw new BadRequestError('Email in use');

    const user = User.Build({ email, password });

    await user.save();

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    };

    return res.status(200).send({ success: true, data: user });
});

export { router as signUpRouter }
