import Room from '../modules/Room/room.model';
import Result from '../helpers/result.helper';

const checkPermissionInRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    let room = await Room.findOne({ _id: roomId });
    if (
      room.type === 'DIRECT' &&
      room.usersId.find((user) => user.toString() === req.user._id.toString()) === 'undefined'
    ) {
      return Result.error(res, { message: 'No permission to get data' }, 403);
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export default checkPermissionInRoom;
