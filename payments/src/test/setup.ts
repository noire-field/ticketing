import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            Test_SignIn(id?: string): string[]
        }
    }
}

jest.mock('./../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51Ii8zqF9hR9sqoGw3TXBnDbi9SGixCTLci70jgIpZZcROMHVcSXLsrnmH5OsQOG5JtKYhXxDYtRRIXzohBh2Br4a00uHGF2Tjl';

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

global.Test_SignIn = (userId?: string) => {
    const payload = {
        id: userId || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
        password: 'test123@'
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    
    const sessionObj = { jwt: token };
   
    const base64 = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

    return [`express:sess=${base64}`];
}