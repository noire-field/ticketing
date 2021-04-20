import mongoose from 'mongoose';

interface PaymentAttributes {
    orderId: string;
    stripeId: string;
}

interface PaymentDocument extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
    Build(attributes: PaymentAttributes): PaymentDocument;
}

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

PaymentSchema.statics.Build = (attributes: PaymentAttributes) => {
    return new Payment(attributes);
}

const Payment = mongoose.model<PaymentDocument, PaymentModel>('Payment', PaymentSchema); 

export { Payment };