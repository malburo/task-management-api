import { model, Schema } from 'mongoose';

const roomSchema = new Schema(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    usersId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    name: String,
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

roomSchema.virtual('board', {
  ref: 'boards',
  localField: 'boardId',
  foreignField: '_id',
  justOne: true,
});

roomSchema.virtual('members', {
  ref: 'users',
  localField: 'usersId',
  foreignField: '_id',
});

roomSchema.virtual('message', {
  ref: 'messages',
  localField: '_id',
  foreignField: 'roomId',
});

const Room = model('rooms', roomSchema);

export default Room;
