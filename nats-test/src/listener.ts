import nats, { Message } from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc2', {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log("Publisher connected to nats");

    const subscription = stan.subscribe('ticket:created');
    subscription.on("message", (data: Message) => {
        console.log('Received: ');
        console.log(data.getSequence());
        console.log(data.getSubject());
        console.log(data.getData());
        console.log(JSON.parse(data.getData() as string));
        console.log(data.getRawData());
    })
});