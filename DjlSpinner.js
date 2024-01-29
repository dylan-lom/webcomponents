const getSpinnerCss = ({background, foreground, size}) => {
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

/**
 * Loading spinner
 * @attribute background - background color of the spinner
 * @attribute foreground - foreground color of the spinner
 * @attribute size       - size of the spinner in pixels
 */
// TODO: Accept other size formats (ie. %, vh)
// TODO: Use style attribute instead...?
export default class DjlSpinner extends HTMLElement {
  shadow // ShadowRoot
  spinner // HTMLDivElement
  style // HTMLStyleElement

  static get observedAttributes() {
    return ['background', 'foreground', 'size']
  }

  constructor() {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })

    this.spinner = document.createElement('div')
    this.spinner.classList.add('loader')
    this.style = document.createElement('style')
    this.style.innerHTML = getSpinnerCss(this.props())

    this.shadow.appendChild(this.style)
    this.shadow.appendChild(this.spinner)
  }

  props = () => ({
    background: this.getAttribute('background') || '#eee',
    foreground: this.getAttribute('foreground') || '#333',
    size: parseInt(this.getAttribute('size')) || 20,
  })

  attributeChangedCallback() {
    this.style.innerHTML = getSpinnerCss(this.props())
  }

}

customElements.define('djl-spinner', DjlSpinner)

