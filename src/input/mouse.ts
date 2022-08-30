export default class Mouse {
  private keyState: { [key: string]: { x: number, y: number } } = {}
  private root: HTMLElement

  constructor (e: HTMLElement) {
    this.root = e

    console.log('[Mouse] initzalizing...')

    this.root.addEventListener('mousedown', event => {
      const x = event.offsetX
      const y = event.offsetY

      this.keyState[event.button] = { x, y }
    })

    this.root.addEventListener('mouseup', event => {
      delete this.keyState[event.button]
    })

    console.log('[Mouse] initialized')
  }

  getState (key: number) {
    return this.keyState[key]
  }
}
