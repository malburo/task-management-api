import { model, Schema } from 'mongoose';

const boardSchema = new Schema(
  {
    title: String,
    description: String,
    coverUrl: String,
    isPrivate: Boolean,
    columnOrder: [{ type: Schema.Types.ObjectId, ref: 'columns' }],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

boardSchema.virtual('columns', {
  ref: 'columns',
  localField: '_id',
  foreignField: 'boardId',
});

boardSchema.virtual('members', {
  ref: 'members',
  localField: '_id',
  foreignField: 'boardId',
});

const Board = model('boards', boardSchema);

export default Board;
