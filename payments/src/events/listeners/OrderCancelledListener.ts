import { Message } from 'node-nats-streaming';
import { Listener, Subjects, OrderCancelledEvent, OrderStatus } from '@nb_tickets/common';
import { queueGroupName } from './QueueGroupName';
import { Order } from './../../models/Order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if(!order) throw new Error('Order can not be found');

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}