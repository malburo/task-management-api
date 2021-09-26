import { model, Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: String,
    description: String,
    coverUrl: String,
    deadlineDay: Date,
    reminderDay: Date,
    columnId: { type: Schema.Types.ObjectId, ref: 'columns' },
    repicipentsId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    labelsId: [{ type: Schema.Types.ObjectId, ref: 'labels' }],
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
