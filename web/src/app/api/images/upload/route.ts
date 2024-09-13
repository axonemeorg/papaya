import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import path from 'path';
import { validateRequest } from '@/auth';
import db from '@/database/client';
import { UserFileUploads } from '@/database/schemas';

export const config = {
	api: {
		bodyParser: false,
	},
};

const s3Config: S3ClientConfig = {
	region: process.env.AWS_S3_REGION ?? '',
	credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? ''
    }
}

const s3Client = new S3Client(s3Config);

const bucketName = process.env.AWS_S3_BUCKET_NAME ?? '';

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
	const { user } = await validateRequest();
	
	if (!user) {
		return NextResponse.json({ error: 'Must be authenticated' }, { status: 401 });
	}
	
	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	
	if (!file) {
		return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
	}
	
	const mimeType = file.type;
	const originalFileName = String(file.name ?? '');
	const originalFileNameParts = originalFileName.split('.');
	const originalFileExtension = originalFileNameParts.at(-1);;
	const fileName = [
		generateRandomFilename(32),
		originalFileExtension
	].join('.');
	
	
	try {
		// Upload the file to S3
		const fileBuffer = await file.arrayBuffer();
		const fileS3Key = `uploads/${fileName}`
		const s3Params = {
			Bucket: bucketName,
			Key: fileS3Key,
			Body: Buffer.from(fileBuffer),
			ContentType: mimeType,
		};

		const command = new PutObjectCommand(s3Params);
		await s3Client.send(command);

		// Insert the file into the database
		const record = await db
			.insert(UserFileUploads)
			.values({
				userId: user.id,
				fileName,
				originalFileName,
				mimeType,
				s3Key: fileS3Key,
				fileUploadType: 'IMAGE_AVATAR',
			})
			.returning({
				userFileUploadId: UserFileUploads.userId,
				s3Key: UserFileUploads.s3Key,
			})
		
		return NextResponse.json(record, { status: 200 });
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
	}
}
