import Queue from 'bull';
import { ExpirationCompletedPublisher } from './../events/publishers/ExpirationCompletedPublisher';
import { natsWrapper } from './../nats-wrapper';

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('Order:Expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    new ExpirationCompletedPublisher(natsWrapper.client).Publish({ orderId: job.data.orderId });
});

export { expirationQueue };