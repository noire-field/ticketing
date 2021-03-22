import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log("Publisher connected to nats");

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service')
                        
    const subscription = stan.subscribe('ticket:created', 'accounting-queue-group', options);
    subscription.on("message", (msg: Message) => {
        console.log('Received: ');
        console.log(msg.getSequence());
        console.log(msg.getSubject());
        console.log(msg.getData());
        console.log(JSON.parse(msg.getData() as string));

        msg.ack();
    })
});

stan.on('close', () => {
    console.log("Nats closed");
    process.exit();
});

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())