
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@nb_tickets/common';
import { OrderCancelledListener } from './../OrderCancelledListener'
import { natsWrapper } from './../../../nats-wrapper';
import Ticket from './../../../models/Ticket';

const Setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.Build({
        title: 'Concert',
        price: 10,
        userId: 'some-user-id'
    });

    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg, orderId };
}

it('updates, publishes an event and acks an message', async () => {
    const { listener, ticket, data, msg, orderId} = await Setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});