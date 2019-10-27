import React from 'react'
import { useEntityComponentSystem, useGameLoop } from '../../src'
import { Code } from '../helpers/Code'

const counterEntity = {
  Renderer: props => <h4>{props.count}</h4>,
  count: 0,
}

function frameCounterSystem({ entities }) {
  entities.forEach(entity => entity.count++)
}

const initialEntities = [counterEntity]
const systems = [frameCounterSystem]

export function Looping() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)

  useGameLoop(updater)

  return (
    <div>
      {entities}
      <Code code={code} />
    </div>
  )
}

const code = `import { useEntityComponentSystem, useGameLoop } from 'react-entity-component-system'

const counterEntity = {
  Renderer: props => <h4>{props.count}</h4>,
  count: 0,
}

function frameCounterSystem({ entities }) {
  entities.forEach(entity => entity.count++)
}

const initialEntities = [counterEntity]
const systems = [frameCounterSystem]

export function Looping() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)
  useGameLoop(updater)

  return <div>{entities}</div>
}`
