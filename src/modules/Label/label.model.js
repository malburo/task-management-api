import { model, Schema } from 'mongoose';

const LabelSchema = new Schema(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    name: String,
    color: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

const Label = model('labels', LabelSchema);

export default Label;
