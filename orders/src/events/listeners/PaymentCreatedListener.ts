import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent } from '@nb_tickets/common';
import { queueGroupName } from './QueueGroupName';
import { Order, OrderStatus } from './../../models/Order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) throw new Error('Unable to find order');

        order.set({ status: OrderStatus.Completed });
        await order.save();

        msg.ack();
    }
}