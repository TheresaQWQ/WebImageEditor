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
  private prevPosition: { x: number, y: number } = { x: 0, y: 0 }

  private state_isMove: boolean = false
  private state_isResize: number = -1

  private cursorMap: {
    [key: number]: string
  } = {
      0: 'nw-resize',
      1: 'sw-resize',
      2: 'ne-resize',
      3: 'se-resize'
    }

  init () {
    const c = canvas(2)
    this.canvas = c.canvas
    const width = this.root.clientWidth
    const height = this.root.clientHeight
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = c.ctx
    this.root.appendChild(this.canvas)

    this.root.addEventListener('mousedown', event => {
      if (this.keyboard.getState(' ')) return

      const x = event.offsetX
      const y = event.offsetY

      const pos1 = { x: this.area.x1, y: this.area.y1 } // 左上角
      const pos2 = { x: this.area.x1, y: this.area.y2 } // 左下角
      const pos3 = { x: this.area.x2, y: this.area.y1 } // 右上角
      const pos4 = { x: this.area.x2, y: this.area.y2 } // 右下角

      const distances = [
        math.distance(x, y, pos1.x, pos1.y),
        math.distance(x, y, pos2.x, pos2.y),
        math.distance(x, y, pos3.x, pos3.y),
        math.distance(x, y, pos4.x, pos4.y)
      ]

      const minDistance = Math.min(...distances)

      console.log(`[Selection] minDistance: ${minDistance}`)

      if (minDistance < 8) {
        this.state = true
        this.prevPosition = { x, y }
        const index = distances.indexOf(minDistance)
        const cursor = this.cursorMap[index]
        this.state_isResize = index
        this.root.style.cursor = cursor

        return
      }

      if (math.inArea(x, y, this.area.x1, this.area.y1, this.area.x2, this.area.y2)) {
        this.state = true
        this.prevPosition = { x, y }
        this.state_isMove = true
        this.root.style.cursor = 'move'

        return
      }

      this.state = true
      this.position = { x, y }
    })

    this.root.addEventListener('mousemove', event => {
      if (!this.state) return
      if (this.keyboard.getState(' ')) {
        this.state = false
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        return
      }

      const x = event.offsetX
      const y = event.offsetY

      if (this.state_isResize !== -1) {
        const index = this.state_isResize
        if (index === 0) {
          // 左上角
          this.area.x1 = x
          this.area.y1 = y
        } else if (index === 1) {
          // 左下角
          this.area.x1 = x
          this.area.y2 = y
        } else if (index === 2) {
          // 右上角
          this.area.x2 = x
          this.area.y1 = y
        } else if (index === 3) {
          // 右下角
          this.area.x2 = x
          this.area.y2 = y
        }

        this.createSelection(this.area.x1, this.area.y1, this.area.x2, this.area.y2)
        return
      }

      if (this.state_isMove) {
        this.area.x1 += x - this.prevPosition.x
        this.area.y1 += y - this.prevPosition.y
        this.area.x2 += x - this.prevPosition.x
        this.area.y2 += y - this.prevPosition.y
        this.createSelection(this.area.x1, this.area.y1, this.area.x2, this.area.y2)

        this.prevPosition = { x, y }
        return
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      selection(this.ctx, this.position.x, this.position.y, x, y)

      this.area = {
        x1: this.position.x,
        y1: this.position.y,
        x2: x,
        y2: y
      }
    })

    this.root.addEventListener('mouseup', event => {
      this.state = false
      this.state_isMove = false
      this.state_isResize = -1

      this.root.style.cursor = 'default'

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

  isEmptyArea () {
    return this.area.x1 === 0 && this.area.y1 === 0 && this.area.x2 === 0 && this.area.y2 === 0
  }

  createSelection (x1: number, y1: number, x2: number, y2: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.area = { x1, y1, x2, y2 }
    selection(this.ctx, x1, y1, x2, y2)
  }
}
