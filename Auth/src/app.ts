import express from 'express';
require('express-async-errors');

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signUpRouter } from './routes/sign-up';
import { signOutRouter } from './routes/sign-out';
import { ErrorHandler, NotFoundError } from '@nb_tickets/common';


const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false//process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', () => { throw new NotFoundError }); 

app.use(ErrorHandler);

export default app;