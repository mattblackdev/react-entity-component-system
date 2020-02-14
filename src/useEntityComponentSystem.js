import React from 'react'
import { useImmer } from 'use-immer'

import { defaultInitializeEntities } from './helpers/defaultInitializeEntities.js'
import { defaultFilterEntities } from './helpers/defaultFilterEntities.js'
import { defaultRenderEntities } from './helpers/defaultRenderEntities.jsx'
import { defaultUniqueId } from './helpers/defaultUniqueId.js'
import { useConsoleWarnIfInvokedTooManyRendersInARow } from './helpers/useConsoleWarnIfInvokedTooManyRendersInARow.js'

const initialState = {
  entities: {},
  systems: [],
  filters: [],
}

export function useEntityComponentSystem(
  initialEntities = [],
  systems = [],
  {
    initializeEntities = defaultInitializeEntities,
    filterEntities = defaultFilterEntities,
    renderEntities = defaultRenderEntities,
    getUniqueId = defaultUniqueId,
    debug = false,
  } = {},
) {
  const [state, updateState] = useImmer(initialState)

  const warnIfInitializedMoreThanTwoRendersInARow = useConsoleWarnIfInvokedTooManyRendersInARow(
    2,
    `useEntityComponentSystem has initialized more than 2 renders in a row.
    You may want to wrap the arguments in React.useState or move them outside 
    of the component using useEntityComponentSystem.`,
  )
  React.useEffect(() => {
    debug && console.debug('Initializing')
    warnIfInitializedMoreThanTwoRendersInARow()
    updateState(() => {
      const entitiesMap = initializeEntities(initialEntities, getUniqueId)
      const filters = filterEntities(Object.values(entitiesMap), systems)
      return {
        entities: entitiesMap,
        filters,
        systems,
      }
    })
  }, [
    initialEntities,
    initializeEntities,
    filterEntities,
    systems,
    updateState,
    getUniqueId,
    warnIfInitializedMoreThanTwoRendersInARow,
    debug,
  ])

  const updater = React.useCallback(
    (userArgsOrArgsGetter = {}) => {
      updateState(draft => {
        const entitiesToCreate = []
        const entitiesToDestroy = []
        const componentsToAdd = []
        const componentsToRemove = []

        function destroyEntity(id) {
          entitiesToDestroy.push(id)
        }

        function createEntity(entity) {
          entitiesToCreate.push(entity)
        }

        function addComponent(entityID, componentKey, componentValue) {
          componentsToAdd.push([entityID, componentKey, componentValue])
        }

        function removeComponent(entityID, componentKey) {
          componentsToRemove.push([entityID, componentKey])
        }

        const userArgs =
          typeof userArgsOrArgsGetter === 'function'
            ? userArgsOrArgsGetter()
            : userArgsOrArgsGetter

        const systemArgs = {
          entities: Object.values(draft.entities),
          entitiesMap: draft.entities,
          createEntity,
          destroyEntity,
          addComponent,
          removeComponent,
          ...userArgs,
        }

        draft.systems.forEach((system, i) => {
          const filteredEntities = draft.filters[i].map(
            id => draft.entities[id],
          )
          system({ filteredEntities, ...systemArgs })
        })

        let invalidateFilters = false
        if (entitiesToDestroy.length) {
          debug && console.debug('Destroying entities', entitiesToDestroy)
          invalidateFilters = true
          for (const id of entitiesToDestroy) {
            delete draft.entities[id]
          }
        }

        if (entitiesToCreate.length) {
          debug && console.debug('Creating entities', entitiesToCreate)
          invalidateFilters = true
          Object.assign(
            draft.entities,
            initializeEntities(entitiesToCreate, getUniqueId),
          )
        }

        if (componentsToRemove.length) {
          debug && console.debug('Removing components', componentsToRemove)
          invalidateFilters = true
          componentsToRemove.forEach(([entityID, componentKey]) => {
            delete draft.entities[entityID][componentKey]
          })
        }

        if (componentsToAdd.length) {
          debug && console.debug('Adding components', componentsToAdd)
          invalidateFilters = true
          componentsToAdd.forEach(
            ([entityID, componentKey, componentValue]) => {
              draft.entities[entityID][componentKey] = componentValue
            },
          )
        }

        if (invalidateFilters) {
          draft.filters = filterEntities(
            Object.values(draft.entities),
            draft.systems,
          )
        }
      })
    },
    [updateState, initializeEntities, getUniqueId, debug, filterEntities],
  )

  const warnIfUpdaterIsRecreatedMoreThanTwoRendersInARow = useConsoleWarnIfInvokedTooManyRendersInARow(
    2,
    `useEntityComponentSystem updater was recreated more than two renders in a row. 
     You may want to wrap systems in React.useState or move the array outside 
     the component using useEntityComponentSystem.`,
  )
  React.useEffect(() => {
    warnIfUpdaterIsRecreatedMoreThanTwoRendersInARow()
  }, [updater, warnIfUpdaterIsRecreatedMoreThanTwoRendersInARow])

  return [renderEntities(state.entities), updater, state.entities]
}
