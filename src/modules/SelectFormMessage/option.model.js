import { model, Schema } from 'mongoose';

const optionScheme = new Schema(
  {
    text: String,
    userId: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    formId: { type: Schema.Types.ObjectId, ref: 'select-form-messages' },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

optionScheme.virtual('form', {
  ref: 'select-form-messages',
  localField: 'formId',
  foreignField: '_id',
  justOne: true,
});

optionScheme.virtual('selectedBy', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
});

const Option = model('options', optionScheme);

export default Option;
