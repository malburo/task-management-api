import Member from './member.model';

const getAllMemberInBoard = async (data) => {
  try {
    const members = await Member.find({ boardId: data.boardId }).lean();
    return members;
  } catch (error) {
    throw error;
  }
};

const getOne = async (data) => {
  const member = await Member.findOne({ boardId: data.boardId, userId: data.userId }).lean();
  return member;
};

const create = async (data) => {
  try {
    const newMember = await Member.create(data);
    return newMember;
  } catch (error) {
    throw error;
  }
};

const memberService = { getAllMemberInBoard, create, getOne };
export default memberService;
