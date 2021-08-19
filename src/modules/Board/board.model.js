import { Schema, Document, model, Model } from 'mongoose';

const boardSchema = new Schema(
  {
    isPrivate: Boolean,
    title: String,
    description: String,
    coverUrl: String,
    adminId: { type: Schema.Types.ObjectId, ref: 'users' },
    membersId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, obj) => {
        obj.id = obj._id;
        delete obj._id;
        return obj;
      },
    },
    timestamps: true,
  }
);

const Board = model('boards', boardSchema);

export default Board;
