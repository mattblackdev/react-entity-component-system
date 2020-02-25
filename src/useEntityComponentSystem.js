import React from 'react'
import { useImmer } from 'use-immer'

import { defaultInitializeEntities } from './helpers/defaultInitializeEntities.js'
import {
  defaultInitializeSystems,
  getFilteredEntities,
  addEntitiesToFilters,
  removeEntityFromFilters,
} from './helpers/defaultInitializeSystems.js'
import { defaultRenderEntities } from './helpers/defaultRenderEntities.jsx'
import { defaultUniqueId } from './helpers/defaultUniqueId.js'
import { useConsoleWarnIfInvokedTooManyRendersInARow } from './helpers/useConsoleWarnIfInvokedTooManyRendersInARow.js'

const initialState = {
  entities: new Map(),
  systems: new Map(),
  filters: new Map(),
}
const defaultInitialEntities = []
const defaultInitialSystems = []
const defaultGetUniqueId = defaultUniqueId()
export function useEntityComponentSystem(
  initialEntities = defaultInitialEntities,
  initialSystems = defaultInitialSystems,
  {
    initializeEntities = defaultInitializeEntities,
    initializeSystems = defaultInitializeSystems,
    renderEntities = defaultRenderEntities,
    getUniqueId = defaultGetUniqueId,
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
    warnIfInitializedMoreThanTwoRendersInARow()
    updateState(draft => {
      const entities = initializeEntities(initialEntities, getUniqueId)
      const { filters, systems } = initializeSystems(
        entities,
        initialSystems,
        getUniqueId,
      )
      draft.entities = entities
      draft.filters = filters
      draft.systems = systems
    })
  }, [
    initialEntities,
    initializeEntities,
    initializeSystems,
    initialSystems,
    updateState,
    getUniqueId,
    warnIfInitializedMoreThanTwoRendersInARow,
  ])

  const updater = React.useCallback(
    (userArgsOrArgsGetter = {}) => {
      updateState(draft => {
        const entitiesToDestroy = []
        function destroyEntity(id) {
          entitiesToDestroy.push(id)
        }

        const entitiesToCreate = []
        function createEntity(entity) {
          entitiesToCreate.push(entity)
        }

        const componentsToAdd = []
        function addComponent(entityID, componentKey, componentValue) {
          componentsToAdd.push([entityID, componentKey, componentValue])
        }

        const componentsToRemove = []
        function removeComponent(entityID, componentKey) {
          componentsToRemove.push([entityID, componentKey])
        }

        const userArgs =
          typeof userArgsOrArgsGetter === 'function'
            ? userArgsOrArgsGetter()
            : userArgsOrArgsGetter
        const systemArgs = {
          entities: draft.entities,
          createEntity,
          destroyEntity,
          addComponent,
          removeComponent,
          ...userArgs,
        }

        draft.systems.forEach(({ system, filterMap }) => {
          const filteredEntities = getFilteredEntities(
            filterMap,
            draft.filters,
            draft.entities,
          )
          system({ filteredEntities, ...systemArgs })
        })

        if (entitiesToDestroy.length) {
          console.debug('Destroying entities', entitiesToDestroy)
          for (const id of entitiesToDestroy) {
            delete draft.entities[id]
            removeEntityFromFilters(draft.filters, id)
          }
        }

        if (entitiesToCreate.length) {
          console.debug('Creating entities', entitiesToCreate)
          const newEntities = initializeEntities(entitiesToCreate, {
            getUniqueId,
            entityMap: draft.entities,
          })
          addEntitiesToFilters(draft.filters, newEntities)
        }

        if (componentsToRemove.length) {
          console.debug('Removing components', componentsToRemove)
          componentsToRemove.forEach(([entityID, componentKey]) => {
            delete draft.entities[entityID][componentKey]
          })
        }

        if (componentsToAdd.length) {
          console.debug('Adding components', componentsToAdd)
          componentsToAdd.forEach(
            ([entityID, componentKey, componentValue]) => {
              draft.entities[entityID][componentKey] = componentValue
            },
          )
        }
      })
    },
    [updateState, getUniqueId, initializeEntities],
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
