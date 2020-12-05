const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    username: { type: String, lowercase: true },
    user_metadata: {
        username: String,
        avatar: String
    },
    pending_invitations: Array,
    sent_invitations: Array,
    friends: Array,
    rooms: {type: [String]},
    email_verified: {type: Boolean, default: false},
    account_setup: {type: Boolean, default: false},
    resetPasswordToken: {type: String, required: false}
}, {collection: 'users'})

const User = mongoose.model('User', userSchema);

module.exports = User;
