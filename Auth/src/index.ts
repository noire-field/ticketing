import mongoose from 'mongoose';
import app from './app';

const Start = async () => {
    console.log("[Auth] Starting up...");
    if(!process.env.JWT_KEY)
        throw new Error('Unable to load JWT_KEY from env.');
    if(!process.env.MONGO_URI)
        throw new Error('Unable to load MONGO_URI from env.');

    try {
        await mongoose.connect(process.env.MONGO_URI, {
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