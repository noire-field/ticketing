import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompletedEvent, OrderStatus } from '@nb_tickets/common';
import { OrderCancelledPublisher } from './../publishers/OrderCancelledPublisher';
import { queueGroupName } from './QueueGroupName';
import { Order } from '../../models/Order';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        
        if(!order) throw new Error('Order not found');
        if(order.status === OrderStatus.Completed)
            return msg.ack();

        order.set({ 
            status: OrderStatus.Cancelled
        });
        await order.save();

        new OrderCancelledPublisher(this.client).Publish({ 
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        
        msg.ack();
    }
}