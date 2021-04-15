import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, Subjects, Listener } from '@nb_tickets/common';
import { queueGroupName } from './QueueGroupName';
import { expirationQueue } from './../../queues/ExpirationQueue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        })

        msg.ack();
    }
}