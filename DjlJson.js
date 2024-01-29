/**
 * Retrieve content from remote JSON source
 * Displays textContent while loading, then replaces with JSON response
 * @property {string} src         - URI to remote JSON
 * @property {string} prop        - Property of JSON to display
 * @property {string} placeholder - Interim content to display while retrieving and reading JSON
 */
// TODO: Add callback prop
// TODO: Allow accessing local objects
export default class DjlJson extends HTMLElement {
  static define(tag = 'djl-json') {
    customElements.define(tag, this)
  }

  static get observedAttributes() {
    return [ 'src', 'prop', 'placeholder' ]
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

  #render() {
    const getProp = (obj, prop) => {
      if (!prop.length) return obj
      return getProp(obj[prop[0]], prop.slice(1))
    }

    if (!this.prop || !this.src) return

    // I'm trusting the browser to cache stuff because I don't want to :^)
    fetch(this.src)
      .then(resp => {
        if (!resp.ok)
          throw new Error(`Unabled to retrieve resouce ${this.src} (${resp.statusText})`)
        return resp.json()
      })
      .then(json => getProp(json, this.prop.split('.')))
      .then(prop => this.textContent = prop)
      .catch(err => { console.error(err); this.textContent = err })
  }

  constructor() {
    super()
  }

  attributeChangedCallback() { this.#render() }
  connectedCallback() { this.#render() }
}

DjlJson.define()
