const { Schema, model, Types } = require('mongoose');

const roomSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    owner: { type: Types.ObjectId, ref: "User" },
    reviews: [{ type: Types.ObjectId, ref: 'Review' }]
});

const Room = model('Room', roomSchema);

module.exports = Room;