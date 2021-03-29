import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './events/TicketCreatedListener';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log("Publisher connected to nats");

    stan.on('close', () => {
        console.log("Nats closed");
        process.exit();
    });

    new TicketCreatedListener(stan)
    .Listen()
});


process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())

