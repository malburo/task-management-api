import Result from "helpers/result.helper";
import Room from "./room.model";
import roomService from "./room.service";
import User from '../User/user.model'

const getAllRoomInBoard = async (req, res, next) => {
    try {
        const data = req.params;
        const rooms = await roomService.getAllRoomInBoard({boardId: data});
        Result.success(res, { rooms });
    } catch (err) {
        next(err);
    };
}

const getOne = async (req, res, next) => {
    try {
        const data = req.params;
        const room = await roomService.getOne({roomId: data});
        Result.success(res, {room});
    } catch (err) {
        next(err);
    };
}

const addMember = async (req, res, next) => {
    try{
        const {userId, boardId} = req.body;
        const generalRoom = await Room.find({boardId, isGeneral: true});
        if(generalRoom.length != 1) {
            return Result.error(res, 'Kênh không tồn tại');
        }
        if(generalRoom.members.includes(userId)){
            return Result.error(res, 'User đã tồn tại trong kênh chat');
        }
        const newMember = await User.findById(userId);
        if(newMember == null){
            return Result.error(res, 'User không tồn tại');
        }

        for(let item in generalRoom.members){
            await roomService.create({boardId, members: [userId, item]});
        }

        generalRoom.members.push(userId);
        
        let updatedRoom = await Room.findOneAndUpdate(generalRoom._id, generalRoom);
        
        Result.success(res, updatedRoom);

    } catch (err) {
        next(err);
    }
}

const removeMember = async (req, res, next) => {
    try{
        const {userId, boardId} = req.body;
        const generalRoom = await Room.find({boardId, isGeneral: true});
        if(generalRoom.length != 1) {
            return Result.error(res, 'Kênh không tồn tại');
        }
        if(!generalRoom.members.includes(userId)){
            return Result.error(res, 'User không tồn tại trong kênh chat');
        }
        const removeMember = await User.findById(userId);
        if(removeMember == null){
            return Result.error(res, 'User không tồn tại');
        }
        generalRoom.members = generalRoom.members.filter(item => item != userId);
        await room.findOneAndUpdate(generalRoom._id, generalRoom);

        const privateRoom = await Room.find({members: userId, boardId, isGeneral: false});
        const rs = await Room.deleteById(privateRoom._id);
        Result.success(res, "done");
    } catch (err) {
        next(err);
    }
}

const roomController = {
    getAllRoomInBoard,
    getOne,
    addMember,
    removeMember
}

export default roomController