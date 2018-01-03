interface SortyOptions {
  handleClassName?: string,
  placeholderClassName?: string,
  dragend? (ev: Event): any
  dragstart? (ev: Event): any
}

const defaults: SortyOptions = {
  handleClassName: '-placeholder',
  placeholderClassName: '-drag',
  dragend: () => {},
  dragstart: () => {}
}

class Sorty {
  element: HTMLElement = null
  placeholder: HTMLElement = null
  handle: HTMLElement = null
  options: SortyOptions = defaults

  constructor (element: HTMLElement, options: SortyOptions = {}) {
    this.element = element

    this.dragstart = this.dragstart.bind(this)
    this.dragend = this.dragend.bind(this)
    this.dragmove = this.dragmove.bind(this)

    Object.assign(this.options, options)

    this.bindChildren()
  }

  get children (): HTMLElement[] {
    return Array.from(this.element.children)
  }

  bindChildren (): void {
    this.children.forEach(el => this.bindChild(el))
  }

  bindChild (el: HTMLElement): void {
    Object.assign(el.style, { userSelect: 'none' })
    el.addEventListener('mousedown', this.dragstart, false)
  }

  /** Remove */
  orderChildren (): void {
    this.children.forEach((el, index) => {
      Object.assign(el.style, {
        order: index
      })
    })
  }

  dragstart (ev: Event): void {
    this.placeholder = ev.target as HTMLElement
    this.createHandle(ev.target as HTMLElement)
    this.options.dragstart(ev)
  }

  dragend (ev: Event): void {
    const el = (ev.target as HTMLElement)
    el.classList.remove(this.options.placeholderClassName)
    this.destroyHandle()
    document.removeEventListener('mousemove', this.dragmove)
    document.removeEventListener('mouseup', this.dragend)
    this.options.dragend(ev)
  }

  dragmove (ev: MouseEvent): void {
    this.positionHandle(ev)
  }

  createHandle (el: HTMLElement): void {
    const handle = el.cloneNode(true) as HTMLElement
    el.parentNode.insertBefore(handle, el)
    document.addEventListener('mouseup', this.dragend)
    document.addEventListener('mousemove', this.dragmove)
    handle.classList.add(this.options.handleClassName)
    handle.style.position = 'absolute'
    this.handle = handle
  }

  destroyHandle (): void {
    this.placeholder = null
    if (this.handle) {
      this.handle.remove()
    }
  }

  positionHandle (ev: MouseEvent): void {
    const { handle, placeholder } = this

    const left = `${placeholder.offsetLeft}px`
    const top = `${placeholder.offsetTop}px`

    const { clientX } = ev
    const w = handle.clientWidth / 2
    const x = clientX - placeholder.getBoundingClientRect().left - w
    const transform = `translate(${x}px)`

    const nearest = this.getNearestChild(clientX)
    const nth = this.children.indexOf(nearest)
    console.log(nth)

    Object.assign(handle.style, {
      top,
      left,
      transform
    })
  }

  getNearestChild (x: number): HTMLElement {
    return this.children.reduce((prev, curr) => {
      if (!prev) {
        return curr
      }

      const prevX = prev.getBoundingClientRect().left
      const currX = curr.getBoundingClientRect().left

      if (Math.abs(currX - x) < Math.abs(prevX - x)) {
        return curr
      }

      return prev
    }, null)
  }
}
