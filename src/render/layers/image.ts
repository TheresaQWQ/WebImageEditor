import Root from '../../root'
import canvas from '../canvas'
import math from '../../math'

export default class Selection extends Root {
  // @ts-ignore
  private canvas: HTMLCanvasElement
  // @ts-ignore
  private ctx: CanvasRenderingContext2D
  // @ts-ignore
  private image: HTMLImageElement

  // 上一个鼠标坐标
  private prevPosition: { x: number, y: number } = { x: -1, y: -1 }

  // 图片距离画布左上角的坐标
  public position: { x: number, y: number } = { x: 0, y: 0 }

  // 图片距离中心点的距离
  public offset: { x: number, y: number } = { x: 0, y: 0 }

  // 图片所在的矩形区域
  public area: { x1: number, y1: number, x2: number, y2: number } = { x1: 0, y1: 0, x2: 0, y2: 0 }

  // 缩放倍率
  public scale: number = 1

  init () {
    const c = canvas(1)
    this.canvas = c.canvas
    const width = this.root.clientWidth
    const height = this.root.clientHeight
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = c.ctx
    this.root.appendChild(this.canvas)

    // 缩放
    this.root.addEventListener('wheel', event => {
      if (event.altKey) return

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

    // 拖拽
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

    // 拖拽结束
    this.root.addEventListener('mouseup', event => {
      this.prevPosition.x = -1
      this.prevPosition.y = -1
    })

    // 双击
    this.root.addEventListener('dblclick', event => {
      const x = event.offsetX
      const y = event.offsetY

      if (math.inArea(x, y, this.area.x1, this.area.y1, this.area.x2, this.area.y2)) {
        this.Render.layers.selection.createSelection(this.area.x1, this.area.y1, this.area.x2, this.area.y2)
      }
    })
  }

  render (image: HTMLImageElement) {
    this.setImage(image)
    this.update(true)
  }

  setImage (image: HTMLImageElement) {
    this.image = image
  }

  getImage () {
    return this.image
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

      this.area.x1 = this.position.x
      this.area.y1 = this.position.y
      this.area.x2 = this.position.x + this.image.width * this.scale
      this.area.y2 = this.position.y + this.image.height * this.scale
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

    this.area.x1 = this.position.x
    this.area.y1 = this.position.y
    this.area.x2 = this.position.x + this.image.width * this.scale
    this.area.y2 = this.position.y + this.image.height * this.scale
  }

  // 转换canvas坐标到图片坐标
  transformCanvasToImage (x: number, y: number) {
    return {
      x: (x - this.position.x) / this.scale,
      y: (y - this.position.y) / this.scale
    }
  }

  // 转换图片坐标到canvas坐标
  transformImageToCanvas (x: number, y: number) {
    return {
      x: x * this.scale + this.position.x,
      y: y * this.scale + this.position.y
    }
  }
}
