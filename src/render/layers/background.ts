import Root from '../../root'
import canvas from '../canvas'

export default class Background extends Root {
  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  private ctx: CanvasRenderingContext2D

  init () {
    if (!this.root) throw new Error('root element is required')

    const c = canvas(1)
    this.canvas = c.canvas
    const width = this.root.clientWidth
    const height = this.root.clientHeight
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = c.ctx
    this.root.appendChild(this.canvas)

    this.render()
  }

  render () {
    // 渲染灰白相间的透明背景
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.canvas.width; i += 10) {
      for (let j = 0; j < this.canvas.height; j += 10) {
        this.ctx.fillStyle = (i + j) % 20 === 0 ? '#ccc' : '#fff'
        this.ctx.fillRect(i, j, 10, 10)
      }
    }
  }
}
