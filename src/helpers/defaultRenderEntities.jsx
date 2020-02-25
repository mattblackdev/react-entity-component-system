import React from 'react'

const defaultEntities = new Map()
const defaultRenderer = () => null
export function defaultRenderEntities(
  entities = defaultEntities,
  entityParentId = null,
) {
  const renderedEntities = []
  entities.forEach(entity => {
    if (entity.parentId === entityParentId) {
      const {
        Renderer = defaultRenderer,
        id,
        parentId,
        childrenIds,
        ...props
      } = entity
      const children = childrenIds.length
        ? defaultRenderEntities(entities, id)
        : undefined
      renderedEntities.push(
        <Renderer {...props} key={id} children={children} />,
      )
    }
  })
  return renderedEntities
}
