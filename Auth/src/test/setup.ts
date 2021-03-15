import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from './../app';

let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            Test_SignIn(): Promise<string[]>
        }
    }
}

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
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.Test_SignIn = async () => {
    const email = 'test@test.com';
    const password = 'test123@';

    const response = await request(app).post('/api/users/sign-up').send({
        email, password
    }).expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
}