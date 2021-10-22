import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    profilePictureUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, obj) => {
        delete obj.password;
        return obj;
      },
    },
    timestamps: true,
  }
);

userSchema.index({ username: 'text', email: 'text' });

const User = mongoose.model('users', userSchema);
module.exports = User;
