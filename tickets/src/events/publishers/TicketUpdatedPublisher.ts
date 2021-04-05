import { Publisher, Subjects, TicketUpdatedEvent } from '@nb_tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}