import React from 'react'

export function Code({ code }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.04)',
        border: '1px inset black',
        borderRadius: 5,
      }}
    >
      <code style={{ whiteSpace: 'pre' }}>{code}</code>
    </div>
  )
}
