import Render from './render'
import Keyboard from './input/keyboard'
import Mouse from './input/mouse'

export default class Root {
  // @ts-ignore
  public root: HTMLElement
  // @ts-ignore
  public Render: Render
  // @ts-ignore
  public keyboard: Keyboard
  // @ts-ignore
  public mouse: Mouse

  public setRoot (root: HTMLElement) {
    this.root = root

    this.keyboard = new Keyboard()
    this.mouse = new Mouse(root)
  }

  public setRender (render: Render) {
    this.Render = render
  }
}
