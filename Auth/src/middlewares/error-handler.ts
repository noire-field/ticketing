import { Request, Response, NextFunction } from 'express';
import { validationResult, Result } from 'express-validator';

import { CustomError } from '../errors/custom-error';

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError)
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    console.log(err);
    res.status(400).send({
        success: false,
        message: "Something went wrong"
    });
}