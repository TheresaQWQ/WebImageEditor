import Render from './render'

class Editor {
  private root: HTMLElement
  private render: Render

  public image: HTMLImageElement

  constructor (root?: HTMLElement) {
    if (!root) throw new Error('root element is required')
    this.root = root

    this.root.style.position = 'relative'
    this.root.style.overflow = 'hidden'

    this.image = new Image()
    this.render = new Render(this.root)
  }

  loadImage (url: string) {
    this.image.onload = () => {
      this.render.init(this.image)
    }

    this.image.src = url
  }
}

// @ts-ignore
window.Editor = Editor
