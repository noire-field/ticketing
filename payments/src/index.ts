import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { OrderCancelledListener } from './events/listeners/OrderCancelledListener';

const Start = async () => {
    console.log("[Payments] Starting...");

    if(!process.env.JWT_KEY)
        throw new Error('Unable to load JWT_KEY from env.');
    if(!process.env.MONGO_URI)
        throw new Error('Unable to load MONGO_URI from env.');
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
        new OrderCancelledListener(natsWrapper.client).Listen();
   
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log("[Payments] Connected to mongodb");
    } catch(err) {
        console.log(err);
    }


    app.listen(3000, () => {
        console.log("[Payments] Listening on port 3000!");
    });
}

Start();