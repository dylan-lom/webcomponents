'use strict';

import katex from 'https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.mjs';

/**
 * KaTex mathematical typesetting
 */
export default class DjlTex extends HTMLElement {
  static define(tag = 'djl-tex') {
    customElements.define(tag, this)
  }

  static get observedAttributes() {
    return [ 'displayMode' ]
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


  source // string

  shadow // ShadowRoot
  link // HTMLLinkElement
  tex // HTMLDivElement

  #render() {
    // TODO: For some reason the rendering of cases environment looks
    // terrible when rendered in html mode :(

    const hasMathML = (typeof MathMLElement == 'function')
    katex.render(this.source, this.tex, {
      throwOnError: false,
      output: hasMathML ? 'mathml' : 'html',
      displayMode: this.displayMode !== null,
    });
  }

  constructor() {
    super();

    this.source = this.textContent;

    this.shadow = this.attachShadow({ mode: 'open' });

    if (this.displayMode === null) {
      this.style.display = 'inline-block';
    }

    // Load katex CSS for this element
    this.link = document.createElement('link');
    this.link.setAttribute('rel', 'stylesheet');
    this.link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.css');
    this.shadow.appendChild(this.link);

    this.tex = document.createElement('div');
    this.shadow.appendChild(this.tex);

  }

  attributeChangedCallback() { this.#render() }
  connectedCallback() { this.#render() }
}

DjlTex.define()
