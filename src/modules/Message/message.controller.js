import Result from 'helpers/result.helper';
import Room from '../Room/room.model';
import io from '../../server';
import messageService from './message.service';
import { uploadCloud } from 'config/cloudinary.config';
import fs from 'fs';
import Message from './message.model';
import SelectFormMessage from 'modules/SelectFormMessage/selectFormMessage.model';
import Option from 'modules/SelectFormMessage/option.model';

const getAllInRoom = async (req, res, next) => {
  try {
    const { roomId, seed } = req.params;
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
    const { msgContent } = req.body.data;
    const updatedMessage = await messageService.updateOne({ messageId, msgContent });
    if (updatedMessage == null)
      return Result.error(res, { message: 'this message cannot be edit because someone has already read it' });
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
    const { roomId, content } = req.body;
    const message = await messageService.create({
      roomId,
      content,
      userId: req.user._id,
      readBy: [req.user._id],
      type: 1,
    });
    io.sockets.in(message.roomId.toString()).emit('chat:add-message', { message });
    const room = await Room.findById(roomId).lean();
    io.sockets.in(room.boardId.toString()).emit('channel:new-message', { message: 'new comming' });
    return Result.success(res, { message });
  } catch (err) {
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
    const data = await uploadCloud(req.file.path, '/message_image');
    fs.unlinkSync(req.file.path);
    const message = await messageService.create({
      roomId,
      content: data.url,
      userId: req.user._id,
      readBy: [req.user._id],
      type: 2,
    });
    io.sockets.in(message.roomId.toString()).emit('chat:add-message', { message });
    const room = await Room.findById(roomId).lean();
    io.sockets.in(room.boardId.toString()).emit('channel:new-message', { message: 'new comming' });
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const createSelectForm = async (req, res, next) => {
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
    io.sockets.in(room.boardId.toString()).emit('channel:new-message', { message: 'new comming' });
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

const addNewOption = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { roomId } = req.params;
    const option = await Option.create({ text: data.text });
    await SelectFormMessage.findByIdAndUpdate(data.formId, { $addToSet: { optionId: option._id } }, { new: true });
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
  createSelectForm,
  editSelectFormMessage,
  addNewOption,
};

export default messageController;
