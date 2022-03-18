import { model, Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'rooms' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
    type: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

messageSchema.virtual('user', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const Message = model('messages', messageSchema);

export default Message;
