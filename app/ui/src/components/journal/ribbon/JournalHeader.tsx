import { Badge, Button, Fade, IconButton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material'

import { Add, FilterAltOff } from '@mui/icons-material'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { JournalFilterContext } from '@ui/contexts/JournalFilterContext'
import { SearchFacetKey } from '@ui/schema/support/search/facet'
import { enumerateFilters } from '@ui/utils/filtering'
import { useContext, useRef, useState } from 'react'
import { Route } from '../../../../web/routes/_mainLayout/journal.$view.$'
import JournalDateActions from './JournalDateActions'
import JournalEntrySelectionActions from './JournalEntrySelectionActions'
import JournalFilterPicker from './JournalFilterPicker'
import JournalFilterRibbon from './JournalFilterRibbon'

export default function JournalHeader() {
  const [showFiltersMenu, setShowFiltersMenu] = useState<boolean>(false)
  const filtersMenuButtonRef = useRef<HTMLButtonElement | null>(null)

  const journalFilterContext = useContext(JournalFilterContext)

  const activeFilterSlots: Set<SearchFacetKey> = journalFilterContext?.activeJournalFilters
    ? enumerateFilters(journalFilterContext.activeJournalFilters)
    : new Set()

  const numFilters = activeFilterSlots.size

  const hideFilterButton = false

  const { tab } = useSearch({ from: '/_mainLayout/journal/$view/$' })
  const navigate = useNavigate({ from: Route.fullPath })

  const handleChangeTab = (newTab: 'journal' | 'transfers') => {
    navigate({
      search: { tab: newTab },
    })
  }

  const clearAllFilters = () => {
    journalFilterContext?.updateJournalMemoryFilters(() => ({}))
  }

  return (
    <>
      <JournalFilterPicker
        anchorEl={filtersMenuButtonRef.current}
        open={showFiltersMenu}
        onClose={() => setShowFiltersMenu(false)}
      />
      <Stack component="header">
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ flex: 0, py: 1, px: 2, pb: 0 }}
          alignItems="center"
          gap={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }} gap={2}>
            <Stack direction="row" alignItems="center" gap={1}>
              <JournalEntrySelectionActions />
              {!hideFilterButton && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Badge
                    color="primary"
                    badgeContent={numFilters}
                    variant="standard"
                    slotProps={{ badge: { style: { top: '10%', right: '5%' } } }}>
                    <Button
                      variant="contained"
                      sx={(theme) => ({
                        borderRadius: theme.spacing(8),
                        py: 0.75,
                        px: 1.5,
                        // backgroundColor: theme.palette.action.hover,
                        // '&:hover': {
                        //     backgroundColor: theme.palette.action.selected,
                        // },
                      })}
                      ref={filtersMenuButtonRef}
                      onClick={() => setShowFiltersMenu((showing) => !showing)}
                      color="inherit"
                      // endIcon={<FilterAlt fontSize='small' />}
                      startIcon={<Add fontSize="small" />}>
                      <Typography>Filter</Typography>
                    </Button>
                  </Badge>
                  <Fade in={numFilters > 0}>
                    <Tooltip title="Clear filters">
                      <IconButton onClick={() => clearAllFilters()}>
                        <FilterAltOff fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Fade>
                </Stack>
              )}
            </Stack>
            <JournalDateActions />
          </Stack>
        </Stack>

        <JournalFilterRibbon />

        {/* TODO To be implemented in ZK-111 */}
        <Tabs value={tab} onChange={(_event, newValue: 'journal' | 'transfers') => handleChangeTab(newValue)}>
          <Tab value="journal" label="Journal Entries" />
          <Tab value="transfers" label="Account Transfers" />
          {/* <Tab value='ANALYSIS' label='Analysis' disabled /> */}
        </Tabs>
      </Stack>
    </>
  )
}
