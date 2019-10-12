import {
  paddleMovementSystem,
  collisionSystem,
  ballCollisionSystem,
  wallCollisionSystem,
  movementSystem,
  blockHitSystem,
  scoreSystem,
  winSystem,
} from './systems'

export const initializeSystems = () => [
  collisionSystem([['ball', 'paddle'], ['ball', 'block']]),
  paddleMovementSystem,
  ballCollisionSystem,
  wallCollisionSystem,
  movementSystem,
  blockHitSystem,
  scoreSystem,
  winSystem(),
]
