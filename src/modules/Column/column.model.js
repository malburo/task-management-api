import { Schema, Document, model, Model } from 'mongoose';

const ColumnSchema = new Schema(
  {
    title: String,
    pos: { type: Number, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
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

const Column = model('columns', ColumnSchema);

export default List;
