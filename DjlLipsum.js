/**
 * 
 * @property {string} baseText           - Text that textContent will be based on.
 * @property {number | undefined} length - Length of text to be displayed (in characters). If wrap is false, this is inferred as maximum length.
 * @property {boolean} randomStart       - Whether baseText should pick a random word to start on.
 * @property {boolean} wrap              - Whether baseText should return to the start if the length
 * condition hasn't been satisfied.
 * @property {string} lipsum             - Lorem Ipsum text. Used as a fallback if no user supplied
 * text.
 */
// TODO: Allow child elements
// TODO: Implement attributeChangedCallback
export default class DjlLipsum extends HTMLElement {
  static define(tag = 'djl-lipsum') {
    customElements.define(tag, this)
  }

  baseText; // string
  length; // number|undefined
  randomStart; // boolean
  wrap // boolean
  

  lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas '
        + 'quis dui vel justo laoreet blandit. Cras tincidunt leo at mauris placerat '
        + 'aliquam. Suspendisse potenti. Quisque a justo sed ipsum finibus sollicitudin. In '
        + 'elementum sem ut nibh imperdiet, vitae varius eros consequat. Curabitur '
        + 'facilisis a dui sit amet sodales. Fusce ante nisl, imperdiet sit amet tempus id, '
        + 'hendrerit eu libero. Etiam laoreet luctus orci quis aliquam. Vivamus volutpat '
        + 'fringilla mattis. Quisque et orci a enim consectetur aliquet ac sagittis augue. '
        + 'Donec pretium orci quis justo mattis, quis molestie ex tristique. Quisque non '
        + 'rhoncus eros, ut iaculis arcu.';

  constructor() {
    super();

    this.baseText = this.textContent || this.lipsum;
    this.textContent = this.baseText;

    this.randomStart = (this.getAttribute('random-start') !== null);
    if (this.randomStart) {
      let words = this.textContent.split(" ");
      const startPosition = Math.floor(Math.random() * words.length) - 1;
      words = words.splice(startPosition)
      // This is rather upsetting.
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      this.textContent = words.join(" ");
    }

    this.wrap = (this.getAttribute('wrap') !== null);
    this.length = !!this.getAttribute('length') ?
        // NOTE: TypeScript doesn't like it, but 'length' will be 'string' here.
        Number.parseInt(this.getAttribute('length') || '0') :
        undefined;

    if (this.length) {
      if (this.textContent.length > this.length) {
        this.textContent = ' ' + this.textContent.slice(0, this.length - 1);
      }

      while (this.wrap && this.textContent.length < this.length) {
        const extraCharsToGet = this.length - this.textContent.length;
        const extraText = ' ' + this.baseText.slice(0, extraCharsToGet - 1);
        this.textContent += extraText;
      }
    }
  }
}

DjlLipsum.define()
