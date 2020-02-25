# React Entity Component System

An ECS hook for React to make games or other interactive components.

`yarn add react-entity-component-system`

<img style="margin: auto;" height="400" src="demo.gif" />

## [Play Breakout Demo](https://mattblackdev.github.io/react-entity-component-system/?path=/story/breakout--breakout)

## Why

It's fun to build games with React, and people have become successful at it. The ECS pattern is well known and battle tested for game development. This library is a loose implementation for React. You can check out the [Breakout storybook story](https://github.com/mattblackdev/react-entity-component-system/tree/master/stories/breakout) to see a fairly complex example.

## Usage

```jsx
import React from 'react'
import { useEntityComponentSystem } from 'react-entity-component-system'
```

ECS in general has three basic concepts:

1. `Entities` represent things in a scene
2. `Components` (_not React components_) are data structures, composed to create entities.
3. `Systems` are functions that operate on entities during every update

In this implementation, an entity is defined as a plain object with at least a `Renderer` property (a React component). Other properties are `components` that will be passed as props to the `Renderer`:

```jsx
const counterEntity = {
  Renderer: props => <h4>{props.count}</h4>,
  count: 0,
}
```

A `system` is just a function that operates on `entities` in the scene each frame. `Systems` are allowed to mutate the entities' `components` (thanks to [immer](https://github.com/immerjs/immer)!):

```jsx
function frameCounterSystem({ entities }) {
  entities.forEach(entity => entity.count++)
}
```

The `useEntityComponentSystem` hook manages the CRUD (creating, _rendering_, updating and destroying the entities). Pass it some initial entities and systems, receive the renderable result and an `updater` function:

```jsx
const initialEntities = [counterEntity]
const systems = [frameCounterSystem]

export default function BasicECS() {
  const [entities, updater] = useEntityComponentSystem(initialEntities, systems)

  return (
    <div>
      <button onClick={() => updater()}>Next Frame</button>
      {entities}
    </div>
  )
}
```

When the `updater` is called, all the `systems` are called with the following object as the first argument:

```js
const systemArgs = {
  entities,
  filteredEntities,
  createEntity,
  destroyEntity,
  addComponent,
  removeComponent,
  ...userArgs,
}
```

The `updater` takes and object or function (which should return an object) and passes it to the systems (`...userArgs` as shown above) so they can have access to many other things. For example, the provided `useKeysDown` hook:

```jsx
const keysDown = useKeysDown()
updater({
  keysDown,
})
```

Typically, the `updater` is called inside a loop via the provided `useGameLoop` hook. Be sure the function you pass is not redefined during every render. In most cases, you should wrap the `updater` call in `React.useCallback`:

```jsx
function Game(scene) {
  const [entities, updater] = useEntityComponentSystem(...scene)
  const update = useCallback(elapsedTime => updater({ elapsedTime }), [updater])
  useGameLoop(update)

  return <>{entities}</>
}
```

> See this example and more in the [stories folder](https://github.com/mattblackdev/react-entity-component-system/tree/master/stories/basic)

## Storybook

While `react-entity-component-system` is in development, you can check out the storybook to get a better sense of how things work.

```bash
git clone https://github.com/mattblackdev/react-entity-component-system.git
cd react-entity-component-system
yarn
yarn start
```

## API

### useEntityComponentSystem

#### Entity

#### System

##### Component Filters

Systems can specify a filter like this:

```js
function playerSystem({ filteredEntities }) {
  filteredEntities.players.forEach(player => {
    console.log(player.name)
  })
}
// Any entity with a "player" component key
playerSystem.filter = { players: ['player'] }
```

### useGameLoop

### useGameEvents

### useKeysDown

### Debug

## Contributing

I welcome any ideas and would really love some help with:

1. Adding Typescript types
2. Performance benchmarking and optimizations
3. More game engine API like:
   - ~~Keeping track of "entity filters" for systems~~
   - MatterJS or other physics lib integration
