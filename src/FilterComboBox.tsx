import { Filter } from './Filter'
import { dummyData } from './FilterContainer'
import { FilterData, IFilter } from './types'

interface FilterComboBoxProps {
  filter: IFilter
  onRemoveFilter: (id: string) => void
  onFilterChange: (val: IFilter) => void
}
export function FilterComboBox({
  filter,
  onRemoveFilter,
  onFilterChange,
}: FilterComboBoxProps) {
  return (
    <div className="bg-sky-100 rounded px-2 py-1 text-md space-x-2 flex items-center">
      <Filter
        data={Object.keys(dummyData.filterBy).map((d) => ({ text: d }))}
        onClear={() => onRemoveFilter(filter.id)}
        onInputChange={(val: FilterData) => {
          onFilterChange({ ...filter, filterBy: val.text })
        }}
        value={filter.filterBy}
      />

      {filter.filterBy && (
        <Filter
          data={dummyData.filterBy[filter.filterBy]?.operators.map((o) => ({
            text: o,
          }))}
          onInputChange={(val: FilterData) =>
            onFilterChange({ ...filter, operator: val.text })
          }
          value={filter.operator}
        />
      )}

      {filter.filterBy && filter.operator && (
        <Filter
          multi={dummyData.filterBy[filter.filterBy]?.multi}
          onInputChange={(val: FilterData) => {
            if (dummyData.filterBy[filter.filterBy]?.multi) {
              if (filter.values.includes(val.text)) {
                onFilterChange({
                  ...filter,
                  values: [...filter.values].filter((ev) => ev !== val.text),
                })
              } else {
                onFilterChange({
                  ...filter,
                  values: [...filter.values, val.text],
                })
              }
            } else {
              onFilterChange({ ...filter, values: val.text })
            }
          }}
          value={filter.values}
          data={dummyData.filterBy[filter.filterBy]?.values?.map((o) => ({
            text: o,
          }))}
        />
      )}

      <button
        className="text-sky-500 p-1 hover:cursor-pointer"
        onClick={() => {
          onRemoveFilter(filter.id)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onRemoveFilter(filter.id)
          }
        }}
      >
        x
      </button>
    </div>
  )
}
