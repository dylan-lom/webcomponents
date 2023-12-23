/**
 * Conditional container
 * @attribute predicate - javascript expression
 * @attribute ifClass - class to be given to this element when the predicate is true
 * @attribute elseClass - class to be given to this element when the predicate is false (default: 'hidden')
 */
class DjlIf extends HTMLElement {
  static get observedAttributes() {
    return [ 'predicate', 'ifClass', 'elseClass' ]
  }

  static #AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

  get predicate() { return this.getAttribute('predicate') }
  set predicate(p) { this.setAttribute('predicate', p) }
  get ifClass() { return this.getAttribute('ifClass') || undefined }
  set ifClass(c) { this.setAttribute('ifClass', c) }
  get elseClass() { return this.getAttribute('elseClass') || 'hidden' }
  set elseClass(c) { this.setAttribute('elseClass', c) }

  #isConnected = false

  constructor() {
    super();
    this.classList.add(this.elseClass) /* Guilty until proven innocent */
  }

  async #rerender() {
    if (!this.#isConnected) return

    const predicate = (new DjlIf.#AsyncFunction(`return (${this.predicate})`))()
      .catch(error => {
        console.error(error)
        return false
      })

    if (await predicate) {
      this.classList.add(this.ifClass)
      this.classList.remove(this.elseClass)
    } else {
      this.classList.add(this.elseClass)
      this.classList.remove(this.ifClass)
    }
  }

  attributeChangedCallback() {
    console.log('attributeChangedCallback')
    this.#rerender()
  }

  connectedCallback() {
    console.log('connectedCallback')
    this.#isConnected = true
    this.#rerender()
  }
}

customElements.define('djl-if', DjlIf)