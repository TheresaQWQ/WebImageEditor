export default (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, r: number) => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}
