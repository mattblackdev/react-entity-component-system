import React from 'react'
import { useImmer } from 'use-immer'

import { defaultGetInitialEntities } from './helpers/defaultGetInitialEntities.js'
import { defaultRenderEntities } from './helpers/defaultRenderEntities.jsx'
import { defaultUniqueId } from './helpers/defaultUniqueId.js'

export function useEntityComponentSystem(
  initialEntities = [],
  systems = [],
  {
    getInitialEntities = defaultGetInitialEntities,
    getUniqueId = defaultUniqueId,
    renderEntities = defaultRenderEntities,
  } = {},
) {
  const [entities, updateEntities] = useImmer(
    getInitialEntities(initialEntities, getUniqueId),
  )

  const updater = React.useCallback(
    (userArgsOrArgsGetter = {}) => {
      updateEntities(entitiesDraft => {
        const entitiesToCreate = []
        const entitiesToDestroy = []

        function destroyEntity(id) {
          entitiesToDestroy.push(id)
        }

        function createEntity(entity) {
          entitiesToCreate.push(entity)
        }

        const userArgs =
          typeof userArgsOrArgsGetter === 'function'
            ? userArgsOrArgsGetter()
            : userArgsOrArgsGetter

        const systemArgs = {
          entities: Object.values(entitiesDraft),
          entitiesMap: entitiesDraft,
          createEntity,
          destroyEntity,
          ...userArgs,
        }

        for (const system of systems) {
          system(systemArgs)
        }

        for (const id of entitiesToDestroy) {
          delete entitiesDraft[id]
        }

        for (const entity of entitiesToCreate) {
          const id = getUniqueId()
          entity.id = id
          entitiesDraft[id] = entity
        }
      })
    },
    [updateEntities, systems, getUniqueId],
  )

  return [renderEntities(entities), updater, entities]
}
