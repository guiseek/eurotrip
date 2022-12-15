import {activate} from './activate'

export const focusPreviousItem =
  (state: Map<MediaScrollKey, MediaScrollVal>) =>
  (scroller: MediaScrollKey) => {
    const ms = state.get(scroller)! as MediaScroll

    // decremento do índice de estado
    ms.index -= 1

    // clamp to 0 and above only
    if (ms.index < 1) ms.index = 0

    // usa o estado do índice móvel para encontrar o próximo
    let prev = ms.targets[ms.index]

    // encontrou algo, ative-o
    prev && activate(state)(scroller, prev)
  }
