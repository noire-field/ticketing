import nats from 'node-nats-streaming';
import TicketCreatedPublisher from './events/TicketCreatedPublisher';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    console.log("Publisher connected to nats");

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.Publish({
            id: 'opera-1',
            title: 'Opera',
            price: 100
        });
    } catch(err) {
        console.log(err);
    }
});