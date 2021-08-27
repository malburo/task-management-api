import { Schema, Document, model, Model } from 'mongoose';

const taskSchema = new Schema(
  {
    content: String,
    coverUrl: String,
    columnId: { type: Schema.Types.ObjectId, ref: 'columns' },
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

const Task = model('tasks', taskSchema);

export default Task;
