import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import db from '@/database/client';
import { UserFileUploadTable, type UserFileUploadTypeEnum } from '@/database/schemas';
import sharp from 'sharp';
import { generateIdFromEntropySize, User } from "lucia";
import Vibrant from 'node-vibrant';
import FileUploadRepository from '../repositories/FileUploadRepository';

const s3Config: S3ClientConfig = {
	region: process.env.AWS_S3_REGION ?? '',
	credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? ''
    }
}

const s3Client = new S3Client(s3Config);

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? '';

const UPLOADS_FOLDER_NAME = 'uploads';

export interface FileMeta {
	mimeType: string;
	fileName: string;
	originalFileName: string;
}

export interface AvatarImageUploadResponse {
    record: {
        s3Key: string;
        userFileUploadId: string;
    },
    color: string | null;
}

const JOURNAL_ENTRY_ATTACHMENT_MAX_DIMENSION = 2160;

export class FileUploadService {
    private static _generateRandomFilename(entropy: number = 20) {
        return generateIdFromEntropySize(entropy);
    };

	private static _generateFileMeta(file: File): FileMeta {
		const mimeType = file.type;
        const originalFileName = String(file.name ?? '');
        const originalFileNameParts = originalFileName.split('.');
        const originalFileExtension = originalFileNameParts.at(-1);;
        const fileName = [
            this._generateRandomFilename(32),
            originalFileExtension
        ].join('.');

		return {
			mimeType,
			fileName,
			originalFileName
		}
	}

	static async uploadUserImageToS3(file: File, uploadType: UserFileUploadTypeEnum, processedBuffer: Buffer, user: User) {
		const {
			mimeType,
			fileName,
			originalFileName
		} = this._generateFileMeta(file);

		const fileS3Key = [UPLOADS_FOLDER_NAME, fileName].join('/');
		const s3Params = {
			Bucket: BUCKET_NAME,
			Key: fileS3Key,
			Body: Buffer.from(processedBuffer),
			ContentType: mimeType,
		};

		const command = new PutObjectCommand(s3Params);
		await s3Client.send(command);

		// Insert the file record into the database
		const record = await FileUploadRepository.insertFileUploadRecord({
			userId: user.id,
			fileName,
			originalFileName,
			mimeType,
			s3Key: fileS3Key,
			fileUploadType: uploadType,
		});

		return record;
	}

    static async createAvatarImage(file: File, user: User): Promise<AvatarImageUploadResponse> {
		// Create file buffer by resizing the image to thumbnail size
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

		const record = await this.uploadUserImageToS3(
			file,
			'IMAGE_AVATAR',
			resizedImageBuffer,
			user
		);

		return {
            record,
            color: paletteColor,
        }
    }

    static async createJournalEntryImage(file: File, user: User) {
		// Create image buffer
        const fileBuffer = await file.arrayBuffer();
		const resizedImageBuffer = await sharp(Buffer.from(fileBuffer))
            .resize({
                width: JOURNAL_ENTRY_ATTACHMENT_MAX_DIMENSION,
                height: JOURNAL_ENTRY_ATTACHMENT_MAX_DIMENSION,
                fit: 'inside', // Ensures the image fits within the dimensions
                withoutEnlargement: true,
            })
			.toBuffer();

        // Create user file record
        const userFileRecord = await FileUploadService.uploadUserImageToS3(
            file,
            "JOURNAL_ENTRY_ATTACHMENT",
            resizedImageBuffer,
            user
        );

		return userFileRecord;
    }
}
