import mongoose, { Schema, Document } from 'mongoose';

export interface IOption extends Document {
    option_text: string;
    poll_id: Schema.Types.ObjectId;
}

const OptionSchema: Schema = new Schema({
    option_text: { type: String, required: true },
    poll_id: { type: Schema.Types.ObjectId, ref: 'Poll', required: true }
});

export const Option = mongoose.models.Option || mongoose.model('Option', OptionSchema);
