import React, { Fragment } from 'react'
import useEntityComponentSystem, {
  useGameLoop,
  useGameEvents,
  useKeysDown,
} from '../src'

import {
  GameWindow,
  initialEntities,
  initializeSystems,
  useClickToStart,
} from './breakout'

export function Breakout() {
  const [systems] = React.useState(initializeSystems)
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)

  const { dispatchGameEvent, flushGameEvents } = useGameEvents()
  const getKeysDown = useKeysDown()

  const gameLoop = useGameLoop(
    () => {
      updater({
        gameEvents: flushGameEvents(),
        dispatchGameEvent,
        keysDown: getKeysDown(),
        gameLoop,
      })
    },
    { startImmediately: false },
  )

  useClickToStart(gameLoop)

  return (
    <Fragment>
      <Instructions />
      <GameWindow>{entities}</GameWindow>
    </Fragment>
  )
}

function Instructions() {
  return (
    <div>
      <h1>Instructions</h1>
      <p>
        Use the arrow keys{' '}
        <span role="img" aria-label="">
          ⬅️➡️
        </span>{' '}
        to move the paddle.
      </p>
      <p>Break all the blocks to win.</p>
      <p>Click anywhere to start.</p>
    </div>
  )
}

Breakout.story = {
  name: 'Breakout',
}

export default {
  title: 'Breakout',
}
