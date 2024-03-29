import { model, Schema } from 'mongoose';

const ColumnSchema = new Schema(
  {
    title: String,
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    taskOrder: [{ type: Schema.Types.ObjectId, ref: 'tasks', default: [] }],
    workflows: [{ type: Schema.Types.ObjectId, ref: 'columns', default: [] }],
    workflowX: Number,
    workflowY: Number,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
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
