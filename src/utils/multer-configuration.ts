import fs from 'fs'
import multer from 'multer'
import path from 'path'
const uploadFolder = './uploads'

if (!fs.existsSync(uploadFolder)) {
	fs.mkdirSync(uploadFolder, { recursive: true })
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadFolder)
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

export const upload = multer({ storage: storage })
