import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@nb_tickets/common';
import { TicketUpdatedListener } from './../TicketUpdatedListener';
import { natsWrapper } from './../../../nats-wrapper';
import { Ticket } from './../../../models/Ticket';

const Setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.Build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 10
    })
    
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "New Concert",
        price: 20,
        userId: 'some-user-id'
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg };
}

it('finds, update and saves the ticket', async () => {
    const { listener, data, ticket, msg } = await Setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await Setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped a version number', async () => {
    const { listener, data, ticket, msg } = await Setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch(err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
});