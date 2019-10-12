import React from 'react'

export function useClickToStart(gameLoop) {
  const [started, setStarted] = React.useState(false)

  React.useEffect(() => {
    function handleStartGame() {
      setTimeout(() => {
        gameLoop.current.start()
      }, 300)
      setStarted(true)
    }
    if (!started) {
      document.addEventListener('mouseup', handleStartGame)
    } else {
      document.removeEventListener('mouseup', handleStartGame)
    }
    return () => document.removeEventListener('mouseup', handleStartGame)
  }, [started, setStarted, gameLoop])
}
