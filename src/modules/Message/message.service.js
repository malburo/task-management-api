import Message from './message.model';

const getAllInRoom = async (data) => {
  try {
    const messages = await Message.find({ roomId: data.roomId }).populate('postedBy').lean();
    return messages;
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

const messageService = {
  getAllInRoom,
  create,
};

export default messageService;
