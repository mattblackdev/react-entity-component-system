import {
  paddleMovementSystem,
  collisionSystem,
  ballCollisionSystem,
  wallCollisionSystem,
} from './systems'

export const initialSystems = [
  collisionSystem([['ball', 'paddle'], ['ball', 'block']]),
  paddleMovementSystem,
  ballCollisionSystem,
  wallCollisionSystem,
]
