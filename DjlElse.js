export default class DjlElse extends HTMLElement {
  static get observedAttributes() {
    return [ 'href', 'ifClass', 'elseClass' ]
  }

  get href() { return this.getAttribute('href') }
  set href(s) { this.setAttribute('href', s) }
  get ifClass() { return this.getAttribute('ifClass') || 'hidden' }
  set ifClass(c) { this.setAttribute('ifClass', c) }
  get elseClass() { return this.getAttribute('elseClass') || undefined }
  set elseClass(c) { this.setAttribute('elseClass', c) }

  #isConnected = false

  constructor() {
    super();
    this.classList.add(this.ifClass) /* Guilty until proven innocent */
  }

  getAssociatedIf() {
    // The if is specified in the attributes
    if (this.href) return document.querySelector(this.href)

    // Check for a left-sibling djl-if element
    const siblings = Array.from(this.parentNode.children)
    const myIndex = siblings.indexOf(this)

    const preceedingIfSiblings = siblings.slice(0, myIndex)
      .filter(sibling => sibling.nodeName.toLowerCase() == 'djl-if')

    if (!preceedingIfSiblings) {
      console.error([
        'Unable to determine the associated <djl-if> component of a <djl-else>',
        'If the associated <djl-if> is not preceediing sibling of the <djl-else> then it must be specified in the <djl-else>\'s href attribute'
      ].join('\n'))
      return undefined
    }

    return preceedingIfSiblings.pop()
  }

  #rerender() {
    if (!this.#isConnected) return
    const associatedIf = this.getAssociatedIf()
    if (!associatedIf) return

    if (associatedIf.getResult()) {
      this.classList.add(this.ifClass)
      this.classList.remove(this.elseClass)
    } else {
      this.classList.add(this.elseClass)
      this.classList.remove(this.ifClass)
    }
  }

  attributeChangedCallback() { this.#rerender() }
  connectedCallback() {
    this.#isConnected = true
    this.#rerender()
  }
  associatedIfChangedCallback() { this.#rerender() }
}

customElements.define('djl-else', DjlElse)