//sharp
const sharp = require('sharp');

// Thumbnail
module.exports = (req, res, next) => {
    sharp(req.file.path)
        .resize(50, 50)
        .jpeg({quality: 50})
        .toFile(
            path.join(req.file.destination, '/thumb/', req.file.filename)
        );
    next();
}
