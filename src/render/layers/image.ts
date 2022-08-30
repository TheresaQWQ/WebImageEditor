import Root from '../../root'
import canvas from '../canvas'

export default class Selection extends Root {
  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  private ctx: CanvasRenderingContext2D
  // @ts-ignore
  private image: HTMLImageElement

  // 图片距离画布左上角的坐标
  private position: { x: number, y: number } = { x: 0, y: 0 }

  // 图片距离中心点的距离
  private offset: { x: number, y: number } = { x: 0, y: 0 }

  // 缩放倍率
  private scale: number = 1

  private prevPosition: { x: number, y: number } = { x: -1, y: -1 }

  init () {
    const c = canvas(1)
    this.canvas = c.canvas
    const width = this.root.clientWidth
    const height = this.root.clientHeight
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = c.ctx
    this.root.appendChild(this.canvas)

    this.root.addEventListener('wheel', event => {
      event.preventDefault()
      event.stopPropagation()

      const zoom = event.ctrlKey ? 0.1 : 0.01

      const delta = event.deltaY
      if (delta > 0) {
        this.scale -= zoom
      } else {
        this.scale += zoom
      }

      if (this.scale < 0.01) {
        this.scale = 0.01
      }

      this.update()
    })

    this.root.addEventListener('mousemove', event => {
      if (!this.mouse.getState(0)) return
      if (!this.keyboard.getState(' ')) return

      const x = event.offsetX
      const y = event.offsetY

      if (this.prevPosition.x === -1 && this.prevPosition.y === -1) {
        const start = this.mouse.getState(0)
        this.prevPosition.x = start.x
        this.prevPosition.y = start.y
      }

      this.offset.x += x - this.prevPosition.x
      this.offset.y += y - this.prevPosition.y

      this.prevPosition.x = x
      this.prevPosition.y = y

      this.update()
    })

    this.root.addEventListener('mouseup', event => {
      this.prevPosition.x = -1
      this.prevPosition.y = -1
    })
  }

  render (image: HTMLImageElement) {
    this.image = image
    this.update(true)
  }

  update (isInit: boolean = false) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const imageWidth = this.image.width
    const imageHeight = this.image.height

    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height

    if (!isInit) {
      this.position.x = this.offset.x + canvasWidth / 2 - imageWidth / 2 * this.scale
      this.position.y = this.offset.y + canvasHeight / 2 - imageHeight / 2 * this.scale
      this.ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
      return
    }

    // 初始化时，图片居中显示
    if (imageWidth > canvasWidth || imageHeight > canvasHeight) {
      const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight)
      this.scale = scale
      this.position.x = this.offset.x + canvasWidth / 2 - imageWidth / 2 * this.scale
      this.position.y = this.offset.y + canvasHeight / 2 - imageHeight / 2 * this.scale
    } else {
      this.position.x = this.offset.x + canvasWidth / 2 - imageWidth / 2
      this.position.y = this.offset.y + canvasHeight / 2 - imageHeight / 2
    }

    this.ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
  }
}
