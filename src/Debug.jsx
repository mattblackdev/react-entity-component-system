import React from 'react'
import stringifyObject from 'stringify-object'
import FPS from 'fps'

function useToggle(initial, callback) {
  const [on, set] = React.useState(initial)
  function toggle() {
    set(on => {
      callback && callback()
      return !on
    })
  }
  return [on, toggle]
}

function useFPS() {
  const [fps, setFps] = React.useState(0)
  const ticker = React.useRef({})
  React.useEffect(() => {
    ticker.current = new FPS({ every: 20 })
    ticker.current.on(
      'data',
      fps => console.log('tick', fps) || setFps(Math.trunc(fps)),
    )
    return () => {
      ticker.current = {}
    }
  }, [])
  function sample() {
    ticker.current.tick && ticker.current.tick()
  }
  return [fps, sample]
}

export function Debug({ entities, gameLoop }) {
  const [paused, togglePaused] = useToggle(false, () =>
    gameLoop.current.toggle(),
  )
  const [show, toggleShow] = useToggle(false)
  const [fps, sampleFPS] = useFPS()
  sampleFPS()
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        whiteSpace: 'pre',
        color: 'white',
        fontSize: 14,
        fontFamily: '"Courier New", monospace',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'rgba(10,10,10,0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: show ? 0 : 15,
        }}
      >
        <span>{fps} </span>
        <button onClick={toggleShow}>{show ? 'Hide' : 'Debug'}</button>
        <button onClick={togglePaused}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={() => console.log(entities)}>Log</button>
      </div>
      <DebugInner show={show} entities={entities} />
    </div>
  )
}

function DebugInner({ show, entities }) {
  const [content, setContent] = React.useState('')

  React.useEffect(() => {
    if (show) {
      setContent(
        stringifyObject(entities, {
          indent: '    ',
          inlineCharacterLimit: 40,
          transform,
        }),
      )
    }
  }, [show, entities])

  if (show) {
    return content
  } else {
    return null
  }
}

function transform(obj, prop, originalResult) {
  if (typeof obj[prop] === 'function') {
    return obj[prop].name || '[Function]'
  } else if (typeof obj[prop] === 'number') {
    return obj[prop] % 1 ? obj[prop].toFixed(2) : obj[prop]
  } else {
    return originalResult
  }
}
