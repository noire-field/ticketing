import { Message } from 'node-nats-streaming';
import { Listener, Subjects, OrderCreatedEvent } from '@nb_tickets/common';
import { queueGroupName } from './QueueGroupName';
import { Order } from './../../models/Order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.Build({ 
            id: data.id,
            version: data.version,
            userId: data.userId,
            price: data.ticket.price,
            status: data.status
        });

        await order.save();


        msg.ack();
    }
}