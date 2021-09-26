import { model, Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    notificationType: String,
    content: String,
    isRead: Boolean,
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    receiversId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    taskOrder: [{ type: Schema.Types.ObjectId, ref: 'tasks' }],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

const Notification = model('notifications', NotificationSchema);

export default Notification;
