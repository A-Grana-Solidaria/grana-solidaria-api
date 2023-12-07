const multer = require('@koa/multer');
const uuid = require('uuid');

const aws = require('aws-sdk');
const fs = require('fs');
const fsp = require('fs/promises');
const { Storage } = require('@google-cloud/storage');

const uploadFile = async ({
	fileName,
	filePath,
	fileType,
	name = Date.now(),
	contentDisposition = '',
}) => {
	const storage = new Storage({
    keyFilename: process.env.GCS_KEYFILE,
    projectId: process.env.GCP_PROJECT_ID,
  });

	const randomFileName = `${uuid.v4()}.${fileName.split('/').pop()}`;

	const readFile = await fsp.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    return data;
  });

	const mediaObject = Object.assign(readFile);

  const bucket = storage.bucket(`${process.env.GC_BUCKET_NAME}`);

  await bucket.file(randomFileName).save(mediaObject);
  return {url: `https://storage.googleapis.com/${bucket.name}/${randomFileName}`};
};

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'temp/');
	},
	filename(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/png'
	) {
		cb(null, true);
	} else {
		return cb(new Error('Arquivo inválido!'), false);
	}
};
const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 6,
	},
	fileFilter,
});

module.exports = { upload, uploadFile };
