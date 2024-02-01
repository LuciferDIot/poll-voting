import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
    poll_id: Schema.Types.ObjectId;
    option_id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
}

const VoteSchema: Schema = new Schema({
    poll_id: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
    option_id: { type: Schema.Types.ObjectId, ref: 'Option', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IVote>('Vote', VoteSchema);
