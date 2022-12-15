import {onFocusin} from './on-focusin'
import {onKeydown} from './on-keydown'

export const mutation = (state: Map<MediaScrollKey, MediaScrollVal>) => {
  const observer = new MutationObserver((mutationList) => {
    mutationList
      .filter((x) => x.removedNodes.length > 0)
      .forEach((mutation) => {
        Array.from(mutation.removedNodes)
          .filter((x) => x.nodeType === 1)
          .forEach((removedEl) => {
            state.forEach((v, k) => {
              if (k === 'last_scroller') return

              const key = k as HTMLUListElement
              const val = v as MediaScroll

              if (removedEl.contains(key)) {
                key.removeEventListener('focusin', onFocusin(state))
                key.removeEventListener('keydown', onKeydown(state))

                state.delete(key)
                val.targets.forEach((a) => (a.tabIndex = 0))

                const isEmpty = state.size === 0
                const onlyLastRover =
                  state.size === 1 && state.has('last_scroller')

                if (isEmpty || onlyLastRover) {
                  state.clear()
                  observer.disconnect()
                }
              }
            })
          })
      })
  })

  return observer
}
