import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            Test_SignIn(): string[]
        }
    }
}

jest.mock('./../nats-wrapper');

beforeAll(async () => {
    process.env.JWT_KEY = 'testkey123@';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.Test_SignIn = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
        password: 'test123@'
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    
    const sessionObj = { jwt: token };
   
    const base64 = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

    return [`express:sess=${base64}`];
}