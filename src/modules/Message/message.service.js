import Message from './message.model';

const getAllInRoom = async (data) => {
  try {
    const messages = await Message.find({ roomId: data.roomId })
      .sort({ createdAt: -1 })
      .skip(data.skip)
      .limit(data.limit)
      .populate('postedBy')
      .lean();
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (err) {
    throw err;
  }
};

const create = async (data) => {
  try {
    const newMessage = await Message.create(data);
    const message = await Message.findById(newMessage._id).populate('postedBy').lean();
    return message;
  } catch (err) {
    throw err;
  }
};

const deleteOne = async (data) => {
  const message = await Message.findById(data).populate('postedBy').lean();
  if ((Date.now() - message.createdAt) / (1000 * 3600 * 24) >= 1) throw Error('Không thể xoá');
  await Message.findByIdAndDelete(message._id);
  return message;
};

const updateOne = async (data) => {
  try {
    const { msgContent, messageId } = data;
    const message = await Message.findOneAndUpdate(
      { _id: messageId, readBy: { $size: 1 } },
      { content: msgContent },
      { new: true }
    )
      .populate('postedBy')
      .lean();
    return message;
  } catch {
    return null;
  }
};

const readAllByUser = async (data) => {
  const { roomId, userId } = data;
  await Message.updateMany({ roomId: roomId }, { $addToSet: { readBy: userId } }, { new: true, multi: true });
};

const countUnreadMessage = async (data) => {
  const { roomId, userId } = data;
  const counter = await Message.find({ roomId, readBy: { $ne: userId } }).count();
  return counter;
};

const messageService = {
  getAllInRoom,
  create,
  deleteOne,
  updateOne,
  readAllByUser,
};

export default messageService;
