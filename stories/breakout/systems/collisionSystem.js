import boxIntersect from 'box-intersect'

export function collisionSystem(collisionFilter) {
  function shouldCollide(entityA, entityB) {
    for (const [a, b] of collisionFilter) {
      if (
        (entityA.collider.type === a && entityB.collider.type === b) ||
        (entityA.collider.type === b && entityB.collider.type === a)
      ) {
        return true
      }
    }
    return false
  }

  return ({ entities }) => {
    const boxes = []
    const ids = []

    for (const [id, entity] of Object.entries(entities)) {
      if ('collider' in entity && 'position' in entity) {
        entity.collider.collidingWith = []
        boxes.push([
          entity.position[0],
          entity.position[1],
          entity.position[0] + entity.collider.width,
          entity.position[1] + entity.collider.height,
        ])
        ids.push(id)
      }
    }

    boxIntersect(boxes, (a, b) => {
      const entityA = entities[ids[a]]
      const entityB = entities[ids[b]]
      if (shouldCollide(entityA, entityB)) {
        entityA.collider.collidingWith.push(entityB)
        entityB.collider.collidingWith.push(entityA)
      }
    })
  }
}
