export default (zIndex: number) => {
  const canvas = document.createElement('canvas')

  canvas.style.position = 'absolute'
  canvas.style.zIndex = zIndex.toString()
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  return {
    canvas,
    ctx
  }
}
