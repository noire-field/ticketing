import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@nb_tickets/common'; 

interface OrderAttributes {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    price: number;
};

interface OrderDocument extends mongoose.Document {
    version: number;
    status: OrderStatus;
    userId: string;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
    Build(attributes: OrderAttributes): OrderDocument;
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    price: {
        type: Number,
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

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.Build = (attributes: OrderAttributes) => {
    return new Order({
        _id: attributes.id,
        version: attributes.version,
        userId: attributes.userId,
        status: attributes.status,
        price: attributes.price
    });
};

const Order = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);

export { Order, OrderStatus };