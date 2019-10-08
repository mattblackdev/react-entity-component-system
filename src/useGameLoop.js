import React from 'react'
import GameLoop from 'gameloop'

export function useGameLoop(updater) {
  const gameLoop = React.useRef(GameLoop({ fps: 60 }))
  const memoizedUpdater = React.useCallback(updater, [])
  React.useEffect(() => {
    console.debug('useGameLoop: started')
    gameLoop.current.on('update', memoizedUpdater)
    gameLoop.current.on('pause', () => {
      console.debug('useGameLoop: paused')
    })
    gameLoop.current.on('resume', () => {
      console.debug('useGameLoop: resumed')
    })
    gameLoop.current.start()

    const end = () => {
      console.debug('useGameLoop: ended')
      if (gameLoop.current) {
        gameLoop.current.end()
      }
    }

    return end
  }, [memoizedUpdater])

  return gameLoop
}
