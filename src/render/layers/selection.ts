import Root from '../../root'
import selection from '../utils/selection'
import math from '../../math'
import canvas from '../canvas'

export default class Selection extends Root {
  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  private ctx: CanvasRenderingContext2D

  private state: boolean = false
  private position: { x: number, y: number } = { x: 0, y: 0 }
  private area: { x1: number, y1: number, x2: number, y2: number } = { x1: 0, y1: 0, x2: 0, y2: 0 }

  init () {
    if (!this.root) throw new Error('root element is required')

    const c = canvas(0)
    this.canvas = c.canvas
    const width = this.root.clientWidth
    const height = this.root.clientHeight
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = c.ctx
    this.root.appendChild(this.canvas)

    this.root.addEventListener('mousedown', event => {
      const x = event.offsetX
      const y = event.offsetY

      this.state = true
      this.position = { x, y }
    })

    this.root.addEventListener('mousemove', event => {
      if (!this.state) return

      const x = event.offsetX
      const y = event.offsetY

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      selection(this.ctx, this.position.x, this.position.y, x, y)
    })

    this.root.addEventListener('mouseup', event => {
      this.area = {
        x1: this.position.x,
        y1: this.position.y,
        x2: event.offsetX,
        y2: event.offsetY
      }

      this.state = false

      const distance = math.distance(this.position.x, this.position.y, event.offsetX, event.offsetY)
      if (distance < 5) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.area = { x1: 0, y1: 0, x2: 0, y2: 0 }
      }
    })
  }

  getCurrentArea () {
    return this.area
  }
}
