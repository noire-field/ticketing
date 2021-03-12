import express from 'express';
require('express-async-errors');

import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signUpRouter } from './routes/sign-up';
import { signOutRouter } from './routes/sign-out';
import { ErrorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error'; 


const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', () => { throw new NotFoundError }); 

app.use(ErrorHandler);

const Start = async () => {
    if(!process.env.JWT_KEY)
        throw new Error('Unable to load JWT_KEY from env.');

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to mongodb");
    } catch(err) {
        console.log(err);
    }


    app.listen(3000, () => {
        console.log("[Auth] Listening on port 3000!");
    });
}

Start();