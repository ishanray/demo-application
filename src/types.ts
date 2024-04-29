export interface IFilter {
  id: string
  filterBy: string
  operator: string
  values: string | string[]
}

export interface FilterData {
  text: string
}

export interface IDummyData {
  filterBy: {
    [key: string]: {
      operators: string[]
      values?: string[]
      multi?: boolean
    }
  }
}
