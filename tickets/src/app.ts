import express from 'express';
require('express-async-errors');

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { ErrorHandler, NotFoundError, CurrentUser } from '@nb_tickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false//process.env.NODE_ENV !== 'test'
}));
app.use(CurrentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.all('*', () => { throw new NotFoundError }); 

app.use(ErrorHandler);

export default app;