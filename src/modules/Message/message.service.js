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
    return newMessage;
  } catch (err) {
    throw err;
  }
};

const deleteOne = async (data) => {
  try {
    const message = await Message.findById(data);
    if ((Date.now() - message.createdAt) / (1000 * 3600 * 24) >= 1) throw Error('Không thể xoá');
    await Message.findByIdAndDelete(message._id).populate('postedBy').lean();
    return message;
  } catch (err) {
    throw err;
  }
};

const updateOne = async (data) => {
  try {
    const { msgContent, roomId, messageId } = data;
    const theLastest = await Message.findOne({ roomId: roomId }).sort({ createdAt: -1 }).lean();
    if (theLastest && !theLastest._id.equals(messageId)) throw Error('Không thể cập nhật tin nhắn khi đã đọc');
    const updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { content: msgContent } }, { new: true })
      .populate('postedBy')
      .lean();
    return updatedMessage;
  } catch (err) {
    throw err;
  }
};

const messageService = {
  getAllInRoom,
  create,
  deleteOne,
  updateOne,
};

export default messageService;
