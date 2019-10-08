export function ballCollisionSystem({ entities, dispatchGameEvent }) {
  const ball = entities.find(
    e => e.name === 'ball' && e.collider.collidingWith.length,
  )
  if (ball) {
    const collidingWith = ball.collider.collidingWith[0]
    const collidingWithType = collidingWith.collider.type
    switch (collidingWithType) {
      case 'paddle':
        ball.velocity[1] *= -1
        break
      case 'block':
        ball.velocity[1] *= -1
        dispatchGameEvent({ type: 'hit', entityId: collidingWith.id })
        break
      default:
        break
    }
  }
}
