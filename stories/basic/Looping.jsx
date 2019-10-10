import React from 'react'
import useEntityComponentSystem, { useGameLoop } from '../../src'

const counterEntity = {
  Renderer: props => <h4>{props.count}</h4>,
  count: 0,
}

function frameCounterSystem({ entities }) {
  entities.forEach(entity => entity.count++)
}

export function Looping() {
  const [entities, updater] = useEntityComponentSystem(
    [counterEntity, counterEntity],
    [frameCounterSystem],
  )

  useGameLoop(updater)

  return <div>{entities}</div>
}
