import React from 'react'
import useEntityComponentSystem, {
  useGameLoop,
  useGameEvents,
  useKeysDown,
} from '../src'

import { GameWindow, initialEntities, initialSystems } from './breakout'

// Challenge 1: Create a Movement System
// For each entity with velocity and position,
// add its velocity "[x, y]" to its position "[x, y]"
function movementSystem({ entities }) {
  entities.forEach(entity => {
    if ('velocity' in entity && 'position' in entity) {
      entity.position[0] += entity.velocity[0]
      entity.position[1] += entity.velocity[1]
    }
  })
}

// Challenge 2: Handle the Block Hit Event
// For each gameEvent of type: "{ type: 'hit', id: '...'}",
// destroy the block
function blockHitSystem({ gameEvents, destroyEntity }) {
  gameEvents.forEach(event => {
    if (event.type === 'hit') {
      destroyEntity(event.entityId)
    }
  })
}

// Challenge 3: Create a Score-keeping Entity, Component & System
// - Create a new Renderer for the Score
// - Assume score will be a "component" (aka props.score)
// - Render the score in the top right corner
function Score(props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        color: 'white',
        fontSize: 50,
        fontFamily: 'Operator Mono',
        fontWeight: 'bold',
      }}
    >
      {props.score}
    </div>
  )
}
// - Add a score component to the scoreEntity
const scoreEntity = { Renderer: Score, score: 0 }

// - For each 'hit' gameEvent, add points to the score
function scoreSystem({ entities, entitiesMap, gameEvents }) {
  const scoreEntity = entities.find(entity => 'score' in entity)
  gameEvents.forEach(event => {
    if (event.type === 'hit') {
      const block = entitiesMap[event.entityId]
      if (block && block.points) {
        scoreEntity.score += block.points
      }
    }
  })
}

// Challenge 4: Create a win system
function winSystem() {
  let wonYet = false
  return ({ entities, gameLoop, createEntity }) => {
    const blocks = entities.filter(e => e.name === 'block')
    if (blocks.length < 1 && !wonYet) {
      wonYet = true
      createEntity({
        Renderer: () => (
          <div
            style={{
              fontFamily: 'Operator Mono',
              position: 'relative',
              justifySelf: 'center',
              alignSelf: 'center',
              flex: 1,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <h1 style={{ fontSize: 72, margin: 0 }}>Nice Job!</h1>
            <h1 style={{ fontSize: 28, margin: 0 }}>
              useEntityComponentSystem
            </h1>
          </div>
        ),
      })
      setTimeout(() => {
        gameLoop.current.pause()
      }, 10)
    }
  }
}

export function Breakout() {
  const [entities, updater] = useEntityComponentSystem(
    [...initialEntities, scoreEntity],
    [
      ...initialSystems,
      movementSystem,
      blockHitSystem,
      scoreSystem,
      winSystem(),
    ],
  )

  const { dispatchGameEvent, flushGameEvents } = useGameEvents()
  const getKeysDown = useKeysDown()

  const gameLoop = useGameLoop(() => {
    updater({
      gameEvents: flushGameEvents(),
      dispatchGameEvent,
      keysDown: getKeysDown(),
      gameLoop,
    })
  })

  return <GameWindow>{entities}</GameWindow>
}

Breakout.story = {
  name: 'Breakout',
}

export default {
  title: 'Breakout',
}
