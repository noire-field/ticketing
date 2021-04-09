import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@nb_tickets/common';
import { Ticket } from './../../models/Ticket';
import { queueGroupName } from './QueueGroupName';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        
        const ticket = Ticket.Build({
            id, title, price
        });

        await ticket.save();

        msg.ack();
    }
}