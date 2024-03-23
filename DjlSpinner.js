export default class DjlSpinner extends HTMLElement {
  // TODO: Accept other size formats (ie. %, vh)
  // TODO: Use style attribute instead...?
  static define(tag = 'djl-spinner') {
    customElements.define(tag, this)
  }

  shadow // ShadowRoot
  spinner // HTMLDivElement
  style // HTMLStyleElement

  static get observedAttributes() {
    return ['background', 'foreground', 'size']
  }

  static {
    // Declare getter/setter wrappers around observedAttributes (JS/DOM interface)
    this.observedAttributes.forEach(attribute => {
      Object.defineProperty(this.prototype, attribute, {
        get: function() { return this.getAttribute(attribute) },
        set: function(value) { return this.setAttribute(attribute, value) },
      })
    })
  }

  static #getSpinnerCss = (background = '#eee', foreground = '#333', size = '20') => {
    size = Number.parseInt(size)
    return `
      @keyframes __spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loader {
        display: inline-block;
        vertical-align: top;
        margin: 0 0.25em;
        border: ${size * 0.2}px solid ${background};
        border-top: ${size * 0.2}px solid ${foreground};
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        animation: __spin 2s linear infinite;
      }`
  }

  #render() {
    // When unset attributes are null. We want the default in this case, so we pass undefined
    this.style.innerHTML = DjlSpinner.#getSpinnerCss(
      this.background ?? undefined,
      this.foreground ?? undefined,
      this.size ?? undefined
    )
  }

  constructor() {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.spinner = document.createElement('div')
    this.spinner.classList.add('loader')
    this.style = document.createElement('style')

    this.shadow.appendChild(this.style)
    this.shadow.appendChild(this.spinner)
  }

  attributeChangedCallback() { this.#render() }
  connectedCallback() { this.#render() }
}

DjlSpinner.define()
