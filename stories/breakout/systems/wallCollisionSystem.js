export function wallCollisionSystem({ entities, dispatchGameEvent }) {
  const ball = entities.find(e => e.name === 'ball')
  if (
    (ball.position[0] < 0 && ball.velocity[0] < 0) ||
    (ball.position[0] > 512 - ball.collider.width && ball.velocity[0] > 0)
  ) {
    ball.velocity[0] *= -1
  }
  if (ball.position[1] < 0 && ball.velocity[1] < 0) {
    ball.velocity[1] *= -1
  }
  if (ball.position[1] > 512 - ball.collider.height) {
    ball.velocity = [0, 0]
    dispatchGameEvent('gameover')
  }
}
