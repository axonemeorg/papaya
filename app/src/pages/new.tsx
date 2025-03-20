import { JournalContext } from "@/contexts/JournalContext"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"


export default function NewEntryShortcutPage() {
    const [hasOpened, setHasOpened] = useState(false)
    const journalContext = useContext(JournalContext)
    const router = useRouter()

    useEffect(() => {
        if (!journalContext.journal) {
            return;
        }
        journalContext.createJournalEntry()
        setHasOpened(true)
    }, [journalContext.journal])

    useEffect(() => {
        if (hasOpened && !journalContext.showJournalEntryModal) {
            router.push('/journal')
        }
    }, [journalContext.showJournalEntryModal])

    return (
        <></>
    )
}
