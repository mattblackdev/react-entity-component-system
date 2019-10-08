import React from 'react'

export const Block = props => (
  <div
    style={{
      position: 'absolute',
      left: props.position[0],
      top: props.position[1],
      width: props.collider.width,
      height: props.collider.height,
      border: '1px outset #aaa',
      background: props.color,
      boxSizing: 'border-box',
    }}
  />
)
