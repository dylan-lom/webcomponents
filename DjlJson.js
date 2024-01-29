/**
 * Retrieve content from remote JSON source
 * Displays textContent while loading, then replaces with JSON response
 * @property {string} src         - URI to remote JSON
 * @property {string} prop        - Property of JSON to display
 * @property {string} placeholder - Interim content to display while retrieving and reading JSON
 */
// TODO: Add callback prop
// TODO: Allow accessing local objects
// TODO: Implement attributeChangedCallback and re-fetch
export default class DjlJson extends HTMLElement {
  src // string
  prop // string
  placeholder // string

  constructor() {
    super()

    this.src = this.getAttribute('src')
    this.prop = this.getAttribute('prop').split('.')
    this.placeholder = this.textContent

    this.fetchSrc()
  }


  fetchSrc = () => {
    return fetch(this.src)
      .then(resp => {
        if (!resp.ok)
          throw new Error(`Unabled to retrieve resouce ${this.src} (${resp.statusText})`)
        return resp.json()
      })
      .then(json => this.getProp(json, this.prop))
      .then(prop => this.textContent = prop)
      .catch(err => { console.error(err); this.textContent = err })
  }

  getProp = (obj, prop) => {
    if (!prop.length) return obj
    return this.getProp(obj[prop[0]], prop.slice(1))
  }

}

customElements.define('djl-json', DjlJson)
