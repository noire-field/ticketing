import { Message } from 'node-nats-streaming';
import Listener from './BaseListener';
import TicketCreatedEvent from './TicketCreatedEvent';
import Subjects from './Subjects';

class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log(`Data:`);
        console.log(data);
        
        msg.ack();
    }
}

export default TicketCreatedListener;