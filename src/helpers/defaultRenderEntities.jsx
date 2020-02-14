import React from 'react'

export function defaultRenderEntities(entities, entityParentId = null) {
  return Object.values(entities)
    .filter(entity => entity.parentId === entityParentId)
    .map(({ Renderer = () => null, id, parentId, childrenIds, ...props }) => {
      const children = childrenIds.length
        ? defaultRenderEntities(entities, id)
        : undefined
      return <Renderer {...props} key={id} children={children} />
    })
}
