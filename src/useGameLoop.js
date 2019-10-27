import React from 'react'
import raf from 'raf'

import { useConsoleWarnIfInvokedTooManyRendersInARow } from './helpers/useConsoleWarnIfInvokedTooManyRendersInARow'

export function useGameLoop(
  updater,
  {
    startImmediately = true,
    now = performance.now.bind(window.performance),
  } = {},
) {
  const gameLoop = React.useRef({
    updater,
    running: startImmediately,
    startTime: startImmediately ? now() : -1,
    endTime: -1,
    now,
    start: () => {
      if (!gameLoop.current.running) {
        if (gameLoop.current.endTime > 0) {
          const timeDiff = gameLoop.current.now() - gameLoop.current.endTime
          gameLoop.current.startTime += timeDiff
        }
        gameLoop.current.running = true
      }
    },
    pause: () => {
      if (gameLoop.current.running) {
        gameLoop.current.endTime = gameLoop.current.now()
        gameLoop.current.running = false
      }
    },
    toggle: () => {
      if (gameLoop.current.running) {
        gameLoop.current.pause()
      } else {
        gameLoop.current.start()
      }
    },
  })

  const warnIfCallbackIsRecreatedMoreThanTwoRendersInARow = useConsoleWarnIfInvokedTooManyRendersInARow(
    2,
    'useGameloop callback was recreated more than two renders in a row.\nYou may need to wrap it in React.useCallback.',
  )
  React.useEffect(() => {
    warnIfCallbackIsRecreatedMoreThanTwoRendersInARow()
    gameLoop.current.updater = updater
  }, [updater, warnIfCallbackIsRecreatedMoreThanTwoRendersInARow])

  const tick = React.useCallback(() => {
    const { running, updater, startTime } = gameLoop.current
    if (running) {
      updater(gameLoop.current.now() - startTime, gameLoop)
    }
    raf(tick)
  }, [gameLoop])

  React.useEffect(tick, [tick])

  return gameLoop
}
