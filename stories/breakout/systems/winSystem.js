import { WinMessage } from '../renderers'

export function winSystem() {
  let wonYet = false
  return ({ entities, gameLoop, createEntity }) => {
    const blocks = entities.filter(e => e.name === 'block')
    if (blocks.length < 1 && !wonYet) {
      wonYet = true
      createEntity({ Renderer: WinMessage })
      setTimeout(() => {
        gameLoop.current.pause()
      }, 10)
    }
  }
}
