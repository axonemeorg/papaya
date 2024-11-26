import JournalEditor, { JournalEditorView } from "@/components/journal/JournalEditor";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

const VIEW_SHORTHAND_TO_VIEW: Record<string, JournalEditorView> = {
    'm': 'month',
    'y': 'year',
    'w': 'week',
}

export default function JournalYearMonthPage() {
    const router = useRouter();

    const viewParams: string[] = router.query.view as string[] ?? [];
    let viewShorthand: string = viewParams[0] ?? 'm';
    let view: JournalEditorView = VIEW_SHORTHAND_TO_VIEW[viewShorthand] ?? 'month';
    
    const now = useMemo(() => dayjs(), []);
    
    const handleDateChange = useCallback((date: string) => {
        let [y, m, d] = date.split('-');
        if (view === 'year' || view === 'month') {
            d = '';
        }
        if (view === 'year') {
            m = '';
        }

        const routerParts = ['', ...['journal', viewShorthand, y, m, d].filter(Boolean)];
        router.push(routerParts.join('/'));
    }, [view, viewShorthand]);

    const date = useMemo(() => {
        let year: number = viewParams[1] ? Number(viewParams[1]) : now.year();
        let month: number;
    
        if (viewParams[2]) {
            month = Number(viewParams[2]);
        } else if (viewParams[1]) {
            month = 1;
        } else {
            month = now.month() + 1;
        }
    
        const isSameMonthAndYear = year === now.year() && month === now.month() + 1;
        let day: number;
    
        if (viewParams[3]) {
            day = Number(viewParams[3]);
        } else if (isSameMonthAndYear) {
            day = now.date();
        } else {
            day = 1;
        }

        return [year, month, day].join('-');
    }, [viewParams])

    useEffect(() => {
        if (!viewParams.length) {
            return;
        }
        if (
            (view === 'year' && viewParams.length !== 2)
            || (view === 'month' && viewParams.length !== 3)
            || (view === 'week' && viewParams.length !== 4)
        ) {
            // Rewrite the URL to include only the necessary parts
            handleDateChange(date);
        }
    }, [viewParams]);

    const handleNextPage = useCallback(() => {
        let nextDate: string;
        switch (view) {
            case 'month':
                nextDate = dayjs(date).add(1, 'month').format('YYYY-MM-DD');
                break;
            case 'year':
                nextDate = dayjs(date).add(1, 'year').format('YYYY-MM-DD');
                break;
            case 'week':
            default:
                nextDate = dayjs(date).add(1, 'week').format('YYYY-MM-DD');
        }

        handleDateChange(nextDate);
    }, [date, view]);

    const handlePrevPage = () => {
        let prevDate: string;
        switch (view) {
            case 'month':
                prevDate = dayjs(date).subtract(1, 'month').format('YYYY-MM-DD');
                break;
            case 'year':
                prevDate = dayjs(date).subtract(1, 'year').format('YYYY-MM-DD');
                break;
            case 'week':
            default:
                prevDate = dayjs(date).subtract(1, 'week').format('YYYY-MM-DD');
        }

        handleDateChange(prevDate);
    }

    return (
        <JournalEditor
            view={view}
            date={date}
            onNextPage={() => handleNextPage()}
            onPrevPage={() => handlePrevPage()}
            onDateChange={(date) => handleDateChange(date)}
        />
    )
}
