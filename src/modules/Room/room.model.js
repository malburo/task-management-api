const { Schema } = require("mongoose");

const roomScheme = new Schema(
    {
        boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
        members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
        name: String,
        isGeneral: Boolean,
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false
        },
        timestamps: true,
    }
);

const Room = model('rooms', roomScheme);

export default Room;