export const defaultFilterEntities = (entities, systems) => {
  return systems.map(system => {
    if ('filter' in system) {
      return system.filter(entities).map(entity => entity.id)
    } else {
      return []
    }
  })
}
