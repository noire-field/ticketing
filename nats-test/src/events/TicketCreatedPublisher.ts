import Publisher from './BasePublisher';
import Subjects from './Subjects';
import TicketCreatedEvent from './TicketCreatedEvent';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;


}

export default TicketCreatedPublisher;