import mongoose from 'mongoose';
import request from 'supertest';
import app from './../../app'
import { Order, OrderStatus } from './../../models/Order';
import { Ticket } from './../../models/Ticket';
import { natsWrapper } from './../../nats-wrapper';

it('returns error if ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.Test_SignIn())
        .send({ ticketId })
        .expect(404);

});

it('returns an error if ticket is already reserved', async () => {
    const ticket = Ticket.Build({
        title: "Concert",
        price: 20
    })

    await ticket.save();

    const order = Order.Build({
        ticket,
        userId: 'random_id123',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.Test_SignIn())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.Build({
        title: "Concert",
        price: 20
    })

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.Test_SignIn())
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.Test_SignIn())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('emits an order created event', async () => {
    const ticket = Ticket.Build({
        title: "Concert",
        price: 20
    })

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.Test_SignIn())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});