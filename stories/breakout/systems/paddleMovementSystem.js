export function paddleMovementSystem({ entities, keysDown }) {
  const paddle = entities.find(e => e.name === 'paddle')
  if (keysDown.includes('ArrowLeft') && paddle.position[0] > 0) {
    paddle.position[0] -= 8
  }
  if (
    keysDown.includes('ArrowRight') &&
    paddle.position[0] < 512 - paddle.collider.width
  ) {
    paddle.position[0] += 8
  }
}
