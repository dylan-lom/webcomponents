/**
 * Syntax-highlighted code block
 * @attribute keywords - space delimited list of keywords to highlight
 * @attribute language - the language to associate keyword highlighting with
 */
class DjlCodeBlock extends HTMLElement {
  static languages = {
    console:    [ 'if', 'elif', 'else', 'for', 'in', 'do', 'then', 'done', 'return', 'exit', 'echo' ],
    c:          [ 'if', 'else', 'for', 'while', 'do', 'return', 'enum', 'struct', 'typedef', ],
    javascript: [ 'if', 'else', 'for', 'while', 'return', 'function', 'class', 'constructor', 'var', 'const', 'let', 'undefined', ],
    python:     [ 'if' ,'elif', 'else', 'for', 'while', 'def', 'class', '__init__', 'return', ],
  }

  language // string
  keywords // string[]

  constructor() {
    super();

    this.language = this.getAttribute('language');
    if (this.language) {
        this.keywords = DjlCodeBlock.languages[this.language];
    }

    const keywords = this.getAttribute('keywords');
    if (keywords) {
      this.keywords = keywords.split(' ');
    }

    // TODO: This breaks on adjacent keywords (such as `else if`)!
    if (this.keywords) {
      const re = new RegExp(
        '(?<prefix>[^a-zA-Z])'
            + `(?<keyword>${this.keywords.join('|')})`
            + '(?<postfix>[^a-zA-Z])',
        'g'
      )
      console.log(re)

      this.innerHTML = this.innerHTML.replaceAll(re, '$1<span class="keyword">$2</span>$3')
    }

    if (this.language) {
        DjlCodeBlock.languages[this.language] = this.keywords;
    }

    this.style.display = 'block';
    this.style.whiteSpace = 'pre';
    this.style.fontFamily = 'monospace';
  }
}

customElements.define('djl-codeblock', DjlCodeBlock)
