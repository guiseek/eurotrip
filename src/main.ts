import {mediaScroller} from './media-scroller'
import {TemplateInstance} from './tmpl'
import {query, queryAll} from './utils'
import './style.scss'

const sectionTmpl = query('template#section')
const photoTmpl = query('template#photo')
const dialogEl = query('dialog#viewer')

const fetchPhotos = (): Promise<Section[]> =>
  fetch('./photos.json').then((res) => res.json())

if (sectionTmpl && photoTmpl && dialogEl) {
  fetchPhotos().then((sections) => {
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

    queryAll('ul.media-scroller').forEach((scroller) =>
      mediaScroller({
        element: scroller,
        target: 'a',
      })
    )

    const onClick = ({target}: MouseEvent) => {
      if (target === dialogEl) dialogEl.close()
    }
    dialogEl.addEventListener('click', onClick)
    onkeydown = (e) => {
      if (dialogEl.open && e.key === 'Escape') {
        dialogEl.close()
      }
    }
    queryAll('ul.media-scroller a').forEach((anchor) => {
      const url = `#${anchor.href.replace(location.origin, '')}`

      anchor.onclick = (e) => {
        e.preventDefault()

        const img = dialogEl.querySelector('img')
        if (img) img.src = anchor.href
        dialogEl.showModal()

        location.replace(url)
      }

      if (location.hash === url) {
        anchor.click()
      }
    })
  })
}
