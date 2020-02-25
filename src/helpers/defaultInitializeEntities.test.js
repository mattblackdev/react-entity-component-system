import {
  defaultInitializeEntities,
  initializeEntity,
} from './defaultInitializeEntities'
import { makeMap } from './makeMap'

describe('initializeEntity', () => {
  test('initializes entity', () => {
    const entity = { c1: 1 }
    const entityMap = new Map()
    const id = initializeEntity(entity, entityMap)
    expect(id).toBe('0')
    expect(entityMap).toMatchInlineSnapshot(`
      Map {
        "0" => Object {
          "c1": 1,
          "childrenIds": Array [],
          "id": "0",
          "parentId": null,
        },
      }
    `)
  })

  test('initializes children entities', () => {
    const entity = { c1: true, children: [{ c2: true }] }
    const entityMap = new Map()
    initializeEntity(entity, entityMap)
    expect(entityMap).toMatchInlineSnapshot(`
      Map {
        "1" => Object {
          "c2": true,
          "childrenIds": Array [],
          "id": "1",
          "parentId": "0",
        },
        "0" => Object {
          "c1": true,
          "childrenIds": Array [
            "1",
          ],
          "id": "0",
          "parentId": null,
        },
      }
    `)
  })
})

describe('defaultInitializeEntities', () => {
  test('returns initialized entity map', () => {
    const initialEntitiesArray = [{ c1: 1, children: [{ c1: 1 }] }]
    expect(defaultInitializeEntities(initialEntitiesArray))
      .toMatchInlineSnapshot(`
        Map {
          "1" => Object {
            "c1": 1,
            "childrenIds": Array [],
            "id": "1",
            "parentId": "0",
          },
          "0" => Object {
            "c1": 1,
            "childrenIds": Array [
              "1",
            ],
            "id": "0",
            "parentId": null,
          },
        }
      `)
  })

  test('merges initialized entities with existing', () => {
    const initialEntitiesArray = [{ c1: 1, children: [{ c1: 1 }] }]
    const entityMap = makeMap({
      me: { childrenIds: [], id: 'me', parentId: null },
    })
    defaultInitializeEntities(initialEntitiesArray, { entityMap })
    expect(entityMap).toMatchInlineSnapshot(`
      Map {
        "me" => Object {
          "childrenIds": Array [],
          "id": "me",
          "parentId": null,
        },
        "1" => Object {
          "c1": 1,
          "childrenIds": Array [],
          "id": "1",
          "parentId": "0",
        },
        "0" => Object {
          "c1": 1,
          "childrenIds": Array [
            "1",
          ],
          "id": "0",
          "parentId": null,
        },
      }
    `)
  })
})
