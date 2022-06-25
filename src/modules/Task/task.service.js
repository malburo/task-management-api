import Task from './task.model';

const create = async (data) => {
  try {
    const newColumn = await Task.create(data);
    return newColumn;
  } catch (error) {
    throw error;
  }
};
const update = async (taskId, updateData) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updateData }, { new: true }).lean();
    return updatedTask;
  } catch (error) {
    throw error;
  }
};
const deleteByColumnId = async (columnId) => {
  try {
    const deletedTasks = await Task.deleteMany({ columnId });
    return deletedTasks;
  } catch (error) {
    throw error;
  }
};

const pushLabel = async (taskId, labelId) => {
  try {
    const updatedLabel = await Task.findOneAndUpdate(
      { _id: taskId },
      { $push: { labelsId: labelId } },
      { new: true }
    ).lean();
    return updatedLabel;
  } catch (error) {
    throw error;
  }
};

const pullLabel = async (taskId, labelId) => {
  try {
    const updatedLabel = await Task.findOneAndUpdate(
      { _id: taskId },
      { $pull: { labelsId: labelId } },
      { new: true }
    ).lean();
    return updatedLabel;
  } catch (error) {
    throw error;
  }
};

const pushMember = async (taskId, memberId) => {
  try {
    const updatedLabel = await Task.findOneAndUpdate(
      { _id: taskId },
      { $push: { membersId: memberId } },
      { new: true }
    ).lean();
    return updatedLabel;
  } catch (error) {
    throw error;
  }
};

const pullMember = async (taskId, memberId) => {
  try {
    const updatedLabel = await Task.findOneAndUpdate(
      { _id: taskId },
      { $pull: { membersId: memberId } },
      { new: true }
    ).lean();
    return updatedLabel;
  } catch (error) {
    throw error;
  }
};

const taskService = { create, update, deleteByColumnId, pushLabel, pullLabel, pushMember, pullMember };
export default taskService;
