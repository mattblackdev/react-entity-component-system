import { vAdd } from 'vec-la-fp'

export function movementSystem({ entities }) {
  for (const entity of entities) {
    if ('velocity' in entity) {
      entity.position = vAdd(entity.velocity, entity.position)
    }
  }
}
