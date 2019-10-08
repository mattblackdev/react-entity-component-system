import React from 'react'

export const Ball = props => (
  <div
    style={{
      position: 'absolute',
      left: props.position[0],
      top: props.position[1],
      width: props.collider.width,
      height: props.collider.height,
      borderRadius: props.collider.width / 2,
      border: '1px solid #aaa',
      background: '#eee',
      boxSizing: 'border-box',
    }}
  />
)
