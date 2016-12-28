var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    _userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    _userNickName: String,
    body: {type: String, required: true},
    postTime: {type: Date, required: true, default: Date.now()},
    hasPic: Boolean,
    isPublic: Boolean
});
var Post = mongoose.model('Post', postSchema);
module.exports = Post;