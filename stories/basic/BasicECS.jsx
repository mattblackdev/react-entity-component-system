import React from 'react'
import { useEntityComponentSystem } from '../../src'
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

export function BasicECS() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)
  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
      <Code code={code} />
    </div>
  )
}

const code = `import React from 'react'
import { useEntityComponentSystem } from 'react-entity-component-system'

const counterEntity = {
  Renderer: props => <h4>{props.count}</h4>,
  count: 0,
}

function frameCounterSystem({ entities }) {
  entities.forEach(entity => entity.count++)
}

const initialEntities = [counterEntity]
const systems = [frameCounterSystem]

export function BasicECS() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)
  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
    </div>
  )
}
`
