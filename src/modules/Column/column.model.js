import { model, Schema } from 'mongoose';

const ColumnSchema = new Schema(
  {
    title: String,
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    taskOrder: [{ type: Schema.Types.ObjectId, ref: 'tasks' }],
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

ColumnSchema.virtual('tasks', {
  ref: 'tasks',
  localField: '_id',
  foreignField: 'columnId',
});

const Column = model('columns', ColumnSchema);

export default Column;
