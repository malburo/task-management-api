import { model, Schema } from 'mongoose';

const ActivitySchema = new Schema(
  {
    content: Schema.Types.Mixed,
    type: String,
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    senderId: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

const Activity = model('activities', ActivitySchema);

export default Activity;
