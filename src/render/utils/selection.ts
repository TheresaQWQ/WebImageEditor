import dot from './dot'

export default (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, line: string = 'rgba(0, 0, 0, 0.6)', fill: string = 'rgba(0, 0, 0, 0.1)') => {
  ctx.beginPath()
  ctx.strokeStyle = line
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1, y2)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x2, y1)
  ctx.closePath()
  ctx.stroke()

  // 绘制半透明的矩形
  ctx.fillStyle = fill
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1)

  dot(ctx, line, x1, y1, 4)
  dot(ctx, line, x1, y2, 4)
  dot(ctx, line, x2, y1, 4)
  dot(ctx, line, x2, y2, 4)
}
