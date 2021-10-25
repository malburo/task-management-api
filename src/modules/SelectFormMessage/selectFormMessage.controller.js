import Message from 'modules/Message/message.model';
import io from '../../server';
import Option from './option.model';
import SelectFormMessage from './selectFormMessage.model';

const addOption = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { formId } = req.params;
    const option = await Option.create({ text: data.text });
    await SelectFormMessage.findByIdAndUpdate(formId, { $addToSet: { optionId: option._id } }, { new: true });
    const message = await Message.findById(form.messageId)
      .populate('postedBy')
      .populate({
        path: 'form',
        populate: { path: 'options' },
      })
      .lean();
    io.sockets.in(message.roomId.toString()).emit('chat:edit-message', { message });
    return Result.success(res, { message });
  } catch (error) {
    next(error);
  }
};

const selectFormMessageController = {
  addOption,
};

export default selectFormMessageController;
