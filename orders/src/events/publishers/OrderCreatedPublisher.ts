import { Publisher, OrderCreatedEvent, Subjects } from '@nb_tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}