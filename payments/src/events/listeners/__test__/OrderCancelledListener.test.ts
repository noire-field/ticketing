
import mongoose, { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@nb_tickets/common';
import { OrderCancelledListener } from '../OrderCancelledListener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/Order';

const Setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.Build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'noire-field',
        price: 10
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString()
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order };
}

it('update the status of the order', async () => {
    const { listener, data, msg, order } = await Setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg } = await Setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
