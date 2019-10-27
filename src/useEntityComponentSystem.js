import React from 'react'
import { useImmer } from 'use-immer'

import { defaultInitializeEntities } from './helpers/defaultInitializeEntities.js'
import { defaultRenderEntities } from './helpers/defaultRenderEntities.jsx'
import { defaultUniqueId } from './helpers/defaultUniqueId.js'
import { useConsoleWarnIfInvokedTooManyRendersInARow } from './helpers/useConsoleWarnIfInvokedTooManyRendersInARow.js'

export function useEntityComponentSystem(
  initialEntities = [],
  systems = [],
  {
    initializeEntities = defaultInitializeEntities,
    getUniqueId = defaultUniqueId,
    renderEntities = defaultRenderEntities,
    debug = false,
  } = {},
) {
  const [entities, updateEntities] = useImmer({})

  const warnIfEntitiesUpdatedMoreThanTwoRendersInARow = useConsoleWarnIfInvokedTooManyRendersInARow(
    2,
    `Entities initialized more than 2 renders in a row.
    You may want to wrap them in React.useState or move the array outside of the component using useEntityComponentSystem.`,
  )
  React.useEffect(() => {
    debug && console.debug('Initialilizing entities')
    warnIfEntitiesUpdatedMoreThanTwoRendersInARow()
    updateEntities(() => initializeEntities(initialEntities, getUniqueId))
  }, [
    initialEntities,
    initializeEntities,
    updateEntities,
    getUniqueId,
    warnIfEntitiesUpdatedMoreThanTwoRendersInARow,
    debug,
  ])

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

        if (entitiesToDestroy.length) {
          debug && console.debug('Destroying entities', entitiesToDestroy)
          for (const id of entitiesToDestroy) {
            delete entitiesDraft[id]
          }
        }

        if (entitiesToCreate.length) {
          debug && console.debug('Creating entities', entitiesToCreate)
          Object.assign(
            entitiesDraft,
            initializeEntities(entitiesToCreate, getUniqueId),
          )
        }
      })
    },
    [updateEntities, systems, initializeEntities, getUniqueId, debug],
  )

  const warnIfUpdaterIsRecreatedMoreThanTwoRendersInARow = useConsoleWarnIfInvokedTooManyRendersInARow(
    2,
    'useEntityComponentSystem updater recreated more than two renders in a row.\nYou may want to wrap systems in React.useState or move the array outside the component using useEntityComponentSystem.',
  )
  React.useEffect(() => {
    warnIfUpdaterIsRecreatedMoreThanTwoRendersInARow()
  }, [updater, warnIfUpdaterIsRecreatedMoreThanTwoRendersInARow])

  return [renderEntities(entities), updater, entities]
}
