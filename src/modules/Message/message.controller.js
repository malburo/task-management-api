import Result from 'helpers/result.helper';
import Room from '../Room/room.model';
import io from '../../server';
import messageService from './message.service';
import fs from 'fs';
import cloudinary from 'cloudinary';
import Message from './message.model';
import SelectFormMessage from 'modules/SelectFormMessage/selectFormMessage.model';
import Option from 'modules/SelectFormMessage/option.model';

const getAllInRoom = async (req, res, next) => {
  try {
    const { roomId, seed } = req.params;
    if (!seed) seed = 0;
    const limit = 20 * (parseInt(seed) + 1);
    const skip = 20 * seed;
    const messages = await messageService.getAllInRoom({ roomId, limit, skip });
    await messageService.readAllByUser({ roomId, userId: req.user._id });
    Result.success(res, { messages });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const updatedMessage = await messageService.updateOne({ messageId, msgContent: content });
    if (updatedMessage == null) return Result.error(res, { message: `Someone already read this, can't be edited` });
    await messageService.readAllByUser({ roomId: updatedMessage.roomId, userId: req.user._id });
    io.sockets.in(updatedMessage.roomId.toString()).emit('chat:edit-message', { message: updatedMessage });
    return Result.success(res, { updatedMessage });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await messageService.deleteOne({ _id: messageId });
    io.sockets.in(message.roomId.toString()).emit('chat:delete-message', { message });
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { _id, content } = req.body;
    const message = await messageService.create({
      roomId: _id,
      content,
      userId: req.user._id,
      readBy: [req.user._id],
      type: 1,
    });
    io.sockets.in(message.roomId.toString()).emit('chat:add-message', { message });
    const room = await Room.findById(_id).lean();
    io.sockets.in(room.boardId.toString()).emit('board:new-message', { message: 'new comming' });
    return Result.success(res, { message });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const read = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await messageService.readAllByUser({ roomId, userId: req.user._id });
    return Result.success(res, { message: 'done' });
  } catch (err) {
    next(err);
  }
};

const postImage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const data = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: '/message_image',
      resources_type: 'auto',
    });
    fs.unlinkSync(req.file.path);
    const message = await messageService.create({
      roomId,
      content: data.secure_url,
      userId: req.user._id,
      readBy: [req.user._id],
      type: 2,
    });
    io.sockets.in(message.roomId.toString()).emit('chat:add-message', { message });
    const room = await Room.findById(roomId).lean();
    io.sockets.in(room.boardId.toString()).emit('board:new-message', { message: 'new comming' });
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const createSelectFormMessage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { roomId } = req.params;
    let isAddNew = JSON.parse(data.isAddNew);
    if ((!data.option || data.option.length == 0) && !isAddNew) return Result.error(res, { message: 'invalid form' });
    const message = await messageService.createFormMessage({
      isAddNew,
      userId: req.user._id,
      isMultiSelect: data.isMultiSelect,
      content: data.content,
      roomId,
      option: data.option,
    });
    io.sockets.in(message.roomId.toString()).emit('chat:add-message', { message });
    const room = await Room.findById(roomId).lean();
    io.sockets.in(room.boardId.toString()).emit('board:new-message', { message: 'new comming' });
    return Result.success(res, { message });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const editSelectFormMessage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const check = await Option.findOne({ _id: data.optionId, userId: req.user._id }).lean();
    const option = await Option.findById(data.optionId).lean();
    const form = await SelectFormMessage.findById(option.formId).lean();
    if (form && !form.isMultiSelect) {
      await form.optionId.map(async (i) => {
        await Option.findByIdAndUpdate(i, { $pull: { userId: req.user._id } });
      });
    }
    if (check) await Option.findByIdAndUpdate(data.optionId, { $pull: { userId: req.user._id } });
    else await Option.findByIdAndUpdate(data.optionId, { $addToSet: { userId: req.user._id } });
    const message = await Message.findById(form.messageId)
      .populate('postedBy')
      .populate({
        path: 'form',
        populate: { path: 'options' },
      })
      .lean();
    io.sockets.in(message.roomId.toString()).emit('chat:edit-message', { message });
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const addNewOptionToMessage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { roomId } = req.params;
    const check = await Option.findOne({ text: data.text, formId: data.formId }).lean();
    if (check != null) return Result.error(res, { message: 'Item already exist' });
    const option = await Option.create({ text: data.text, formId: data.formId });
    const form = await SelectFormMessage.findByIdAndUpdate(
      data.formId,
      { $addToSet: { optionId: option._id } },
      { new: true }
    );
    const message = await Message.findById(form.messageId)
      .populate('postedBy')
      .populate({
        path: 'form',
        populate: { path: 'options' },
      })
      .lean();
    io.sockets.in(roomId.toString()).emit('chat:edit-message', { message });
    return Result.success(res, { message });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const messageController = {
  getAllInRoom,
  create,
  update,
  deleteOne,
  read,
  postImage,
  createSelectFormMessage,
  editSelectFormMessage,
  addNewOptionToMessage,
};

export default messageController;
