import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { natsWrapper } from './nats-wrapper';

const Start = async () => {
    console.log("[Expiration] Starting...");

    if(!process.env.NATS_URL)
        throw new Error('Unable to load NATS_URL from env.');
    if(!process.env.NATS_CLIENT_ID)
        throw new Error('Unable to load NATS_CLIENT_ID from env.');
    if(!process.env.NATS_CLUSTER_ID)
        throw new Error('Unable to load NATS_CLUSTER_ID from env.');

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log("Nats closed");
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).Listen();

        console.log("[Expiration] listening");
    } catch(err) {
        console.log(err);
    }
}

Start();