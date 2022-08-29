class Editor {
  constructor (e) {
    this.element = typeof e === 'string' ? document.querySelector(e) : e
    this.element.style.position = 'relative'

    this.screen_width = this.element.offsetWidth
    this.screen_height = this.element.offsetHeight
    this.background = this._createCanvas(0)
    this.selection = this._createCanvas(2)

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
      
      // TODO: 缩放时选区相对于图片的位置不变
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

        if (this.getCurrentSelection().x1 !== -1) {
          this.state_selection.x1 -= offsetX
          this.state_selection.y1 -= offsetY
          this.state_selection.x2 -= offsetX
          this.state_selection.y2 -= offsetY
          this.createSelection(this.state_selection.x1, this.state_selection.y1, this.state_selection.x2, this.state_selection.y2)
        }
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
      move: false,
      rotate: null
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
      const x = event.offsetX
      const y = event.offsetY

      // 判断是否已有选区
      if (selection.x1 !== -1) {

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

        // 缩放选区
        if (min < 5) {
          state.stop = false
          state.move = false
          const index = distances.indexOf(min)

          state.update = index

          return
        }

        // 移动选区
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
      } else {
        if (this._getMinDistance(x, y) < 10 && this._inImageArea(x, y)) return state.rotate = [x, y]
      }

      // 创建选区
      state.rotate = null
      state.update = -1
      state.move = false
      this.selection.ctx.clearRect(0, 0, this.screen_width, this.screen_height)
      // 清空display画布
      pos.x1 = event.offsetX
      pos.y1 = event.offsetY
      state.stop = false
    }

    this.selection.element.onmousemove = async event => {
      if (!this.image) return

      const x = event.offsetX
      const y = event.offsetY

      if (this._getMinDistance(x, y) < 10 && this._inImageArea(x, y)) {
        this.element.style.cursor = 'pointer'
      } else {
        this.element.style.cursor = 'default'
      }

      if (state.rotate) {
        const [x1, y1] = state.rotate
        const angle = Math.floor(Math.atan2(y - y1, x - x1) * 180 / Math.PI)

        state.rotate = [x, y]

        console.log(`[rotate] ${angle}°`)
        this.rotate(angle)
        return
      }

      if (state.stop || this.keyboard_state[' ']) return
      this.selection.ctx.clearRect(0, 0, this.screen_width, this.screen_height)

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
      state.update = -1
      state.move = false
      state.rotate = null

      const d = this._distance(pos.x1, pos.y1, pos.x2, pos.y2)
      // 如果选区小于2像素，就清空选区
      if (d < 2) {
        console.log('[selection] clear selection')
        this.state_selection = null
      }
    }
  }

  _getMinDistance (x, y) {
    const pos1 = this._transformImageToCanvas(0, 0) // 左上角
    const pos2 = this._transformImageToCanvas(this.image.width, 0) // 右上角
    const pos3 = this._transformImageToCanvas(this.image.width, this.image.height) // 右下角
    const pos4 = this._transformImageToCanvas(0, this.image.height) // 左下角

    const distances = [
      this._distance(x, y, pos1.x, pos1.y),
      this._distance(x, y, pos2.x, pos2.y),
      this._distance(x, y, pos3.x, pos3.y),
      this._distance(x, y, pos4.x, pos4.y)
    ]

    return Math.min(...distances)
  }

  _inImageArea (x, y) {
    const pos1 = this._transformImageToCanvas(0, 0) // 左上角
    const pos2 = this._transformImageToCanvas(this.image.width, 0) // 右上角
    const pos3 = this._transformImageToCanvas(this.image.width, this.image.height) // 右下角
    const pos4 = this._transformImageToCanvas(0, this.image.height) // 左下角

    const image_area = {
      x1: Math.min(pos1.x, pos2.x, pos3.x, pos4.x),
      y1: Math.min(pos1.y, pos2.y, pos3.y, pos4.y),
      x2: Math.max(pos1.x, pos2.x, pos3.x, pos4.x),
      y2: Math.max(pos1.y, pos2.y, pos3.y, pos4.y)
    }

    return this._inSelection(image_area.x1, image_area.y1, image_area.x2, image_area.y2, x, y)
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

  // 绘制旋转方块
  rotate_outline (deg) {
    const canvas = document.createElement('canvas')
    canvas.width = this.image.width * this.state_scale
    canvas.height = this.image.height * this.state_scale

    const ctx = canvas.getContext('2d')
    // 更改原点到图片中心
    ctx.translate(canvas.width / 2, canvas.height / 2)

    const x1 = -this.image.width / 2
    const y1 = -this.image.height / 2
    const x2 = this.image.width / 2
    const y2 = this.image.height / 2

    // 清空画布
    ctx.clearRect(x1, y1, x2 - x1, y2 - y1)
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1, y2)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x2, y1)
    ctx.closePath()
    ctx.stroke()

    const angle = deg * Math.PI / 180
    ctx.rotate(angle)

    return new Promise(resolve => {
      ctx.canvas.toBlob(blob => {
        const img = new Image()
        img.src = URL.createObjectURL(blob)
        img.onload = () => {
          resolve(img)
        }
      })
    })
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
    this.background.ctx.clearRect(0, 0, this.screen_width, this.screen_height)

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

    return {
      x: dx,
      y: dy
    }
  }

  // 转换图片坐标到canvas坐标
  _transformImageToCanvas (x, y) {
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
    const image_dx = x * scale
    const image_dy = y * scale

    // 原始坐标
    const dx = image_dx + image_x
    const dy = image_dy + image_y

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

  // 旋转图片
  rotate (angle) {
    const canvas = document.createElement('canvas')

    // 计算旋转后需要的宽高
    const width = Math.abs(this.image.width * Math.sin(angle)) + Math.abs(this.image.height * Math.cos(angle))
    const height = Math.abs(this.image.width * Math.cos(angle)) + Math.abs(this.image.height * Math.sin(angle))

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(angle * Math.PI / 180)
    ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2)

    ctx.canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)

      const image = new Image()
      image.onload = () => {
        this.image = image
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
