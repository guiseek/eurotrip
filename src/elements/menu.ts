import {queryAll} from '../utils'

export class ETMenuElement extends HTMLMenuElement {
  connectedCallback() {
    this.innerHTML = `
      <li><button value="sampa">sampa</button></li>
      <li><button value="paris">paris</button></li>
      <li><button value="italy">italy</button></li>
      <li><button value="switzerland">switzerland</button></li>
      <li><button value="austria">austria</button></li>
    `

    const {matches: motionOK} = matchMedia(
      '(prefers-reduced-motion: no-preference)'
    )

    if (motionOK) {
      onmousemove = ({clientX, clientY}) => {
        const {dx, dy} = this.getAngles(clientX, clientY)

        this.style.setProperty('--x', `${dy / 20}deg`)
        this.style.setProperty('--y', `${dx / 20}deg`)
      }
    }

    queryAll('button', this).forEach((button) => {
      button.onclick = async () => {
        button.classList.add('puff-out-center')

        this.fetchPhotos(button.value).then((contents) => {
          this.emitActivated(button.value, contents)
        })

        const animations = Promise.allSettled(
          button.getAnimations().map((animation) => animation.finished)
        )

        const parentEl = button.parentElement

        animations.then(() => {
          this.emitAnimationEnd()
          parentEl?.remove()
        })
      }
    })
  }

  async fetchPhotos(country: string): Promise<Content[]> {
    return await fetch(`./photos/${country}.json`).then((res) => res.json())
  }

  emitActivated(name: string, photos: Content[]) {
    const payload = {detail: {name, photos}}
    this.dispatchEvent(new CustomEvent('activated', payload))
  }

  emitAnimationEnd() {
    this.dispatchEvent(new CustomEvent('animationEnd'))
  }

  handleClick() {}

  getAngles(clientX: number, clientY: number) {
    const {x, y, width, height} = this.getBoundingClientRect()

    const dx = clientX - (x + 0.5 * width)
    const dy = clientY - (y + 0.5 * height)

    return {dx, dy}
  }
}
customElements.define('et-menu', ETMenuElement, {extends: 'menu'})

interface Activated {
  name: string
  photos: Content[]
}

declare global {
  interface HTMLElementTagNameMap {
    'menu[is="et-menu"]': ETMenuElement
  }
  interface HTMLElementEventMap {
    activated: CustomEvent<Activated>
    animationEnd: CustomEvent<void>
  }
}
