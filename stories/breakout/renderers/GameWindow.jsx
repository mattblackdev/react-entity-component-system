import React from 'react'

export const GameWindow = props => (
  <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      width: 512,
      height: 512,
      border: '2px solid #eee',
      background: '#333',
      boxSizing: 'border-box',
      margin: 'auto',
    }}
  >
    {props.children}
  </div>
)
