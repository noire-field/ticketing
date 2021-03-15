import mongoose from 'mongoose';
import app from './app';

const Start = async () => {
    if(!process.env.JWT_KEY)
        throw new Error('Unable to load JWT_KEY from env.');

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to mongodb");
    } catch(err) {
        console.log(err);
    }


    app.listen(3000, () => {
        console.log("[Auth] Listening on port 3000!");
    });
}

Start();