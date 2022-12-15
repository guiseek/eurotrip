import {query, queryAll} from './utils'
import {TemplateInstance} from './tmpl'
import {scroller} from './scroller'
import './style.scss'
import './elements'

const countries = [
  'sampa',
  'madrid',
  'paris',
  'italy',
  'switzerland',
  'austria',
]

const sectionTmpl = query('template#section')
const photoTmpl = query('template#photo')
const dialogEl = query('dialog#viewer')

const fetchJSON = async (name: string): Promise<Content[]> => {
  return fetch(`/photos/${name}.json`).then((res) => res.json())
}

if (sectionTmpl && photoTmpl && dialogEl) {
  const appendPhotos = async (name: string) => {
    const photos = await fetchJSON(name)
    const container = new TemplateInstance(sectionTmpl, {name})

    const ul = container.querySelector('ul')

    photos.forEach((content, i) => {
      const scope = {...content, name, i: i + 1}
      const photo = new TemplateInstance(photoTmpl, scope)
      ul && ul.appendChild(photo)
    })

    document.body.appendChild(container)
  }

  countries.forEach(appendPhotos)

  /**
   * scroller
   */
  const target = 'a'
  queryAll('ul.scroller').forEach((element) => scroller({element, target}))

  /**
   * dialog
   */
  const closeDialog = () => {
    location.hash = ''
    dialogEl.close()
  }
  onkeydown = (e) => {
    const isOpen = dialogEl.open
    const isEsc = e.key === 'Escape'
    if (isOpen && isEsc) closeDialog()
  }
  const onClick = ({target}: MouseEvent) => {
    if (target === dialogEl) closeDialog()
  }
  dialogEl.addEventListener('click', onClick)
  const img = dialogEl.querySelector('img')

  /**
   * nav
   */
  const handleNav = () => {
    if (location.hash) {
      img.src = location.hash.replace('#', '')
      dialogEl.showModal()
    } else if (dialogEl.open) {
      dialogEl.close()
    }
  }

  handleNav()

  onhashchange = handleNav
}
