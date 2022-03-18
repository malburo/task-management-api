import Message from './message.model';

const create = async (data) => {
  try {
    let newMessage = await Message.create(data);
    newMessage = await newMessage.populate('user').execPopulate();
    return newMessage;
  } catch (err) {
    throw err;
  }
};

const getAll = async ({ page = 1, limit = 8, q = '' }, roomId) => {
  try {
    const messages = await Message.find({ roomId })
      .limit(parseInt(limit))
      .skip(parseInt(page - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
      })
      .lean();
    const total = await Message.find({ roomId }).countDocuments();
    return { messages, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const messageService = {
  create,
  getAll,
};

export default messageService;
