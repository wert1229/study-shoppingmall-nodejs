//이미지 저장되는 위치 설정
const path = require('path');
const uploadDir = path.join( __dirname, '../uploads');

//multer 셋팅
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1]);
    }
});

module.exports = multer({ storage: storage });