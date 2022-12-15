const menu = document.querySelector('.threeD-button-set')
const menuRect = menu.getBoundingClientRect()

const getAngles = (clientX: number, clientY: number) => {
  const {x, y, width, height} = menuRect

  const dx = clientX - (x + 0.5 * width)
  const dy = clientY - (y + 0.5 * height)

  return {dx, dy}
}

const {matches: motionOK} = matchMedia(
  '(prefers-reduced-motion: no-preference)'
)
export const initMenu = () => {
  if (motionOK) {
    onmousemove = ({clientX, clientY}) => {
      const {dx, dy} = getAngles(clientX, clientY)

      menu.style.setProperty('--x', `${dy / 20}deg`)
      menu.style.setProperty('--y', `${dx / 20}deg`)
    }
  }
}
