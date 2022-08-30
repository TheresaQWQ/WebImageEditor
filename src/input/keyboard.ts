export default class Keyboard {
  private keyState: { [key: string]: boolean } = {}

  constructor () {
    console.log('[Keyboard] initzalizing...')

    document.addEventListener('keydown', event => {
      console.log(`[Keyboard] keydown: ${event.key}`)
      this.keyState[event.key] = true
    })

    document.addEventListener('keyup', event => {
      console.log(`[Keyboard] keyup: ${event.key}`)
      delete this.keyState[event.key]
    })

    console.log('[Keyboard] initialized')
  }

  getState (key: string) {
    console.log(`[Keyboard] getState: ${key} -> ${this.keyState[key]}`)
    return !!this.keyState[key]
  }
}
