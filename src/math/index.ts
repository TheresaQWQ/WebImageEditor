export default {
  // 计算两点之间的距离
  distance (x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  },
  // 坐标是否在矩形内
  inArea (x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
    const formatedX1 = Math.min(x1, x2)
    const formatedX2 = Math.max(x1, x2)
    const formatedY1 = Math.min(y1, y2)
    const formatedY2 = Math.max(y1, y2)

    return x >= formatedX1 && x <= formatedX2 && y >= formatedY1 && y <= formatedY2
  }
}
