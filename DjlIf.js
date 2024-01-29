import DjlElse from './DjlElse.js' /* NOTE: We implicitly depend on this by
                                      referencing the DjlElse methods, even
                                      though we don't use the class directly. */

/**
 * Conditional container
 * @attribute predicate - javascript expression
 * @attribute ifClass - class to be given to this element when the predicate is true
 * @attribute elseClass - class to be given to this element when the predicate is false (default: 'hidden')
 */
export default class DjlIf extends HTMLElement {
  static define(tag = 'djl-if') {
    customElements.define(tag, this)
  }

  static get observedAttributes() {
    return [ 'predicate', 'ifClass', 'elseClass' ]
  }

  static #AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

  get predicate() { return this.getAttribute('predicate') }
  set predicate(p) { this.setAttribute('predicate', p) }
  get ifClass() { return this.getAttribute('ifClass') }
  set ifClass(c) { this.setAttribute('ifClass', c) }
  get elseClass() { return this.getAttribute('elseClass') || 'hidden' }
  set elseClass(c) { this.setAttribute('elseClass', c) }

  #isConnected = false
  #result = undefined

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

    this.#result = await predicate
    if (this.#result) {
      if (this.ifClass?.length) this.classList.add(this.ifClass)
      if (this.elseClass?.length) this.classList.remove(this.elseClass)
    } else {
      if (this.elseClass?.length) this.classList.add(this.elseClass)
      if (this.ifClass?.length) this.classList.remove(this.ifClass)
    }

    /* If there are associated <djl-else> elements, then they should rerender too */
    Array.from(document.querySelectorAll('djl-else'))
      .filter(djlElse => {
        return djlElse.isConnected && djlElse.getAssociatedIf() == this
      })
      .forEach(djlElse => djlElse.associatedIfChangedCallback())
  }

  attributeChangedCallback() { this.#rerender() }

  connectedCallback() {
    this.#isConnected = true
    this.#rerender()
  }

  getResult() {
    return this.#result
  }
}

DjlIf.define()
