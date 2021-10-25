import { model, Schema } from 'mongoose';

const selectFormMessageScheme = new Schema(
  {
    messageId: { type: Schema.Types.ObjectId, ref: 'messages' },
    optionId: [{ type: Schema.Types.ObjectId, ref: 'options' }],
    isAddNew: Boolean,
    isMultiSelect: Boolean,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

selectFormMessageScheme.virtual('options', {
  ref: 'options',
  localField: 'optionId',
  foreignField: '_id',
});

selectFormMessageScheme.virtual('message', {
  ref: 'messages',
  localField: 'messageId',
  foreignField: '_id',
  justOne: 'true',
});

const SelectFormMessage = model('select-form-messages', selectFormMessageScheme);

export default SelectFormMessage;
