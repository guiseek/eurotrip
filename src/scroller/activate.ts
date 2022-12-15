export const activate =
  (state: Map<MediaScrollKey, MediaScrollVal>) =>
  (scroller: MediaScrollKey, item: HTMLElement) => {
    const ms = state.get(scroller)! as MediaScroll

    // remove o item de índice da guia antiga
    ms.active.tabIndex = -1

    // define o novo item ativo e foca nele
    ms.active = item
    ms.active.tabIndex = 0
    ms.active.focus()
  }
