import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from './../services/password';

import { ValidateRequest } from './../middlewares/validate-request';
import { BadRequestError } from './../errors/bad-request-error';

import { User } from './../models/User';

const router = express.Router();

router.post('/api/users/sign-in', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must fill in the password')
], ValidateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if(!existingUser)
        throw new BadRequestError('This user can not be found');

    const passwordsMatch = await Password.Compare(existingUser.password, password);
    if(!passwordsMatch)
        throw new BadRequestError('Password is invalid');

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
});

export { router as signInRouter }
