import {activate} from './activate'

// quando o container ou os filhos recebem o foco
export const onFocusin =
  (state: Map<MediaScrollKey, MediaScrollVal>) => (e: FocusEvent) => {
    const scroller = e.currentTarget as HTMLUListElement
    const last = state.get('last_scroller')

    if (last === scroller) return
    if (state.has(scroller)) {
      const el = state.get(scroller)! as MediaScroll

      activate(state)(scroller, el.active)
      state.set('last_scroller', scroller)
    }
  }
