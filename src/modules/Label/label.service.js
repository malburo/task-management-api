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

const labelService = { getAll, create };
export default labelService;
