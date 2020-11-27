const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomId: { type: String , required: true },
    room_title: { type: String , required: true },
    stream: { type: String },
    admins: {type: [String], required: true}
}, {collection: 'rooms'})

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
