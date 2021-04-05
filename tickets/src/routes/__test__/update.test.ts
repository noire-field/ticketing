import mongoose, { mongo } from 'mongoose';
import request from 'supertest';
import app from './../../app';

import { natsWrapper } from './../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.Test_SignIn())
        .send({
            title: 'Valid Title',
            price: 100
        })
        .expect(404);
});

it('returns a 401 if the user is not authendicated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Valid Title',
            price: 100
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const id = mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.Test_SignIn())
        .send({
            title: 'Valid Title',
            price: 100
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.Test_SignIn())
        .send({
            title: 'Valid Title 2',
            price: 200
        })
        .expect(401);
});

it('returns a 400 if the user provides invalid title or price', async () => {
    let cookies = global.Test_SignIn();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookies)
        .send({
            title: 'Valid Title',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: '',
            price: 200
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: 'ABC',
            price: -1
        })
        .expect(400); 
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({ })
        .expect(400); 
});

it('updates the ticket provided valid inputs', async () => {
    let cookies = global.Test_SignIn();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookies)
        .send({
            title: 'Valid Title',
            price: 100
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: 'New Title',
            price: 200
        })
        .expect(200);
    
    const getResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(getResponse.body.title).toEqual('New Title');
    expect(getResponse.body.price).toEqual(200);
});

it('publishes an event', async () => {
    let cookies = global.Test_SignIn();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookies)
        .send({
            title: 'Valid Title',
            price: 100
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookies)
        .send({
            title: 'New Title',
            price: 200
        })
        .expect(200);
        
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})