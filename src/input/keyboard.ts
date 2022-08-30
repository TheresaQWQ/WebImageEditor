export default class Keyboard {
  private keyState: { [key: string]: boolean } = {}

  constructor () {
    console.log('[Keyboard] initzalizing...')

    document.addEventListener('keydown', event => {
      this.keyState[event.key] = true
    })

    document.addEventListener('keyup', event => {
      delete this.keyState[event.key]
    })

    console.log('[Keyboard] initialized')
  }

  getState (key: string) {
    return !!this.keyState[key]
  }
}
