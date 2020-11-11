const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Schema.ObjectId,
    email: String,
    password: String,
    user_metadata: {
        username: String,
        avatar: String
    },
    pending_invitation: Array,
    sent_invitations: Array,
    friends: Array,
    rooms: {type: [String]},
    email_verified: Boolean,
}, {collection: 'users'})

const User = mongoose.model('User', userSchema);

module.exports = User;
