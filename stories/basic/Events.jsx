import React from 'react'

import {
  useEntityComponentSystem,
  useGameLoop,
  useGameEvents,
  Debug,
} from '../../src'

function ColorfulEvent({ event }) {
  return <li style={{ color: event }}>{event}</li>
}

function eventSystem({ gameEvents, createEntity }) {
  gameEvents.forEach(event => {
    createEntity({ Renderer: ColorfulEvent, event })
  })
}

export function Events() {
  const [entities, updater, debug] = useEntityComponentSystem([], [eventSystem])

  const { dispatchGameEvent, flushGameEvents } = useGameEvents()

  const gameLoop = useGameLoop(() => {
    updater({
      gameEvents: flushGameEvents(),
    })
  })

  return (
    <div>
      <button onClick={() => dispatchGameEvent('red')}>red</button>
      <button onClick={() => dispatchGameEvent('green')}>green</button>
      <button onClick={() => dispatchGameEvent('blue')}>blue</button>
      <div>hi</div>
      <ul>{entities}</ul>
      <Debug entities={debug} gameLoop={gameLoop} />
    </div>
  )
}
