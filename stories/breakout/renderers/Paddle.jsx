import React from 'react'

export const Paddle = props => (
  <div
    style={{
      position: 'absolute',
      left: props.position[0],
      top: props.position[1],
      width: props.collider.width,
      height: props.collider.height,
      border: '1px solid #aaa',
      background: '#eee',
      borderRadius: props.collider.height / 2,
      boxSizing: 'border-box',
    }}
  />
)
