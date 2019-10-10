import React from 'react'
import useEntityComponentSystem from '../../src'

const counterEntity = {
  Renderer: props => <h4>{props.count}</h4>,
  count: 0,
}

function frameCounterSystem({ entities }) {
  entities.forEach(entity => entity.count++)
}

export function BasicECS() {
  const [entities, updater] = useEntityComponentSystem(
    [counterEntity],
    [frameCounterSystem],
  )

  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
    </div>
  )
}
