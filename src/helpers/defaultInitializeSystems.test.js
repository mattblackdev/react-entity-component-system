import {
  filterEntity,
  filterEntities,
  defaultInitializeSystems,
  getFilteredEntities,
  removeEntityFromFilters,
} from './defaultInitializeSystems'

import { makeMap } from './makeMap'

describe('filterEntity', () => {
  test('false if entity does not have components', () => {
    const filter = ['c1', 'c2']
    const entity = { c3: true }
    const result = filterEntity(filter, entity)
    expect(result).toBe(false)
  })

  test('true if entity has all components', () => {
    const filter = ['c3']
    const entity = { c3: true }
    const result = filterEntity(filter, entity)
    expect(result).toBe(true)
  })
})

describe('filterEntities', () => {
  test('ids of entities that pass the filter', () => {
    const filter = ['c1']
    const entities = [
      { id: '0', c1: true },
      { id: '1', c2: true },
      { id: '2', c1: true, c2: true },
    ]
    const result = filterEntities(filter, entities)
    expect(result).toStrictEqual(new Set(['0', '2']))
  })
})

describe('defaultInitializeSystems', () => {
  test('initializes systems with ids and filter maps', () => {
    const entities = makeMap({
      '0': { id: '0', c1: true },
      '1': { id: '1', c2: true },
      '2': { id: '2', c1: true, c2: true },
    })
    const sys = jest.fn()
    sys.filter = {
      allDaC1s: ['c1'],
    }
    const initialSystems = [sys]
    const result = defaultInitializeSystems(entities, initialSystems)
    expect(result).toStrictEqual({
      systems: makeMap({
        '0': {
          id: '0',
          system: sys,
          filterMap: makeMap({
            allDaC1s: '439.371621621621',
          }),
        },
      }),
      filters: makeMap({
        '439.371621621621': {
          entityIds: new Set(['0', '2']),
          requiredComponents: ['c1'],
        },
      }),
    })
  })
})

describe('getFilteredEntities', () => {
  test('filters entities', () => {
    const filterMap = {
      myFavs: 'hash1',
      noobs: 'hash2',
    }
    const filters = makeMap({
      hash1: new Set(['0', '2']),
      hash2: new Set(['1']),
    })
    const entities = makeMap({
      '0': { id: '0', c1: true },
      '1': { id: '1', c2: true },
      '2': { id: '2', c1: true },
      '3': { id: '3', x: false },
    })
    expect(getFilteredEntities(filterMap, filters, entities)).toStrictEqual({
      myFavs: [
        { id: '0', c1: true },
        { id: '2', c1: true },
      ],
      noobs: [{ id: '1', c2: true }],
    })
  })
})

describe('removeEntityFromFilters', () => {
  test('removes an entityId from all filters including it', () => {
    const filters = makeMap({
      hash1: new Set(['0', '2']),
      hash2: new Set(['1']),
      hash3: new Set(['0']),
    })
    const entityId = '0'
    removeEntityFromFilters(filters, entityId)
    expect(filters.get('hash1')).toEqual(new Set(['2']))
    expect(filters.get('hash2')).toEqual(new Set(['1']))
    expect(filters.get('hash3')).toEqual(new Set([]))
  })
})
