import request from 'supertest';
import mongoose from 'mongoose';
import app from './../../app';
import { Ticket } from './../../models/Ticket';

it('fetches the order', async () => {
    const ticket = Ticket.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 20
    });

    await ticket.save();

    const user = global.Test_SignIn();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one tries to fetch other\'s order.', async () => {
    const ticket = Ticket.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 20
    });

    await ticket.save();

    const user = global.Test_SignIn();
    const userTwo = global.Test_SignIn();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userTwo)
        .send()
        .expect(401);
});