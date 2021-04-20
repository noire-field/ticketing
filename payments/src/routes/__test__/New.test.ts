import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@nb_tickets/common';
import app from './../../app';
import { Order } from './../../models/Order';
import { Payment } from './../../models/Payment';
import { stripe } from './../../stripe';

//jest.mock('./../../stripe');

it('returns 404 when paying for non-exist order', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.Test_SignIn())
        .send({ 
            token: 'something', 
            orderId: mongoose.Types.ObjectId().toHexString() 
        })
        .expect(404);
});

it('returns 401 when paying for other not belong to the user', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.Test_SignIn())
        .send({ 
            token: 'something', 
            orderId: order.id
        })
        .expect(401);
});

it('returns 400 when paying for cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.Test_SignIn(userId))
        .send({ 
            token: 'something', 
            orderId: order.id
        })
        .expect(400);
});

it('returns 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.Test_SignIn(userId))
        .send({ 
            token: 'tok_visa', 
            orderId: order.id
        })
        .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === 20 * 100
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });
    
    expect(payment).not.toBeNull();
})