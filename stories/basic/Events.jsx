import React from 'react'
import { useEntityComponentSystem, useGameLoop, useGameEvents } from '../../src'
import { Code } from '../helpers/Code'

function ColorfulEvent({ event, createdAt }) {
  return <li style={{ color: event }}>{event}</li>
}

function eventSystem({ gameEvents, createEntity }) {
  gameEvents.forEach(event => {
    createEntity({ Renderer: ColorfulEvent, event })
  })
}

const initialEntities = []
const systems = [eventSystem]

export function Events() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)
  const { dispatchGameEvent, flushGameEvents } = useGameEvents()
  const handleFrame = React.useCallback(() => {
    updater({
      gameEvents: flushGameEvents(),
    })
  }, [updater, flushGameEvents])
  useGameLoop(handleFrame)

  return (
    <div>
      <button onClick={() => dispatchGameEvent('red')}>red</button>
      <button onClick={() => dispatchGameEvent('green')}>green</button>
      <button onClick={() => dispatchGameEvent('blue')}>blue</button>
      <ul>{entities}</ul>
      <Code code={code} />
    </div>
  )
}

const code = `import React from 'react'
import { useEntityComponentSystem, useGameLoop, useGameEvents } from 'react-entity-component-system'

function ColorfulEvent({ event }) {
  return <li style={{ color: event }}>{event}</li>
}

function eventSystem({ gameEvents, createEntity }) {
  gameEvents.forEach(event => {
    createEntity({ Renderer: ColorfulEvent, event })
  })
}

const initialEntities = []
const systems = [eventSystem]

export function Events() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)
  const { dispatchGameEvent, flushGameEvents } = useGameEvents()
  const handleFrame = React.useCallback(() => {
    updater({
      gameEvents: flushGameEvents(),
    })
  }, [updater, flushGameEvents])
  useGameLoop(handleFrame)

  return (
    <div>
      <button onClick={() => dispatchGameEvent('red')}>red</button>
      <button onClick={() => dispatchGameEvent('green')}>green</button>
      <button onClick={() => dispatchGameEvent('blue')}>blue</button>
      <ul>{entities}</ul>
    </div>
  )
}
`
