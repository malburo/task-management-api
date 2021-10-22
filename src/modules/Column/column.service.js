import Column from './column.model';

const create = async (data) => {
  try {
    const newColumn = await Column.create(data);
    return newColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, updateData) => {
  try {
    if (updateData.taskId) delete updateData.taskId;
    const updatedColumn = await Column.findByIdAndUpdate(columnId, { $set: updateData }, { new: true }).lean();
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};
const deleteOne = async (columnId, updateData) => {
  try {
    const deletedColumn = await Column.findByIdAndDelete(columnId).lean();
    return deletedColumn;
  } catch (error) {
    throw error;
  }
};

const pushTaskOrder = async (columnId, taskId) => {
  try {
    const updatedColumn = await Column.findOneAndUpdate(
      { _id: columnId },
      { $push: { taskOrder: taskId } },
      { new: true }
    ).lean();
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};
const columnService = { create, update, deleteOne, pushTaskOrder };
export default columnService;
