export default class DjlLipsum extends HTMLElement {
  static define(tag = 'djl-lipsum') {
    customElements.define(tag, this)
  }
  
  static get observedAttributes() {
    return [ 'random-start', 'wrap', 'length' ]
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

  static lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas '
  + 'quis dui vel justo laoreet blandit. Cras tincidunt leo at mauris placerat '
  + 'aliquam. Suspendisse potenti. Quisque a justo sed ipsum finibus sollicitudin. In '
  + 'elementum sem ut nibh imperdiet, vitae varius eros consequat. Curabitur '
  + 'facilisis a dui sit amet sodales. Fusce ante nisl, imperdiet sit amet tempus id, '
  + 'hendrerit eu libero. Etiam laoreet luctus orci quis aliquam. Vivamus volutpat '
  + 'fringilla mattis. Quisque et orci a enim consectetur aliquet ac sagittis augue. '
  + 'Donec pretium orci quis justo mattis, quis molestie ex tristique. Quisque non '
  + 'rhoncus eros, ut iaculis arcu.';

  #baseText; // string

  #render() {
    this.#baseText = this.textContent || DjlLipsum.lipsum;
    this.textContent = this.#baseText;

    if (this.randomStart) {
      let words = this.textContent.split(" ");
      const startPosition = Math.floor(Math.random() * words.length) - 1;
      words = words.splice(startPosition)
      // This is rather upsetting.
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      this.textContent = words.join(" ");
    }

    const length = !!this.length
        ? Number.parseInt(this.length)
        : undefined;

    if (length) {
      if (this.textContent.length > length) {
        this.textContent = ' ' + this.textContent.slice(0, length - 1);
      }

      while (this.wrap != null && this.textContent.length < length) {
        const extraCharsToGet = length - this.textContent.length;
        const extraText = ' ' + this.#baseText.slice(0, extraCharsToGet - 1);
        this.textContent += extraText;
      }
    }
  }

  constructor() { super() }
  attributeChangedCallback() { this.#render() }
  connectedCallback() { this.#render() }
}

DjlLipsum.define()
