import mongoose from 'mongoose';
import { OrderStatus } from '@nb_tickets/common'
import { TicketDocument } from './Ticket';

interface OrderAttributes {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
};

interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
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
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


OrderSchema.statics.Build = (attributes: OrderAttributes) => {
    return new Order(attributes);
};

const Order = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);

export { Order, OrderStatus };