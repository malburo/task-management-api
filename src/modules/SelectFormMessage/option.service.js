import Option from './option.model';

const toggleOption = async (data) => {
  try {
    const option = await Option.findOne({ _id: data.optionId, userId: data.userId }).lean();
    let result;
    if (option)
      result = await Option.findByIdAndUpdate(data.optionId, { $pull: { userId: data.userId } }, { new: true });
    else result = await Option.findByIdAndUpdate(data.optionId, { $addToSet: { userId: data.userId } }, { new: true });
    return result;
  } catch (error) {
    return null;
  }
};

const optionService = {
  toggleOption,
};

export default optionService;
