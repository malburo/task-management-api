import Option from 'modules/SelectFormMessage/option.model';
import SelectFormMessage from 'modules/SelectFormMessage/selectFormMessage.model';
import Message from './message.model';

const getAllInRoom = async (data) => {
  try {
    let messages = await Message.find({ roomId: data.roomId })
      .sort({ createdAt: -1 })
      .populate('postedBy')
      .populate({
        path: 'form',
        populate: { path: 'options', pupulate: { path: 'selectedBy' } },
      })
      .lean();
    messages = messages.slice(data.skip, data.limit);
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
  const message = await Message.findById(data)
    .populate('postedBy')
    .populate({
      path: 'form',
      populate: { path: 'options' },
    })
    .lean();
  if ((Date.now() - message.createdAt) / (1000 * 3600 * 24) >= 1) throw Error('Không thể xoá');
  await Message.findByIdAndDelete(message._id);
  if (message.type === 3) {
    await Option.deleteMany({ formId: message.formId });
    await SelectFormMessage.findByIdAndDelete(message.formId);
  }
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

const createFormMessage = async (data) => {
  try {
    const message = await messageService.create({
      roomId: data.roomId,
      userId: data.userId,
      readBy: [data.userId],
      content: data.content,
      type: 3,
    });
    const form = await SelectFormMessage.create({
      messageId: message._id,
      isAddNew: data.isAddNew,
      isMultiSelect: data.isMultiSelect,
      optionId: [],
    });
    await Message.findByIdAndUpdate(message._id, { formId: form._id });
    let option;
    await data.option?.map((i) => {
      (async () => {
        option = await Option.create({
          formId: form._id,
          userId: [],
          text: i,
          value: 0,
        });
        await SelectFormMessage.findByIdAndUpdate(form._id, { $push: { optionId: option._id } });
      })();
    });
    const finalMessage = await Message.findById(message._id)
      .populate('postedBy')
      .populate({
        path: 'form',
        populate: { path: 'options', pupulate: { path: 'selectedBy' } },
      })
      .lean();
    return finalMessage;
  } catch (err) {
    return null;
  }
};

const messageService = {
  getAllInRoom,
  create,
  deleteOne,
  updateOne,
  readAllByUser,
  createFormMessage,
};

export default messageService;
