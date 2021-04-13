import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@nb_tickets/common';
import { queueGroupName } from './QueueGroupName';
import Ticket from './../../models/Ticket';
import { TicketUpdatedPublisher } from './../publishers/TicketUpdatedPublisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) throw new Error('Ticket not found');

        ticket.set({ orderId: data.id });

        await ticket.save();
        await new TicketUpdatedPublisher(this.client).Publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            orderId: ticket.orderId,
            userId: ticket.userId
        });

        msg.ack();
    }
}
