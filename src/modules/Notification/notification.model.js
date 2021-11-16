import { model, Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    content: Schema.Types.Mixed,
    type: String,
    isRead: { type: Boolean, default: false },
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    senderId: { type: Schema.Types.ObjectId, ref: 'users' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'users' },
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
