import React from 'react'
import useEntityComponentSystem, {
  useGameLoop,
  useGameEvents,
  useKeysDown,
} from '../src'

function getDisplayCountStyle(isCounting) {
  return { fontSize: 24, padding: 10, color: isCounting ? 'red' : 'inherit' }
}
const DisplayCount = ({ count, isCounting }) => (
  <div style={getDisplayCountStyle(isCounting)}>{count}</div>
)

const counterEntity = { Renderer: DisplayCount, count: 0, isCounting: true }

const frameCounterSystem = ({ entities }) => {
  for (const entity of entities) {
    if ('count' in entity && entity.isCounting) {
      entity.count++
    }
  }
}

const initialEntities = [counterEntity]
const initialSystems = [frameCounterSystem]

export function BasicECS() {
  const [entities, updater] = useEntityComponentSystem(
    initialEntities,
    initialSystems,
  )

  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
    </div>
  )
}

BasicECS.story = {
  name: 'Frame Counter',
}

export function LoopingECS() {
  const [entities, updater] = useEntityComponentSystem(
    initialEntities,
    initialSystems,
  )

  useGameLoop(updater)

  return <div>{entities}</div>
}

LoopingECS.story = {
  name: 'Game Loop',
}

function resetSystem({ entities, gameEvents }) {
  if (gameEvents.includes('reset')) {
    for (const entity of entities) {
      if ('count' in entity) {
        entity.count = 0
      }
    }
  }
}

export function LoopingECSWithEvents() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, [
    frameCounterSystem,
    resetSystem,
  ])

  const { dispatchGameEvent, flushGameEvents } = useGameEvents()

  useGameLoop(() => {
    updater({
      gameEvents: flushGameEvents(),
    })
  })

  function handleOnClick() {
    dispatchGameEvent('reset')
  }

  return (
    <div>
      <button onClick={handleOnClick}>Reset</button>
      {entities}
    </div>
  )
}

LoopingECSWithEvents.story = {
  name: 'Game Events',
}

function initializeSelectCounterSystem() {
  let lastSelection = 0

  return function selectCounterSystem({ entities, keysDown }) {
    if (keysDown.includes('ArrowDown') && Date.now() > lastSelection + 300) {
      lastSelection = Date.now()
      const selectableEntities = entities.filter(e => 'isCounting' in e)
      const selectedIndex = selectableEntities.indexOf(
        selectableEntities.find(e => e.isCounting),
      )
      if (selectedIndex === -1) return

      const nextIndex =
        selectedIndex < selectableEntities.length - 1 ? selectedIndex + 1 : 0

      selectableEntities[selectedIndex].isCounting = false
      selectableEntities[nextIndex].isCounting = true
    }
  }
}

export function LoopingECSWithKeyboardInput() {
  const [entities, updater] = useEntityComponentSystem(
    [counterEntity, { ...counterEntity, isCounting: false }],
    [frameCounterSystem, resetSystem, initializeSelectCounterSystem()],
  )

  const { dispatchGameEvent, flushGameEvents } = useGameEvents()
  const getKeysDown = useKeysDown()

  useGameLoop(() => {
    updater({
      gameEvents: flushGameEvents(),
      keysDown: getKeysDown(),
    })
  })

  function handleOnClick() {
    dispatchGameEvent('reset')
  }

  return (
    <div>
      <button onClick={handleOnClick}>Reset</button>
      {entities}
    </div>
  )
}

LoopingECSWithKeyboardInput.story = {
  name: 'Keys Down',
}

export default {
  title: 'Basic ECS',
}
