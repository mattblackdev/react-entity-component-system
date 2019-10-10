import React from 'react'
import { useImmer } from 'use-immer'

import { defaultInitializeEntities } from './helpers/defaultInitializeEntities.js'
import { defaultRenderEntities } from './helpers/defaultRenderEntities.jsx'
import { defaultUniqueId } from './helpers/defaultUniqueId.js'

export function useEntityComponentSystem(
  initialEntities = [],
  systems = [],
  {
    initializeEntities = defaultInitializeEntities,
    getUniqueId = defaultUniqueId,
    renderEntities = defaultRenderEntities,
  } = {},
) {
  const [entities, updateEntities] = useImmer(
    initializeEntities(initialEntities, getUniqueId),
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

        if (entitiesToCreate.length) {
          Object.assign(
            entitiesDraft,
            initializeEntities(entitiesToCreate, getUniqueId)(),
          )
        }
      })
    },
    [updateEntities, systems, initializeEntities, getUniqueId],
  )

  return [renderEntities(entities), updater, entities]
}
