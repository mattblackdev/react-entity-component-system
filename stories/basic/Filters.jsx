import React from 'react'
import { useEntityComponentSystem, Debug } from '../../src'
import { Code } from '../helpers/Code'

const rainbowEntity = {
  Renderer: props => (
    <span style={{ backgroundColor: props.color, height: 20, width: 20 }} />
  ),
}

const otherEntity = {
  Renderer: props => <h6>I dont do anything</h6>,
}

function rainbowSystem({ filteredEntities: { colorable } }) {
  colorable.forEach(entity => {
    entity.color = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'violet',
    ][Math.floor(Math.random() * 7)]
  })
}

rainbowSystem.filter = {
  colorable: ['color'],
}

const initialEntities = [rainbowEntity, otherEntity]
const systems = [rainbowSystem]

export function Filters() {
  const [entities, updater, debug] = useEntityComponentSystem(
    initialEntities,
    systems,
  )
  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
      <Code code={code} />
      <Debug entities={debug} />
    </div>
  )
}

const code = `import React from 'react'
import { useEntityComponentSystem, Debug } from '../../src'
import { Code } from '../helpers/Code'

const counterEntity = {
  Renderer: props => (
    <h4>
      Frames: {props.count} - Filtered Entities:{' '}
      {props.numberOfEntitiesWithCountComponent}
    </h4>
  ),
  count: 0,
  numberOfEntitiesWithCountComponent: 0,
}

const otherEntity = {
  Renderer: props => <h6>I dont do anything</h6>,
}

function frameCounterSystem({ filteredEntities }) {
  filteredEntities.forEach(entity => {
    entity.count++
    entity.numberOfEntitiesWithCountComponent = filteredEntities.length
  })
}

frameCounterSystem.filter = entities =>
  entities.filter(entity => 'count' in entity)

const initialEntities = [counterEntity, otherEntity]
const systems = [frameCounterSystem]

export function Filters() {
  const [entities, updater, debug] = useEntityComponentSystem(
    initialEntities,
    systems,
  )
  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
      <Code code={code} />
      <Debug entities={debug} />
    </div>
  )
}
`
