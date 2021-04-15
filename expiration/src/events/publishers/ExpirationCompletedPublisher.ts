import { ExpirationCompletedEvent, Subjects, Publisher } from '@nb_tickets/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}