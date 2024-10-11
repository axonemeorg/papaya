import db from "@/database/client";
import { UserFileUploadTable } from "@/database/schemas";
import { InferInsertModel } from "drizzle-orm";

export default class FileUploadRepository {
	static async insertFileUploadRecord(values: InferInsertModel<typeof UserFileUploadTable>) {
		const records = await db
			.insert(UserFileUploadTable)
			.values({
				userId: values.userId,
				fileName: values.fileName,
				originalFileName: values.originalFileName,
				mimeType: values.mimeType,
				s3Key: values.s3Key,
				fileUploadType: values.fileUploadType,
			})
			.returning({
				userFileUploadId: UserFileUploadTable.userFileUploadId,
				mimeType: UserFileUploadTable.mimeType,
				s3Key: UserFileUploadTable.s3Key,
			});

		return records[0];
	}
}
