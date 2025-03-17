import { JournalSliceContext } from "@/contexts/JournalSliceContext"
import { Collapse } from "@mui/material"
import { useContext } from "react"


export default function JournalFilterRibbon() {
    const journalSliceContext = useContext(JournalSliceContext)

    const numFilters = journalSliceContext.getSliceFilterCount()

    return (
        <Collapse in={numFilters > 0}>
            Hello
        </Collapse>
    )
}
