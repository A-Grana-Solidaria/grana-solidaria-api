const multer = require('@koa/multer');

const aws = require('aws-sdk');
const fs = require('fs');

const uploadFile = async ({
	fileName,
	filePath,
	fileType,
	name = Date.now(),
	contentDisposition = '',
}) => {
	return new Promise((resolve, reject) => {
		aws.config.update({
			region: 'us-east-2',
			// You'll need your service's access keys here
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		});

		const s3 = new aws.S3({
			apiVersion: '2006-03-01',
			// If you want to specify a different endpoint, such as using DigitalOcean spaces
			// endpoint: new aws.Endpoint("nyc3.digitaloceanspaces.com"),
		});

		const stream = fs.createReadStream(filePath);
		stream.on('error', function (err) {
			reject(err);
		});

		s3.upload(
			{
				ACL: 'public-read',
				// You'll input your bucket name here
				Bucket: process.env.S3_BUCKET,
				Body: stream,
				Key: name + fileName,
				ContentType: fileType,
				ContentDisposition: contentDisposition,
			},
			function (err, data) {
				if (err) {
					reject(err);
				} else if (data) {
					resolve({ key: data.Key, url: data.Location });
				}
			}
		);
	});
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
