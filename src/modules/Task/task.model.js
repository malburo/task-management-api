import { model, Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: String,
    description: String,
    coverUrl: String,
    deadlineDay: { type: Date, default: null },
    reminderDay: { type: Date, default: null },
    columnId: { type: Schema.Types.ObjectId, ref: 'columns' },
    repicipentsId: [{ type: Schema.Types.ObjectId, ref: 'users', default: [] }],
    labelsId: [{ type: Schema.Types.ObjectId, ref: 'labels', default: [] }],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

const Task = model('tasks', taskSchema);

export default Task;
