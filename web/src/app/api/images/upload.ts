import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import path from 'path';

export const config = {
	api: {
		bodyParser: false,
	},
};

const s3Config = {
	region: process.env.AWS_S3_REGION ?? '',
	credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? ''
    }
}

const generateRandomFilename  = (length: number) => {
    const chars = '-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let symbols: string[] = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        symbols.push(chars[randomIndex]);
    }

    return symbols.join('');
}

export async function POST(request: NextRequest) {
	const form = new IncomingForm();

	return new Promise((resolve, reject) => {
		form.parse(request, async (err, fields, files) => {
			if (err) {
				reject(err);
				return;
			}

			const file = files.file[0];
			const data = readFileSync(file.filepath);

			const fileName = generateRandomFilename(32);

			// Upload the file to S3
			const bucketName = process.env.AWS_BUCKET_NAME;
			const s3Params = {
				Bucket: bucketName,
				Key: `uploads/${file.originalFilename}`,
				Body: data,
				ContentType: file.mimetype,
			};

			const command = new PutObjectCommand(s3Params);
			await s3Client.send(command);

			// Generate a public URL for the uploaded file
			const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${file.originalFilename}`;

		});
	});
}
