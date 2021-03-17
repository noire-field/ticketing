import mongoose from 'mongoose';
import { Password } from './../services/password';

interface UserAttributes {
    email: string;
    password: string;
};

interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<any> {
    Build(attributes: UserAttributes): UserDocument;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

UserSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.ToHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
});

UserSchema.statics.Build = (attributes: UserAttributes) => {
    return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export { User };