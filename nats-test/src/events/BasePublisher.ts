import { Stan } from 'node-nats-streaming';
import Subjects from './Subjects';

interface Event {
    subject: Subjects;
    data: any;
}

abstract class Publisher<T extends Event> {
    private client: Stan;
    abstract subject: T['subject'];

    constructor(client: Stan) {
        this.client = client
    }

    Publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if(err) return reject(err);
                
                resolve();
            });
        });
    }
}

export default Publisher;