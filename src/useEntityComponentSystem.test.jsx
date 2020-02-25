import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import useECS from './index'

test('returns [jsx, updater, entityMap]', () => {
  const initialEntities = [{ c1: true, Renderer: () => <div>hello</div> }]
  const initialSystems = []
  const { result } = renderHook(() => useECS(initialEntities, initialSystems))
  const [jsx, updater, entities] = [0, 1, 2]
  expect(result.current[jsx]).toMatchInlineSnapshot(`
    Array [
      <Renderer
        c1={true}
      />,
    ]
  `)
  expect(typeof result.current[updater]).toBe('function')
  expect(result.current[entities]).toMatchInlineSnapshot(`
    Map {
      "0" => Object {
        "Renderer": [Function],
        "c1": true,
        "childrenIds": Array [],
        "id": "0",
        "parentId": null,
      },
    }
  `)
})
