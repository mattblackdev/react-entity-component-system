import React from 'react'

export function useGameEvents({ debug = false } = {}) {
  const gameEvents = React.useRef([])

  const dispatchGameEvent = React.useCallback(
    event => {
      debug && console.debug('useGameEvent: dispatched', event)
      gameEvents.current.push(event)
    },
    [gameEvents, debug],
  )

  const flushGameEvents = React.useCallback(() => {
    const events = [...gameEvents.current]
    gameEvents.current = []
    return events
  }, [gameEvents])

  return { dispatchGameEvent, flushGameEvents }
}
