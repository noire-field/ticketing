import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { User } from './../models/User';

import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/sign-up', [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({ min: 4, max: 32 }).withMessage("Password must be between 4 and 32 characters")
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty())
        throw new RequestValidationError(errors.array())

    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });

    if(existingUser)
        throw new BadRequestError('Email in use');

    const user = User.Build({  
        email,
        password
    });

    await user.save();

    return res.status(200).send({ success: true, data: user });
});

export { router as signUpRouter }