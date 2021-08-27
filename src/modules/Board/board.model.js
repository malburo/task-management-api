import { Schema, Document, model, Model } from 'mongoose';

const boardSchema = new Schema(
  {
    isPrivate: Boolean,
    title: String,
    description: String,
    coverUrl: String,
    adminId: { type: Schema.Types.ObjectId, ref: 'users' },
    membersId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    columnOrder: [{ type: Schema.Types.ObjectId, ref: 'columns' }],
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

boardSchema.virtual('columns', {
  ref: 'columns',
  localField: 'columnOrder',
  foreignField: '_id',
});

const Board = model('boards', boardSchema);

export default Board;
