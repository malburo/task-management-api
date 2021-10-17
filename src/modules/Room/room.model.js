import { model, Schema } from 'mongoose';

const roomScheme = new Schema(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    userId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    name: String,
    isGeneral: Boolean,
    newMessage: Number,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

roomScheme.virtual('board', {
  ref: 'boards',
  localField: 'boardId',
  foreignField: '_id',
  justOne: true,
});

roomScheme.virtual('members', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
});

const Room = model('rooms', roomScheme);

export default Room;
