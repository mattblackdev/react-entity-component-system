import React from 'react'
import { useEntityComponentSystem, useGameLoop } from '../../src'
import { Code } from '../helpers/Code'

const counterEntity = {
  Renderer: ({ color }) => <h4 style={{ color }}>I'm {color}</h4>,
}

const colorSystem = colorToSet => ({ entities }) => {
  entities.forEach(entity => {
    if (entity.color !== colorToSet) {
      entity.color = colorToSet
    }
  })
}

const scenes = {
  0: [[counterEntity], [colorSystem('blue')]],
  1: [[counterEntity], [colorSystem('red')]],
}

export function Swapping() {
  const [sceneIndex, setScene] = React.useState(0)
  const [entities, updater] = useEntityComponentSystem(...scenes[sceneIndex])
  useGameLoop(updater)

  return (
    <div>
      <button onClick={() => setScene(sceneIndex ? 0 : 1)}>
        Switch To Scene {sceneIndex ? 0 : 1}
      </button>
      {entities}
      <Code code={code} />
    </div>
  )
}

const code = `import React from 'react'
import { useEntityComponentSystem, useGameLoop } from 'react-entity-component-system'

const counterEntity = {
  Renderer: ({ color }) => <h4 style={{ color }}>I'm {color}</h4>,
}

const colorSystem = colorToSet => ({ entities }) => {
  entities.forEach(entity => {
    if (entity.color !== colorToSet) {
      entity.color = colorToSet
    }
  })
}

const scenes = {
  0: [[counterEntity], [colorSystem('blue')]],
  1: [[counterEntity], [colorSystem('red')]],
}

export function Swapping() {
  const [sceneIndex, setScene] = React.useState(0)
  const [entities, updater] = useEntityComponentSystem(...scenes[sceneIndex])
  useGameLoop(updater)

  return (
    <div>
      <button onClick={() => setScene(sceneIndex ? 0 : 1)}>
        Switch To Scene {sceneIndex ? 0 : 1}
      </button>
      {entities}
    </div>
  )
}
`
