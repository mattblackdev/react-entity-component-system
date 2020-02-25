import hash from '../helpers/hashArrayOfStrings'
import { defaultUniqueId } from './defaultUniqueId'

export const filterEntity = (filter, entity) => {
  for (const componentName of filter) {
    if (!entity.hasOwnProperty(componentName)) {
      return false
    }
  }
  return true
}

export const filterEntities = (filter, entities) => {
  const entityIds = new Set()
  entities.forEach(e => filterEntity(filter, e) && entityIds.add(e.id))
  return entityIds
}

const defaultGetUniqueId = defaultUniqueId()
export const defaultInitializeSystems = (
  entities,
  initialSystems,
  getUniqueId = defaultGetUniqueId,
) => {
  const systems = new Map()
  const filters = new Map()

  initialSystems.forEach(system => {
    const id = getUniqueId()
    const filterMap = new Map()
    if (system.filter) {
      Object.keys(system.filter).forEach(systemFilterKey => {
        const requiredComponents = system.filter[systemFilterKey]
        const key = hash(requiredComponents)
        filterMap.set(systemFilterKey, key)
        if (!filters.has(key)) {
          filters.set(key, {
            entityIds: filterEntities(requiredComponents, entities),
            requiredComponents,
          })
        }
      })
    }
    systems.set(id, {
      id,
      system,
      filterMap,
    })
  })

  return {
    systems,
    filters,
  }
}

export const getFilteredEntities = (filterMap, filters, entities) => {
  const filteredEntities = {}
  Object.keys(filterMap).forEach(key => {
    filteredEntities[key] = Array.from(
      filters.get(filterMap[key]).values(),
      entityId => entities.get(entityId),
    )
  })
  return filteredEntities
}

export const removeEntityFromFilters = (filters, entityId) => {
  filters.forEach(filter => {
    filter.delete(entityId)
  })
}
