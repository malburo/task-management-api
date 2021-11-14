import { model, Schema } from 'mongoose';

const MemberSchema = new Schema(
  {
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    role: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

MemberSchema.virtual('member', {
  ref: 'users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const Member = model('members', MemberSchema);

export default Member;
