import Cache from './cache'
import Selection from './layers/selection'
import Image from './layers/image'

export default class Render {
  private history: any[]
  private cache: Cache

  public layers: {
    selection: Selection,
    image: Image
  }

  constructor (root: HTMLElement) {
    this.history = []
    this.cache = new Cache(10)
    this.layers = {
      image: new Image(),
      selection: new Selection()
    }

    this.layers.image.setRoot(root)
    this.layers.selection.setRoot(root)

    this.layers.image.init()
    this.layers.selection.init()
  }

  public init (image: HTMLImageElement) {
    this.layers.image.render(image, 0, 0, image.width, image.height)
  }

  public update () {
    // 渲染
  }
}
