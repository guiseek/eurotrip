import {focusPreviousItem} from './on-previous-item'
import {focusNextItem} from './focus-next-item'
import {KeyCode} from './key-code'

const computedStyle = getComputedStyle(document.documentElement)
const isRtl = computedStyle.direction === 'rtl'

export const onKeydown =
  (state: Map<MediaScrollKey, MediaScrollVal>) => (e: KeyboardEvent) => {
    const scroller = e.currentTarget as HTMLUListElement
    console.log(e)

    switch (e.key) {
      case KeyCode[isRtl ? 'ArrowLeft' : 'ArrowRight']:
      case KeyCode.ArrowDown: {
        e.preventDefault()
        focusNextItem(state)(scroller)
        break
      }
      case KeyCode[isRtl ? 'ArrowRight' : 'ArrowLeft']:
      case KeyCode.ArrowUp: {
        e.preventDefault()
        focusPreviousItem(state)(scroller)
        break
      }
    }
  }
