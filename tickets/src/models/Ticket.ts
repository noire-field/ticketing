import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttributes {
    title: string;
    price: number;
    userId: string;
}

interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    Build(attrs: TicketAttributes): TicketDocument;
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
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
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', TicketSchema);

export default Ticket;