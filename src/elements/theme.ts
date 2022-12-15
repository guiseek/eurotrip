export class ETThemeElement extends HTMLButtonElement {
  static storageKey = 'theme-preference'

  colorScheme = matchMedia('(prefers-color-scheme: dark)')

  theme = {
    value: this.getColorPreference(),
  }

  document = window.document

  connectedCallback() {
    this.classList.add('theme-toggle')
    this.title = 'Toggles light & dark'
    this.ariaLive = 'polite'
    this.ariaLabel = 'auto'

    this.innerHTML = `
      <svg
        class="sun-and-moon"
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <mask class="moon" id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle
          class="sun"
          cx="12"
          cy="12"
          r="6"
          mask="url(#moon-mask)"
          fill="currentColor"
        />
        <g class="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    `

    this.reflectPreference()

    this.colorScheme.addEventListener('change', ({matches: isDark}) => {
      this.theme.value = isDark ? 'darkk' : 'light'
      this.setPreference()
    })

    this.onclick = this.onClick
  }

  getColorPreference() {
    const key = ETThemeElement.storageKey
    const preference = localStorage.getItem(key)

    if (preference) return preference
    else return this.colorScheme.matches ? 'dark' : 'light'
  }

  reflectPreference() {
    const firstChild = this.document.firstElementChild
    const themeToggle = this.document.querySelector('#theme-toggle')

    firstChild?.setAttribute('data-theme', this.theme.value)
    themeToggle?.setAttribute('aria-label', this.theme.value)
  }

  setPreference() {
    const key = ETThemeElement.storageKey
    localStorage.setItem(key, this.theme.value)

    this.reflectPreference()
  }

  onClick() {
    // flip current value
    this.theme.value = this.theme.value === 'light' ? 'dark' : 'light'

    this.setPreference()
  }
}
customElements.define('et-theme', ETThemeElement, {extends: 'button'})
