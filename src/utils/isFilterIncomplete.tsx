import { IFilter } from '../types'

export function isFilterIncomplete(filter: IFilter) {
  if (!filter) return true
  if (!filter.filterBy || !filter.operator || !filter.values) return true
}
