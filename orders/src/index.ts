import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/TicketCreatedListener';
import { TicketUpdatedListener } from './events/listeners/TicketUpdatedListener';
import { ExpirationCompletedListener } from './events/listeners/ExpirationCompletedListener';
import { PaymentCreatedListener } from './events/listeners/PaymentCreatedListener';

const Start = async () => {
    //console.log("[Orders] Starting...");
    
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

        new TicketCreatedListener(natsWrapper.client).Listen();
        new TicketUpdatedListener(natsWrapper.client).Listen();
        new ExpirationCompletedListener(natsWrapper.client).Listen();
        new PaymentCreatedListener(natsWrapper.client).Listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log("[Orders] Connected to mongodb");
    } catch(err) {
        console.log(err);
    }


    app.listen(3000, () => {
        console.log("[Orders] Listening on port 3000!");
    });
}

Start();