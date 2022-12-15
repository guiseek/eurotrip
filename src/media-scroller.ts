enum KeyCode {
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
}

const state = new Map<MediaScrollKey, MediaScrollVal>()

const computedStyle = getComputedStyle(document.documentElement)
const isRtl = computedStyle.direction === 'rtl'

const focusNextItem = (rover: MediaScrollKey) => {
  const rx = state.get(rover)! as MediaScroll

  // incrementa o índice de estado
  rx.index += 1

  // prende a navegação aos limites do alvo
  if (rx.index > rx.targets.length - 1) rx.index = rx.targets.length - 1

  // usa o estado do índice móvel para encontrar o próximo
  let next = rx.targets[rx.index]

  // encontrou algo, ative-o
  next && activate(rover, next)
}

const focusPreviousItem = (rover: MediaScrollKey) => {
  const rx = state.get(rover)! as MediaScroll

  // decremento do índice de estado
  rx.index -= 1

  // clamp to 0 and above only
  if (rx.index < 1) rx.index = 0

  // usa o estado do índice móvel para encontrar o próximo
  let prev = rx.targets[rx.index]

  // encontrou algo, ative-o
  prev && activate(rover, prev)
}

const activate = (rover: MediaScrollKey, item: HTMLElement) => {
  const rx = state.get(rover)! as MediaScroll

  // remove o item de índice da guia antiga
  rx.active.tabIndex = -1

  // define o novo item ativo e foca nele
  rx.active = item
  rx.active.tabIndex = 0
  rx.active.focus()
}

// quando o container ou os filhos recebem o foco
const onFocusin = (e: FocusEvent) => {
  const rover = e.currentTarget as HTMLUListElement
  const last = state.get('last_rover')
  if (last === rover) return
  if (state.has(rover)) {
    const el = state.get(rover)! as MediaScroll

    activate(rover, el.active)
    state.set('last_rover', rover)
  }
}

const onKeydown = (e: KeyboardEvent) => {
  const rover = e.currentTarget as HTMLUListElement
  console.log(e)

  switch (e.key) {
    case KeyCode[isRtl ? 'ArrowLeft' : 'ArrowRight']:
    case KeyCode.ArrowDown: {
      e.preventDefault()
      focusNextItem(rover)
      break
    }
    case KeyCode[isRtl ? 'ArrowRight' : 'ArrowLeft']:
    case KeyCode.ArrowUp: {
      e.preventDefault()
      focusPreviousItem(rover)
      break
    }
  }
}

const observer = new MutationObserver((mutationList) => {
  mutationList
    .filter((x) => x.removedNodes.length > 0)
    .forEach((mutation) => {
      Array.from(mutation.removedNodes)
        .filter((x) => x.nodeType === 1)
        .forEach((removedEl) => {
          state.forEach((v, k) => {
            if (k === 'last_rover') return

            const key = k as HTMLUListElement
            const val = v as MediaScroll

            if (removedEl.contains(key)) {
              key.removeEventListener('focusin', onFocusin)
              key.removeEventListener('keydown', onKeydown)

              state.delete(key)
              val.targets.forEach((a) => (a.tabIndex = 0))

              const isEmpty = state.size === 0
              const onlyLastRover = state.size === 1 && state.has('last_rover')

              if (isEmpty || onlyLastRover) {
                state.clear()
                observer.disconnect()
              }
            }
          })
        })
    })
})

export const mediaScroller = ({element: rover, target: selector}: Options) => {
  // esta API permite string vazia ou query string
  const targetQuery = selector || ':scope *'
  const targets = rover.querySelectorAll<Options['target']>(targetQuery)

  const [startingPoint] = Array.from(targets)

  // remove o container do fluxo de navegação
  rover.tabIndex = -1
  // e todas seus filhos
  targets.forEach((a) => (a.tabIndex = -1))
  // exceto o primeiro, que aceita foco
  startingPoint.tabIndex = 0

  // com o container atual como chave
  // armazena o estado com referências úteis
  state.set(rover, {
    targets,
    active: startingPoint,
    index: 0,
  })

  rover.addEventListener('focusin', onFocusin)

  // observe as teclas direcionais
  rover.addEventListener('keydown', onKeydown)

  observer.observe(document, {
    childList: true,
    subtree: true,
  })
}
