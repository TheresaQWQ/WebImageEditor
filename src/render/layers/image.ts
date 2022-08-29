import Root from '../../root'
import canvas from '../canvas'

export default class Selection extends Root {
  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  private ctx: CanvasRenderingContext2D

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
  }

  render (image: HTMLImageElement, x: number, y: number, width: number, height: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(image, x, y, width, height, 0, 0, this.canvas.width, this.canvas.height)

    console.log(`[Image Layer] render ${width}x${height} to ${x},${y}`)
  }
}
