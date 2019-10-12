export function blockHitSystem({ gameEvents, destroyEntity }) {
  gameEvents.forEach(event => {
    if (event.type === 'hit') {
      destroyEntity(event.entityId)
    }
  })
}
