/**
 * Syntax-highlighted code block
 * @attribute keywords - space delimited list of keywords to highlight
 * @attribute language - the language to associate keyword highlighting with
 */
export default class DjlCodeBlock extends HTMLElement {
  static define(tag = 'djl-codeblock') {
    customElements.define(tag, this)
  }

  static languages = {
    console:    [ 'if', 'elif', 'else', 'for', 'in', 'do', 'then', 'done', 'return', 'exit', 'echo' ],
    c:          [ 'if', 'else', 'for', 'while', 'do', 'return', 'enum', 'struct', 'typedef', ],
    javascript: [ 'if', 'else', 'for', 'while', 'return', 'function', 'class', 'constructor', 'var', 'const', 'let', 'undefined', ],
    python:     [ 'if' ,'elif', 'else', 'for', 'while', 'def', 'class', '__init__', 'return', ],
  }

  static get observedAttributes() {
    return ['language', 'keywords']
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
    const keywords = this.keywords?.split(' ') ?? DjlCodeBlock.languages[this.language] ?? []
    // TODO: This breaks on adjacent keywords (such as `else if`)!
    if (keywords) {
      const re = new RegExp(
        '(?<prefix>[^a-zA-Z])'
            + `(?<keyword>${keywords.join('|')})`
            + '(?<postfix>[^a-zA-Z])',
        'g'
      )
      this.innerHTML = this.innerHTML.replaceAll(re, '$1<span class="keyword">$2</span>$3')
    }

    /* Save the user's keywords for the given language for subsequent use in
     * DjlCodeBlock elements.
     * NOTE: The user may choose to 'shadow' our predefined keywords by passing
     * in their own via the keywords attribute. In this case we want to preserve
     * their preffered keywords (so we override our defaults) */
    if (this.language) {
        DjlCodeBlock.languages[this.language] = keywords;
    }

    this.style.display = 'block';
    this.style.whiteSpace = 'pre';
    this.style.fontFamily = 'monospace';
  }

  constructor() {
    super();
  }

  attributeChangedCallback() { this.#render() }
  connectedCallback() { this.#render() }
}

DjlCodeBlock.define()
