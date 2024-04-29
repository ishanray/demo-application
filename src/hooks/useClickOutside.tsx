import { useEffect, useRef } from 'react'

export default function useClickOutside<T>(handler: (e: MouseEvent) => void) {
  let domNode = useRef<T>(null)

  useEffect(() => {
    let maybeHandler = (e: MouseEvent) => {
      if (!(domNode.current as HTMLElement)?.contains(e.target as Node)) {
        handler(e)
      }
    }

    document.addEventListener('mousedown', maybeHandler)

    return () => {
      document.removeEventListener('mousedown', maybeHandler)
    }
  }, [])

  return domNode
}
