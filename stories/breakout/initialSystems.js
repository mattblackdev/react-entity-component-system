import {
  paddleMovementSystem,
  collisionSystem,
  ballCollisionSystem,
  wallCollisionSystem,
} from './systems'

export const initialSystems = [
  paddleMovementSystem,
  collisionSystem([['ball', 'paddle'], ['ball', 'block']]),
  ballCollisionSystem,
  wallCollisionSystem,
]
