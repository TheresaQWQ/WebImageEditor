class Editor {
  constructor (e) {
    this.element = typeof e === 'string' ? document.querySelector(e) : e
    this.element.style.position = 'relative'

    this.screen_width = this.element.offsetWidth
    this.screen_height = this.element.offsetHeight
    this.background = this._createCanvas(0)
    this.selection = this._createCanvas(1)

    this.mouse_state = {}
    this.keyboard_state = {}

    document.addEventListener('keydown', event => {
      const key = event.key.toLowerCase()
      this.keyboard_state[key] = true

      if (key === 'delete') this.delete()

      console.log(`[keydown] ${key}`)
    })

    document.addEventListener('keyup', event => {
      const key = event.key.toLowerCase()
      delete this.keyboard_state[key]
      console.log(`[keyup] ${key}`)
    })

    this.element.onmousedown = event => {
      const key = event.button
      this.mouse_state[key] = [event.offsetX, event.offsetY]
      console.log(`[mousedown] ${key}, x: ${event.offsetX}, y: ${event.offsetY}`)
    }

    this.element.onmouseup = event => {
      const key = event.button
      delete this.mouse_state[key]
      console.log(`[mouseup] ${key}`)
    }

    this._initDisplay()

    this.element.onmousewheel = event => {
      event.preventDefault()
      event.stopPropagation()
      const offset = event.wheelDelta / 120 / 50
      this.state_scale += offset
      this.scale(this.state_scale)
    }

    this.element.onmousemove = event => {
      if (this.mouse_state[0] && this.keyboard_state[' ']) {
        event.preventDefault()
        event.stopPropagation()

        const x = event.offsetX
        const y = event.offsetY
        const offsetX = (x - this.mouse_state[0][0]) * -1
        const offsetY = (y - this.mouse_state[0][1]) * -1

        this.mouse_state[0][0] = x
        this.mouse_state[0][1] = y

        this.move(offsetX, offsetY)
      }
    }
  }

  _createCanvas (zIndex) {
    const element = document.createElement('canvas')
    element.width = this.screen_width
    element.height = this.screen_height
    element.style.position = 'absolute'
    element.style.left = 0
    element.style.top = 0
    element.style.zIndex = zIndex
    this.element.appendChild(element)
    const ctx = element.getContext('2d')
    return {
      element,
      ctx
    }
  }

  // 计算两点距离
  _distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }

  // 判断坐标是否在指定区域内
  _inSelection (x1, y1, x2, y2, x, y) {
    const formated_x1 = Math.min(x1, x2)
    const formated_x2 = Math.max(x1, x2)
    const formated_y1 = Math.min(y1, y2)
    const formated_y2 = Math.max(y1, y2)
    
    return x >= formated_x1 && x <= formated_x2 && y >= formated_y1 && y <= formated_y2
  }

  _initDisplay () {
    const state = {
      stop: true,
      update: -1,
      move: false
    }

    const pos = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    }

    const startPos = {
      x: 0,
      y: 0
    }

    this.selection.element.onmousedown = event => {
      const selection = this.getCurrentSelection()
      if (selection.x1 !== -1) {
        const x = event.offsetX
        const y = event.offsetY

        const pos = [
          [selection.x1, selection.y1],
          [selection.x2, selection.y2],
          [selection.x1, selection.y2],
          [selection.x2, selection.y1]
        ]

        const distances = [
          this._distance(x, y, pos[0][0], pos[0][1]),
          this._distance(x, y, pos[1][0], pos[1][1]),
          this._distance(x, y, pos[2][0], pos[2][1]),
          this._distance(x, y, pos[3][0], pos[3][1])
        ]

        const min = Math.min(...distances)

        if (min < 5) {
          state.stop = false
          state.move = false
          const index = distances.indexOf(min)

          state.update = index

          return
        }

        if (this._inSelection(selection.x1, selection.y1, selection.x2, selection.y2, x, y)) {
          // 计算坐标与边界的距离
          const top = Math.min(selection.y1, selection.y2) - y
          const bottom = Math.max(selection.y1, selection.y2) - y
          const left = Math.min(selection.x1, selection.x2) - x
          const right = Math.max(selection.x1, selection.x2) - x

          // 计算最小距离
          const min = Math.abs(Math.min(top, bottom, left, right))
          if (min > 10) {
            state.stop = false
            state.move = true
            state.update = -1
            startPos.x = x
            startPos.y = y
            return
          }
        }
      }

      state.update = -1
      state.move = false
      this.selection.ctx.clearRect(0, 0, this.screen_width, this.screen_height)
      // 清空display画布
      pos.x1 = event.offsetX
      pos.y1 = event.offsetY
      state.stop = false
    }

    this.selection.element.onmousemove = event => {
      if (state.stop || this.keyboard_state[' ']) return
      this.selection.ctx.clearRect(0, 0, this.screen_width, this.screen_height)
      const x = event.offsetX
      const y = event.offsetY

      console.log(state)

      if (state.update !== -1) {
        if (state.update === 0) {
          pos.x1 = x
          pos.y1 = y
        } else if (state.update === 1) {
          pos.x2 = x
          pos.y2 = y
        } else if (state.update === 2) {
          pos.x1 = x
          pos.y2 = y
        } else if (state.update === 3) {
          pos.x2 = x
          pos.y1 = y
        }
      } else if (state.move) {
        const offsetX = x - startPos.x
        const offsetY = y - startPos.y
        startPos.x = x
        startPos.y = y
        pos.x1 += offsetX
        pos.y1 += offsetY
        pos.x2 += offsetX
        pos.y2 += offsetY
      } else {
        pos.x2 = x
        pos.y2 = y
      }

      this.createSelection(pos.x1, pos.y1, pos.x2, pos.y2)

      this.state_selection = {
        x1: pos.x1,
        y1: pos.y1,
        x2: pos.x2,
        y2: pos.y2
      }
    }

    this.selection.element.onmouseup = event => {
      state.stop = true

      const d = this._distance(pos.x1, pos.y1, pos.x2, pos.y2)
      // 如果选区小于2像素，就清空选区
      if (d < 2) {
        console.log('[selection] clear selection')
        this.state_selection = null
      }
    }
  }

  createSelection (x1, y1, x2, y2) {
    // 清空画布
    this.selection.ctx.clearRect(0, 0, this.screen_width, this.screen_height)
    this.selection.ctx.beginPath()
    this.selection.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
    this.selection.ctx.moveTo(x1, y1)
    this.selection.ctx.lineTo(x1, y2)
    this.selection.ctx.lineTo(x2, y2)
    this.selection.ctx.lineTo(x2, y1)
    this.selection.ctx.closePath()
    this.selection.ctx.stroke()

    // 绘制半透明的矩形
    this.selection.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.selection.ctx.fillRect(x1, y1, x2 - x1, y2 - y1)

    // 绘制圆点
    const color = 'rgba(0, 0, 0, 0.6)'
    this._selectionDrawDot(x1, y1, 3, color)
    this._selectionDrawDot(x2, y2, 3, color)
    this._selectionDrawDot(x1, y2, 3, color)
    this._selectionDrawDot(x2, y1, 3, color)
  }

  _selectionDrawDot (x, y, r, color) {
    this.selection.ctx.fillStyle = color
    this.selection.ctx.beginPath()
    this.selection.ctx.arc(x, y, r, 0, Math.PI * 2)
    this.selection.ctx.fill()
  }

  getCurrentSelection () {
    if (!this.state_selection) {
      return {
        x1: -1,
        y1: -1,
        x2: -1,
        y2: -1
      }
    }

    return this.state_selection
  }

  loadImage (url) {
    this.image = new Image()
    this.image.onload = () => {
      const canvas_width = this.screen_width
      const canvas_height = this.screen_height
      const image_width = this.image.width
      const image_height = this.image.height

      // 如果图片小于画布，就居中
      if (image_width < canvas_width && image_height < canvas_height) {
        this.state_scale = 1
        this.background.ctx.drawImage(this.image, (canvas_width - image_width) / 2, (canvas_height - image_height) / 2)
      } else {
        // 缩放后居中
        const scale = Math.min(canvas_width / image_width, canvas_height / image_height)
        this.state_scale = scale
        const width = image_width * scale
        const height = image_height * scale
        this.background.ctx.drawImage(this.image, (canvas_width - width) / 2, (canvas_height - height) / 2, width, height)
      }

      this.state_move_y = 0
      this.state_move_x = 0
    }

    this.image.src = url
  }

  // 转换canvas坐标到图片坐标
  _transformCanvasToImage (x, y) {
    const scale = this.state_scale
    const offsetX = (this.state_move_x || 0) * -1
    const offsetY = (this.state_move_y || 0) * -1

    // 图片原始大小
    const image_width = this.image.width
    const image_height = this.image.height

    // 画布大小
    const canvas_width = this.screen_width
    const canvas_height = this.screen_height

    // 缩放后图片大小
    const width = image_width * scale
    const height = image_height * scale

    // 缩放后图片左上角坐标
    const image_x = (canvas_width - width) / 2 - offsetX
    const image_y = (canvas_height - height) / 2 - offsetY

    // 缩放后相对于图片的坐标
    const image_dx = x - image_x
    const image_dy = y - image_y

    // 原始坐标
    const dx = image_dx / scale
    const dy = image_dy / scale

    console.log(`[transform] x: ${x} -> ${dx}, y: ${y} -> ${dy}`)

    return {
      x: dx,
      y: dy
    }
  }

  delete () {
    const selection = this.getCurrentSelection()
    if (selection.x1 === -1) return

    const { x: x1, y: y1 } = this._transformCanvasToImage(selection.x1, selection.y1)
    const { x: x2, y: y2 } = this._transformCanvasToImage(selection.x2, selection.y2)

    console.log(`[delete] x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)

    const canvas = document.createElement('canvas')
    
    canvas.width = this.image.width
    canvas.height = this.image.height

    const ctx = canvas.getContext('2d')

    ctx.drawImage(this.image, 0, 0)
    ctx.clearRect(x1, y1, x2 - x1, y2 - y1)

    ctx.canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)

      const image = new Image()
      image.onload = () => {
        this.image = image
        this.selection.ctx.clearRect(0, 0, this.screen_width, this.screen_height)
        this.state_selection = null
        this.drawImage(this.state_move_x, this.state_move_y, this.state_scale)
      }

      image.src = url
    })
  }

  drawImage (x, y, scale) {
    if (!this.image) return new Error('you must load image first')

    const canvas_width = this.screen_width
    const canvas_height = this.screen_height
    const image_width = this.image.width
    const image_height = this.image.height

    const width = image_width * scale
    const height = image_height * scale
    const dx = (canvas_width - width) / 2 - x
    const dy = (canvas_height - height) / 2 - y

    this.background.ctx.clearRect(0, 0, canvas_width, canvas_height)
    this.background.ctx.drawImage(this.image, dx, dy, width, height)
  }

  scale (scale) {
    if (!this.image) return new Error('you must load image first')

    if (!this.state_move_x) this.state_move_x = 0
    if (!this.state_move_y) this.state_move_y = 0
    if (!this.state_scale) this.state_scale = scale

    this.drawImage(this.state_move_x, this.state_move_y, this.state_scale)
  }

  move (x, y) {
    if (!this.image) return new Error('you must load image first')

    if (!this.state_move_x) this.state_move_x = 0
    if (!this.state_move_y) this.state_move_y = 0
    if (!this.state_scale) this.state_scale = scale

    this.state_move_x -= x
    this.state_move_y -= y

    this.drawImage(-this.state_move_x, -this.state_move_y, this.state_scale)
  }
}
