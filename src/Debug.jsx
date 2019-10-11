import React from 'react'
import stringifyObject from 'stringify-object'

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

const Button = props => <button {...props} style={{ minWidth: 80 }} />
export function Debug({ entities, gameLoop }) {
  const [paused, togglePaused] = useToggle(false, () =>
    gameLoop.current.toggle(),
  )
  const [show, toggleShow] = useToggle(false)
  const backgroundColor = show ? 'rgba(10,10,10,0.5)' : 'inherit'
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
        overflow: 'auto',
        backgroundColor,
        maxWidth: '80%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={toggleShow}>{show ? 'Hide' : 'Debug'}</Button>
        <Button onClick={togglePaused}>{paused ? 'Resume' : 'Pause'}</Button>
        <Button onClick={() => console.log(entities)}>Log</Button>
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
          indent: '  ',
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
