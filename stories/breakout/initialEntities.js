import { Ball, Paddle, Block, Score } from './renderers'

export const initialEntities = [
  {
    Renderer: Ball,
    position: [112, 256],
    velocity: [4, 4],
    collider: { type: 'ball', width: 24, height: 24 },
    name: 'ball',
  },
  {
    Renderer: Paddle,
    position: [208, 424],
    collider: { type: 'paddle', width: 96, height: 24 },
    name: 'paddle',
  },
  ...[['red', 'red', 'red', 'red'], ['blue', 'blue', 'blue', 'blue']].reduce(
    (blocks, row, j) => [
      ...blocks,
      ...row.map((color, k) => ({
        Renderer: Block,
        position: [128 + k * 64, 128 - j * 32],
        collider: { type: 'block', width: 64, height: 32 },
        color,
        points: color === 'blue' ? 200 : 100,
        name: 'block',
      })),
    ],
    [],
  ),
  { Renderer: Score, score: 0 },
]
