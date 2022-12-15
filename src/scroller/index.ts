import {mutation} from './mutation-observer'
import {onFocusin} from './on-focusin'
import {onKeydown} from './on-keydown'

export const state = new Map<MediaScrollKey, MediaScrollVal>()

export const scroller = ({element, target}: Options) => {
  // esta API permite string vazia ou query string
  const targetQuery = target || ':scope *'
  const targets = element.querySelectorAll<Options['target']>(targetQuery)

  const [startingPoint] = Array.from(targets)

  // remove o container do fluxo de navegação
  element.tabIndex = -1
  // e todas seus filhos
  targets.forEach((a) => (a.tabIndex = -1))
  // exceto o primeiro, que aceita foco
  startingPoint.tabIndex = 0

  // com o container atual como chave
  // armazena o estado com referências úteis
  state.set(element, {
    targets,
    active: startingPoint,
    index: 0,
  })

  element.addEventListener('focusin', onFocusin(state))

  // observe as teclas direcionais
  element.addEventListener('keydown', onKeydown(state))

  mutation(state).observe(document, {
    childList: true,
    subtree: true,
  })
}
