var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, req.session.post._id.toString());
    }
});
var upload = multer({storage: storage}).single('postPicture');
module.exports = upload;