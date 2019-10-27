import React from 'react'

import { useRenderCount } from './useRenderCount'

export function useConsoleWarnIfInvokedTooManyRendersInARow(limit, message) {
  const renderCount = useRenderCount()
  const invocations = React.useRef([])
  const trackInvocations = React.useCallback(() => {
    invocations.current.push(renderCount.current)
    if (invocations.current.length > limit) {
      if (
        invocations.current.every((renderCount, index, invocations) => {
          if (index === 0) return true
          return renderCount - 1 === invocations[index - 1]
        })
      ) {
        console.warn(message)
        invocations.current = []
      } else {
        invocations.current.shift()
      }
    }
    return [renderCount, invocations]
  }, [renderCount, invocations, limit, message])

  return trackInvocations
}
