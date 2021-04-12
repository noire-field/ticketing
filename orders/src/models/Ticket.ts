import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './Order';

interface TicketAttributes {
    id: string,
    title: string;
    price: number;
}

interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    IsReserved(): Promise<Boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    Build(attrs: TicketAttributes): TicketDocument;
    FindByEvent(event: { id: string, version: number }): Promise<TicketDocument | null>;
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
        }
    }
})

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.Build = (attrs: TicketAttributes) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

TicketSchema.statics.FindByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({ _id: event.id, version: event.version - 1 });
}

TicketSchema.methods.IsReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket: this as TicketDocument,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        }
    })

    return !!existingOrder;
};


const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', TicketSchema);

export { Ticket, TicketDocument };