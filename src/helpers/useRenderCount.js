import React from 'react'

export function useRenderCount() {
  const count = React.useRef(0)
  count.current++
  return count
}
