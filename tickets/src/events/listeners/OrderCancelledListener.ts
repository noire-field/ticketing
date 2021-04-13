import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@nb_tickets/common';
import { queueGroupName } from './QueueGroupName';
import Ticket from './../../models/Ticket';
import { TicketUpdatedPublisher } from './../publishers/TicketUpdatedPublisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) throw new Error('Ticket not found');

        ticket.set({ orderId: undefined });
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).Publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        msg.ack();
    }
}