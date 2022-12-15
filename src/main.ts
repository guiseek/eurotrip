import {query, queryAll} from './utils'
import {TemplateInstance} from './tmpl'
import {scroller} from './scroller'
import './style.scss'
import './elements'

const sectionTmpl = query('template#section')
const photoTmpl = query('template#photo')
const dialogEl = query('dialog#viewer')

const fetchPhotos = (): Promise<Section[]> =>
  fetch('./photos.json').then((res) => res.json())

if (sectionTmpl && photoTmpl && dialogEl) {
  fetchPhotos().then((sections) => {
    /**
     * containers
     */
    sections.forEach((section) => {
      const name = section.name.replace('photos/', '')
      const container = new TemplateInstance(sectionTmpl, {name})

      section.contents.forEach((content) => {
        const [, , alt, file] = content.name.split('/')
        const caption = file.replace('.webp', '')
        const scope = {...content, alt, caption}
        const photo = new TemplateInstance(photoTmpl, scope)
        const ul = container.querySelector('ul')
        ul && ul.appendChild(photo)
      })

      document.body.appendChild(container)
    })

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
  })
}
