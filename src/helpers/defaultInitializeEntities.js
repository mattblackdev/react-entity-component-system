import { defaultUniqueId } from './defaultUniqueId'

export function initializeEntity(
  { children = [], ...entity },
  entityMap,
  parentId = null,
  getUniqueId = defaultUniqueId(),
) {
  entity.id = getUniqueId()
  entity.parentId = parentId
  entity.childrenIds = children.map(childEntity =>
    initializeEntity(childEntity, entityMap, entity.id, getUniqueId),
  )
  entityMap.set(entity.id, entity)
  return entity.id
}

export function defaultInitializeEntities(
  initialEntities = [],
  { getUniqueId = defaultUniqueId(), entityMap = new Map() } = {},
) {
  initialEntities.forEach(entity =>
    initializeEntity(entity, entityMap, null, getUniqueId),
  )
  return entityMap
}
