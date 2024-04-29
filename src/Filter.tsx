import fuzzy from 'fuzzy'
import { KeyboardEvent, useState } from 'react'
import useClickOutside from './hooks/useClickOutside'
import { FilterData } from './types'

interface FilterProps {
  value: string | string[]
  onInputChange: (val: FilterData) => void
  data?: FilterData[]
  multi?: boolean
  onClear?: VoidFunction
}

export function Filter({
  value,
  onInputChange,
  data,
  multi = false,
  onClear,
}: FilterProps) {
  const [inputText, setInputText] = useState(
    Array.isArray(value) ? value.join(', ') : value
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showDropdown, setShowDropdown] = useState(true)

  let filteredData: fuzzy.FilterResult<FilterData>[] = []
  if (data && data.length) {
    filteredData = fuzzy.filter(inputText, data, {
      extract: (el) => el.text,
    })
  }

  let domNode = useClickOutside<HTMLDivElement>(() => {
    setShowDropdown(false)
  })

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClear && onClear()
      setShowDropdown(false)
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      onInputChange(
        filteredData[selectedIndex]?.original
          ? filteredData[selectedIndex].original
          : { text: (e.target as HTMLInputElement).value }
      )
      if (!multi) {
        setShowDropdown(false)
      }
    } else if (e.key === 'ArrowDown') {
      setSelectedIndex((selectedIndex + 1) % filteredData.length)
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(
        (selectedIndex - 1 + filteredData.length) % filteredData.length
      )
    }
  }

  return (
    <div
      ref={domNode}
      className="relative flex items-center"
    >
      {!showDropdown && (
        <button
          onClick={() => {
            setShowDropdown(true)
            setInputText(Array.isArray(value) ? value.join(', ') : value)
          }}
        >
          {Array.isArray(value) ? value.join(', ') : value}
        </button>
      )}

      {showDropdown && (
        <>
          <input
            className="rounded-md px-2 py-1 w-48"
            type="text"
            autoFocus
            onFocus={(e) => e.target.select()}
            defaultValue={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              setSelectedIndex(0)
            }}
            onClick={() => {
              setShowDropdown(true)
            }}
            onKeyDown={(e) => onKeyDown(e)}
          />

          {filteredData.length > 0 && (
            <ul className="absolute top-10 bg-slate-100 p-2 list-none rounded-md w-full">
              {filteredData.map((data, i) => {
                return (
                  <li
                    onMouseEnter={() => setSelectedIndex(i)}
                    onClick={() => {
                      onInputChange(filteredData[selectedIndex].original)
                      if (!multi) {
                        setShowDropdown(false)
                      } else {
                        setShowDropdown(true)
                      }
                    }}
                    className={`rounded-md p-2 cursor-pointer flex gap-2 ${
                      i === selectedIndex ? 'bg-blue-100 text-blue-500' : null
                    }`}
                    key={data.string}
                  >
                    {multi && value.includes(data.string) ? (
                      <span>✔</span>
                    ) : null}
                    <span>{data.string}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
