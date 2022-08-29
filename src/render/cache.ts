export default class Cache {
  private history: any[]
  private length: number

  constructor (len: number) {
    this.history = []
    this.length = len
  }

  append (id: string, data: any) {
    this.history.push(data)
    if (this.history.length > this.length) {
      this.history.shift()
    }
  }

  get (id: string) {
    return this.history.find((item: any) => item.id === id)
  }

  delete (id: string) {
    this.history = this.history.filter((item: any) => item.id !== id)
  }
}
