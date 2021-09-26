import { Schema } from "mongoose"

const messageCheme = new Schema(
    {
        roomId: { type: Scheme.Types.ObjectId, ref: 'rooms' },
        userId: { type: Schema.Types.ObjectId, ref: 'users' },
        content: String
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false
        },
        timestamps: true,
    }
);

const Message = model('messages', messageCheme);

export default Message;