import React from 'react'

export function Score(props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
      }}
    >
      {props.score}
    </div>
  )
}
