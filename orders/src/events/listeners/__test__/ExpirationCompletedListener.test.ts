import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompletedEvent, OrderStatus } from '@nb_tickets/common';
import { ExpirationCompletedListener } from './../ExpirationCompletedListener';
import { natsWrapper } from './../../../nats-wrapper';
import { Order } from './../../../models/Order';
import { Ticket } from './../../../models/Ticket';

const Setup = async() => {
    const listener = new ExpirationCompletedListener(natsWrapper.client);

    const ticket = Ticket.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10
    });
    await ticket.save();

    const order = Order.Build({
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order, ticket };
}

it('updates the order status to cancelled', async () => {
    const { listener, data, msg, order, ticket } = await Setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits OrderCancelledEvent', async () => {
    const { listener, data, msg, order, ticket } = await Setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = (JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1];

    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg, order, ticket } = await Setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});