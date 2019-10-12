export function scoreSystem({ entities, entitiesMap, gameEvents }) {
  const scoreEntity = entities.find(entity => 'score' in entity)
  gameEvents.forEach(event => {
    if (event.type === 'hit') {
      const block = entitiesMap[event.entityId]
      if (block && block.points) {
        scoreEntity.score += block.points
      }
    }
  })
}
