import mongoose, { Schema, Document } from "mongoose";

export interface IPoll extends Document {
    title: string;
    description: string;
    category_id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    // img: Schema.Types.Buffer;
}

const PollSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
    // img: { type: Schema.Types.Buffer },
});

export const Poll = mongoose.models.Poll || mongoose.model("Poll", PollSchema);