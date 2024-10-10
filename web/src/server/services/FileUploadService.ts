import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import db from '@/database/client';
import { UserFileUploadTable } from '@/database/schemas';
import sharp from 'sharp';
import { generateIdFromEntropySize, User } from "lucia";
import Vibrant from 'node-vibrant';

const s3Config: S3ClientConfig = {
	region: process.env.AWS_S3_REGION ?? '',
	credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? ''
    }
}

const s3Client = new S3Client(s3Config);

const bucketName = process.env.AWS_S3_BUCKET_NAME ?? '';

export interface AvatarImageUploadResponse {
    record: {
        s3Key: string;
        userFileUploadId: string;
    },
    color: string | null;
}

export class FileUploadService {
    private static generateRandomFilename(entropy: number = 20) {
        return generateIdFromEntropySize(entropy);
    };

	private static _generateFileMeta(file: File) {
		const mimeType = file.type;
        const originalFileName = String(file.name ?? '');
        const originalFileNameParts = originalFileName.split('.');
        const originalFileExtension = originalFileNameParts.at(-1);;
        const fileName = [
            this.generateRandomFilename(32),
            originalFileExtension
        ].join('.');

		return {
			mimeType,
			fileName,
			originalFileName
		}
	}

    static async uploadAvatarImage(file: File, user: User): Promise<AvatarImageUploadResponse> {
		const {
			mimeType,
			fileName,
			originalFileName
		} = this._generateFileMeta(file);

        // Upload the file to S3
		const fileBuffer = await file.arrayBuffer();
		const resizedImageBuffer = await sharp(Buffer.from(fileBuffer))
			.resize(64, 64, {
				fit: 'cover', // Cropping to cover the square area
			})
			.toBuffer();
        const colorPaletteImageBuffer = await sharp(Buffer.from(fileBuffer))
			.resize(512)
			.toBuffer();
        const palette = await Vibrant.from(colorPaletteImageBuffer).getPalette();
        const paletteColor = palette.Vibrant?.getHex() ?? null;

		const fileS3Key = `uploads/${fileName}`
		const s3Params = {
			Bucket: bucketName,
			Key: fileS3Key,
			Body: Buffer.from(resizedImageBuffer),
			ContentType: mimeType,
		};

		const command = new PutObjectCommand(s3Params);
		await s3Client.send(command);

		// Insert the file into the database
		const records = await db
			.insert(UserFileUploadTable)
			.values({
				userId: user.id,
				fileName,
				originalFileName,
				mimeType,
				s3Key: fileS3Key,
				fileUploadType: 'IMAGE_AVATAR',
			})
			.returning({
				userFileUploadId: UserFileUploadTable.userId,
				s3Key: UserFileUploadTable.s3Key,
			})
		
		return {
            record: records[0],
            color: paletteColor,
        }
    }
}
