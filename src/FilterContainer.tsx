import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { FilterComboBox } from './FilterComboBox'
import { IDummyData, IFilter } from './types'
import { isFilterIncomplete } from './utils/isFilterIncomplete'

const commonOperators = ['=', '!=', '<', '>', '<=', '>=']

export const dummyData: IDummyData = {
  filterBy: {
    name: {
      operators: ['=', 'contains'],
      values: ['Cyrus Boyle', 'Alena Cummerata', 'Orlo Bergstrom'],
    },
    age: {
      operators: commonOperators,
    },
    tags: {
      operators: ['=', '!='],
      values: ['high', 'important', 'urgent'],
      multi: true,
    },
  },
}

function FilterContainer() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState<IFilter[]>([])

  function addFilter() {
    if (filters.length > 0 && isFilterIncomplete(filters[filters.length - 1])) {
      return
    }

    setFilters([
      ...filters,
      { id: nanoid(), filterBy: '', operator: '', values: '' },
    ])
  }

  function removeFilter(id: string) {
    setFilters(filters.filter((filter) => filter.id !== id))
  }

  function updateFilter(filter: IFilter, last?: boolean) {
    setFilters(
      filters.map((oldFilter) =>
        oldFilter.id === filter.id ? filter : oldFilter
      )
    )

    if (last) {
      addFilter()
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={1}
        className="bg-slate-50 p-3 rounded cursor-text flex gap-2 min-h-12"
        onKeyDown={(e) => {
          if (containerRef.current !== e.target) return
          if (e.key === 'Enter') {
            addFilter()
          }
        }}
        onClick={(e) => {
          if (containerRef.current !== e.target) return
          addFilter()
        }}
      >
        {filters.map((filter) => (
          <FilterComboBox
            key={filter.id}
            onFilterChange={updateFilter}
            onRemoveFilter={removeFilter}
            filter={filter}
          />
        ))}
      </div>

      <div className="mt-20">{JSON.stringify(filters)}</div>
    </>
  )
}

export default FilterContainer
