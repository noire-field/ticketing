import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@nb_tickets/common';
import { OrderCreatedListener } from './../OrderCreatedListener'
import { natsWrapper } from './../../../nats-wrapper';
import Ticket from './../../../models/Ticket';

const Setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.Build({
        title: 'Concert',
        price: 10,
        userId: 'some-user-id'
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: ticket.userId,
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }  
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
}

it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await Setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('calls the acks message', async () => {
    const { listener, ticket, data, msg } = await Setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await Setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdatedData.orderId).toEqual(data.id);
});