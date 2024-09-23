import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/auth';
import { FileUploadRepository } from '@/server/repositories/FileUploadRepository';


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

	try {
		const response = await FileUploadRepository.uploadAvatarImage(file, user);
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
	}
}
