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

const taskService = { create, update };
export default taskService;
