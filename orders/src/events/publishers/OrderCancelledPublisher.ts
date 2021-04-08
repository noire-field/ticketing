import { Publisher, OrderCancelledEvent, Subjects } from '@nb_tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

    
}