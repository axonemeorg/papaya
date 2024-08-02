'use server'

import dayjs from "dayjs";
import { redirect } from "next/navigation";

export default async function() {
    const urlParts = [
        '',
        'journal',
        dayjs().format('YYYY'),
        1,
    ];

    redirect(urlParts.join('/'));
    // redirect('/');
}
