import {activate} from './activate'

export const focusNextItem =
  (state: Map<MediaScrollKey, MediaScrollVal>) =>
  (scroller: MediaScrollKey) => {
    const ms = state.get(scroller)! as MediaScroll

    // incrementa o índice de estado
    ms.index += 1

    // prende a navegação aos limites do alvo
    if (ms.index > ms.targets.length - 1) ms.index = ms.targets.length - 1

    // usa o estado do índice móvel para encontrar o próximo
    let next = ms.targets[ms.index]

    // encontrou algo, ative-o
    next && activate(state)(scroller, next)
  }
