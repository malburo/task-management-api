import Label from './label.model';

const getAll = async () => {
  try {
    const labels = await Label.getAll();
    return labels;
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newLabel = await Label.create(data);
    return newLabel;
  } catch (error) {
    throw error;
  }
};
const update = async (labelId, updateData) => {
  try {
    const updatedLabel = await Label.findByIdAndUpdate(labelId, { $set: updateData }, { new: true }).lean();
    return updatedLabel;
  } catch (error) {
    throw error;
  }
};
const labelService = { getAll, create, update };
export default labelService;
