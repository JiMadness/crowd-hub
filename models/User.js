var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    nickName: String,
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    gender: String,
    phoneNumbers: [String],
    homeTown: String,
    company: String,
    maritalStatus: String,
    about: String,
    hasPic: Boolean,
    birthDay: Date,
    creation_date: {type: Date, default: Date.now()},
    friendIds: [mongoose.Schema.Types.ObjectId],
    friendRequests: [mongoose.Schema.Types.ObjectId]
});
var User = mongoose.model('User', userSchema);
module.exports = User;