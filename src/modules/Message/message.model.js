import { model, Schema } from 'mongoose';

const messageSCheme = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'rooms' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    type: Number,
    content: String,
    formId: { type: Schema.Types.ObjectId, ref: 'select-form-messages' },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

messageSCheme.virtual('form', {
  ref: 'select-form-messages',
  localField: 'formId',
  foreignField: '_id',
  justOne: true,
});

messageSCheme.virtual('room', {
  ref: 'rooms',
  localField: 'roomId',
  foreignField: '_id',
  justOne: true,
});

messageSCheme.virtual('postedBy', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const Message = model('messages', messageSCheme);

export default Message;
