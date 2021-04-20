import { Subjects, PaymentCreatedEvent, Publisher } from '@nb_tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}