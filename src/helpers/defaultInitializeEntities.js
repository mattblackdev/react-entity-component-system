export function defaultInitializeEntities(initialEntitiesArray, getUniqueId) {
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

  return initialEntitiesArray.reduce(entityReducer(), {})
}
