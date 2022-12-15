import {mutation} from './mutation-observer'
import {onFocusin} from './on-focusin'
import {onKeydown} from './on-keydown'

export const state = new Map<MediaScrollKey, MediaScrollVal>()

export const scroller = ({element, target}: Options) => {
  type R = Options['target']

  // esta API permite string vazia ou query string
  const selector: R = target ?? ':scope *'
  const targets = element.querySelectorAll(selector)

  const [active] = Array.from(targets)
  const index = 0

  // remove o container do fluxo de navegação
  element.tabIndex = -1
  // e todas seus filhos
  targets.forEach((a) => (a.tabIndex = -1))
  // exceto o primeiro, que aceita foco
  active.tabIndex = 0

  // com o container atual como chave
  // armazena o estado com referências úteis
  state.set(element, {targets, active, index})

  element.addEventListener('focusin', onFocusin(state))

  // observe as teclas direcionais
  element.addEventListener('keydown', onKeydown(state))

  const options = {childList: true, subtree: true}
  mutation(state).observe(document, options)
}
