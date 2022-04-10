import { model, Schema } from 'mongoose';

const whiteboardSchema = new Schema(
  {
    name: String,
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    content: { type: Schema.Types.Mixed, default: null },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

const Whiteboard = model('whiteboards', whiteboardSchema);

export default Whiteboard;
