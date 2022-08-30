export default class Mouse {
  private keyState: { [key: string]: { x: number, y: number } } = {}
  private root: HTMLElement

  constructor (e: HTMLElement) {
    this.root = e

    console.log('[Mouse] initzalizing...')

    this.root.addEventListener('mousedown', event => {
      const x = event.offsetX
      const y = event.offsetY

      console.log(`[Mouse] mousedown: ${event.button} (${x}, ${y})`)

      this.keyState[event.button] = { x, y }
    })

    this.root.addEventListener('mouseup', event => {
      console.log(`[Mouse] mouseup: ${event.button}`)
      delete this.keyState[event.button]
    })

    console.log('[Mouse] initialized')
  }

  getState (key: number) {
    console.log(`[Mouse] getState: ${key} -> ${this.keyState[key] ? `${this.keyState[key].x}, ${this.keyState[key].y}` : 'null'}`)
    return this.keyState[key]
  }
}
