import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: String,
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'tasks' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  }
);

const Comment = mongoose.model('comments', commentSchema);

export default Comment;
