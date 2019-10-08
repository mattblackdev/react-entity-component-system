export function defaultGetInitialEntities(initialEntitiesArray, getUniqueId) {
  const entityReducer = (parentId = null) => (
    initialEntities,
    { children = [], ...entity },
  ) => {
    entity.id = getUniqueId()
    entity.parentId = parentId
    const entityChildren = children.reduce(entityReducer(entity.id), {})
    entity.childrenIds = Object.keys(entityChildren)
    return {
      ...initialEntities,
      [entity.id]: entity,
      ...entityChildren,
    }
  }

  return () => {
    console.debug('Initialilizing entities')
    return initialEntitiesArray.reduce(entityReducer(), {})
  }
}
