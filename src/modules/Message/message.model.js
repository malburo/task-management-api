import { model, Schema } from 'mongoose';

const messageSCheme = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'rooms' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    content: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

messageSCheme.virtual('room', {
  ref: 'rooms',
  localField: 'roomId',
  foreignField: '_id',
  justOne: true,
});

messageSCheme.virtual('user', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const Message = model('messages', messageSCheme);

export default Message;
