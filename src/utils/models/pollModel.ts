import mongoose, { Schema, Document } from 'mongoose';

export interface IPoll extends Document {
    title: string;
    description: string;
    category_id: Schema.Types.ObjectId;
}

const PollSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

export default mongoose.model<IPoll>('Poll', PollSchema);
