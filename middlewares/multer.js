const multer = require('multer')
const path = require('path')

module.exports = multer({
    dest: 'images',
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg'){
            cb(new Error('file type is not supported'), false)
            return;
        }
        cb(null, true)
    }
})
