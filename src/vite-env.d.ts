/// <reference types="vite/client" />

interface Options<T extends keyof HTMLElementTagNameMap = 'a'> {
  element: HTMLUListElement
  target: T
}

interface MediaScroll<T extends keyof HTMLElementTagNameMap = 'a'> {
  targets: NodeListOf<HTMLElementTagNameMap[T]>
  active: HTMLElement
  index: number
}

type MediaScrollKey = HTMLUListElement | string
type MediaScrollVal = HTMLUListElement | MediaScroll


interface Section {
  type: string
  name: string
  contents: Content[]
}

interface Content {
  type: Type
  name: string
}

enum Type {
  File = 'file',
}