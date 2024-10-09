'use server'

import { validateRequest } from '@/auth';
import JournalService from '@/server/services/JournalService';
import { CreateJournalEntry, CreateQuickJournalEntry } from '@/types/post';
import { UpdateJournalEntry } from '@/types/put';
import { revalidatePath } from 'next/cache';

export const createJournalEntry = async (formData: CreateJournalEntry) => {
	await JournalService.createJournalEntry(formData);

	revalidatePath('/journal')
}

export const createQuickJournalEntry = async (formData: CreateQuickJournalEntry) => {
	await JournalService.createQuickJournalEntry(formData);

	revalidatePath('/journal')
}

export const updateJournalEntry = async (formData: UpdateJournalEntry) => {
	await JournalService.updateJournalEntry(formData);

	revalidatePath('/journal')
}

export const deleteJournalEntry = async (formData: FormData) => {
    const journalEntryId = String(formData.get('journalEntryId'));

	const response = JournalService.deleteUserJournalEntryById(journalEntryId);
	revalidatePath('/journal')
	return response;
}

export const getAllJournalEntriesByUserId = () => {
	return JournalService.getAllUserJournalEntries();
}

export const getUserJournalEntriesByMonthAndYear = (month: string | number, year: string | number) => {
	return JournalService.getUserJournalEntriesByMonthAndYear(month, year);
}
