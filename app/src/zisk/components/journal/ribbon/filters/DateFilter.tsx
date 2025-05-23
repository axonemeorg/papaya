import { JournalFilterContext } from '@/contexts/JournalFilterContext'
import { CustomDateView, DateViewVariant } from '@/schema/support/search/facet'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useContext, useState } from 'react'
import { Stack, Typography } from '@mui/material'

export default function DateFilter() {
  const journalFilterContext = useContext(JournalFilterContext)

  // Get the current date filter or create a default one
  const defaultDateFilter: CustomDateView = {
    view: DateViewVariant.CUSTOM,
    after: undefined,
    before: undefined,
  }

  // Check if the current filter is a CustomDateView
  const currentDateFilter = journalFilterContext?.activeJournalFilters?.DATE
  const isCustomDateView = currentDateFilter?.view === DateViewVariant.CUSTOM

  // Use the current filter if it's a CustomDateView, otherwise use the default
  const dateFilter = isCustomDateView ? (currentDateFilter as CustomDateView) : defaultDateFilter

  // Convert string dates to dayjs objects for the pickers
  const [afterDate, setAfterDate] = useState<dayjs.Dayjs | null>(dateFilter.after ? dayjs(dateFilter.after) : null)
  const [beforeDate, setBeforeDate] = useState<dayjs.Dayjs | null>(dateFilter.before ? dayjs(dateFilter.before) : null)

  // Update the filter when dates change
  const handleAfterDateChange = (date: dayjs.Dayjs | null) => {
    setAfterDate(date)

    // Update the filter in context
    journalFilterContext?.updateJournalMemoryFilters((prev) => ({
      ...prev,
      DATE: {
        view: DateViewVariant.CUSTOM,
        after: date ? date.format('YYYY-MM-DD') : undefined,
        before: beforeDate ? beforeDate.format('YYYY-MM-DD') : undefined,
      },
    }))
  }

  const handleBeforeDateChange = (date: dayjs.Dayjs | null) => {
    setBeforeDate(date)

    // Update the filter in context
    journalFilterContext?.updateJournalMemoryFilters((prev) => ({
      ...prev,
      DATE: {
        view: DateViewVariant.CUSTOM,
        after: afterDate ? afterDate.format('YYYY-MM-DD') : undefined,
        before: date ? date.format('YYYY-MM-DD') : undefined,
      },
    }))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="textSecondary">
            After
          </Typography>
          <DatePicker
            value={afterDate}
            onChange={handleAfterDateChange}
            slotProps={{
              textField: {
                size: 'small',
                variant: 'standard',
                fullWidth: true,
              },
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" color="textSecondary">
            Before
          </Typography>
          <DatePicker
            value={beforeDate}
            onChange={handleBeforeDateChange}
            slotProps={{
              textField: {
                size: 'small',
                variant: 'standard',
                fullWidth: true,
              },
            }}
          />
        </Stack>
      </Stack>
    </LocalizationProvider>
  )
}
