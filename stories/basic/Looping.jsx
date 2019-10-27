import React from 'react'
import useECS, { useGameLoop } from '../../src'
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
  const [entities, updater] = useECS(initialEntities, systems)

  useGameLoop(updater)

  return (
    <div>
      {entities}
      <Code code={code} />
    </div>
  )
}

const code = `import useECS, { useGameLoop } from 'react-entity-component-system'

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
  const [entities, updater] = useECS(initialEntities, systems)
  useGameLoop(updater)

  return <div>{entities}</div>
}`
