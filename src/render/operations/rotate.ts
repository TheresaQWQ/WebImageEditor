import Root from '../../root'
import canvas from '../canvas'
import selection from '../utils/selection'

export default class Rotate extends Root {
  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  private ctx: CanvasRenderingContext2D

  private angle: number = 0

  init () {
    const c = canvas(1)
    this.canvas = c.canvas
    const width = this.root.clientWidth
    const height = this.root.clientHeight
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = c.ctx
    this.root.appendChild(this.canvas)

    this.ctx = c.ctx

    document.addEventListener('wheel', event => {
      const y = event.deltaY
      if (event.altKey) {
        this.angle += y > 0 ? 0.1 : -0.1
        this.outline()
      }
    })

    document.addEventListener('keyup', event => {
      if (event.key === 'Alt') {
        this.rotate()
      }
    })
  }

  rotate () {
    console.log(`[Rotate Render] angle: ${this.angle}, rending...`)
    const image = this.Render.layers.image.getImage()
    const canvas = document.createElement('canvas')
    // 计算旋转后的宽高
    const width = image.width * Math.abs(Math.cos(this.angle)) + image.height * Math.abs(Math.sin(this.angle))
    const height = image.width * Math.abs(Math.sin(this.angle)) + image.height * Math.abs(Math.cos(this.angle))

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.translate(width / 2, height / 2)
    ctx.rotate(this.angle)
    ctx.drawImage(image, -image.width / 2, -image.height / 2)

    this.angle = 0

    ctx.canvas.toBlob(blob => {
      if (!blob) return console.error('[Rotate Render] blob is null')
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.src = url
      img.onload = () => {
        console.log('[Rotate Render] render success')
        this.Render.layers.image.setImage(img)
        this.Render.layers.image.update()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    })
  }

  outline () {
    const canvas = document.createElement('canvas')
    canvas.width = this.canvas.width
    canvas.height = this.canvas.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const area = this.Render.layers.image.area

    ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
    ctx.rotate(this.angle)
    selection(ctx, area.x1 - this.canvas.width / 2, area.y1 - this.canvas.height / 2, area.x2 - this.canvas.width / 2, area.y2 - this.canvas.height / 2)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(canvas, 0, 0)
  }
}
