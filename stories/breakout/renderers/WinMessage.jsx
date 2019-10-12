import React from 'react'

export function WinMessage() {
  return (
    <div
      style={{
        position: 'relative',
        justifySelf: 'center',
        alignSelf: 'center',
        flex: 1,
        textAlign: 'center',
        color: 'white',
      }}
    >
      <h1 style={{ fontSize: 72, margin: 0 }}>Nice Job!</h1>
      <h1 style={{ fontSize: 28, margin: 0 }}>useEntityComponentSystem</h1>
    </div>
  )
}
