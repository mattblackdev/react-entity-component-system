import React from 'react'

export function useGameEvents() {
  const gameEvents = React.useRef([])

  const dispatchGameEvent = React.useCallback(event => {
    console.debug('useGameEvent: dispatched', event)
    gameEvents.current.push(event)
  }, [])

  const flushGameEvents = React.useCallback(() => {
    const events = [...gameEvents.current]
    gameEvents.current = []
    return events
  }, [])

  return { dispatchGameEvent, flushGameEvents }
}
