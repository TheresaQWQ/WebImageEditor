import Cache from './cache'
import Selection from './layers/selection'
import Image from './layers/image'
import Background from './layers/background'

export default class Render {
  private history: any[]
  private cache: Cache

  public layers: {
    selection: Selection,
    image: Image,
    background: Background
  }

  constructor (root: HTMLElement) {
    this.history = []
    this.cache = new Cache(10)
    this.layers = {
      image: new Image(),
      selection: new Selection(),
      background: new Background()
    }

    this.layers.background.setRoot(root)
    this.layers.image.setRoot(root)
    this.layers.selection.setRoot(root)

    this.layers.background.setRender(this)
    this.layers.image.setRender(this)
    this.layers.selection.setRender(this)

    this.layers.background.init()
    this.layers.image.init()
    this.layers.selection.init()
  }

  public init (image: HTMLImageElement) {
    this.layers.image.render(image)
  }

  public update () {
    // 渲染
  }
}
