'use strict';

import katex from 'https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.mjs';

/**
 * KaTex mathematical typesetting
 */
export default class DjlTex extends HTMLElement {
  displayMode // boolean
  source // string

  shadow // ShadowRoot
  link // HTMLLinkElement
  tex // HTMLDivElement

  constructor() {
    super();

    this.displayMode = this.getAttribute('displayMode') != null;
    this.source = this.textContent;

    this.shadow = this.attachShadow({ mode: 'open' });

    if (!this.displayMode) {
      this.style.display = 'inline-block';
    }

    // Load katex CSS for this element
    this.link = document.createElement('link');
    this.link.setAttribute('rel', 'stylesheet');
    this.link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.css');
    this.shadow.appendChild(this.link);

    this.tex = document.createElement('div');
    this.shadow.appendChild(this.tex);

    // TODO: For some reason the rendering of cases environment looks
    // terrible when rendered in html mode :(
    const hasMathML = (typeof MathMLElement == 'function')
    katex.render(this.source, this.tex, {
        throwOnError: false,
        output: hasMathML ? 'mathml' : 'html',
        displayMode: this.displayMode,
    });
    
  }

}

customElements.define('djl-tex', DjlTex);

