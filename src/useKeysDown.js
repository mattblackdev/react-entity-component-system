import React from 'react'

export function useKeysDown() {
  const keysdown = React.useRef([])

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (keysdown.current.includes(e.code)) return
      keysdown.current.push(e.code)
    }
    function handleKeyUp(e) {
      keysdown.current.splice(keysdown.current.indexOf(e.code), 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keysdown])

  return keysdown
}
