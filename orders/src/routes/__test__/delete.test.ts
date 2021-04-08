import request from 'supertest';
import app from './../../app';
import { Order, OrderStatus } from './../../models/Order';
import { Ticket } from './../../models/Ticket';
import { natsWrapper } from './../../nats-wrapper';

it('marks an order as cancelled', async () => {
    const ticket = Ticket.Build({
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

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits an order cancelled event', async () => {
    const ticket = Ticket.Build({
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

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});