/**
 * Inline, editable code tag. 
 * Executed and rendered as <code> initially; on click displays an <input> of the
 * JavaScript. On submit re-executes and renders <code>.
 *
 * @attribute bool disabled -- viewing (and editing) script is disabled
 */
class DjlScript extends HTMLElement {
  code; // HTMLElement
  form; // HTMLFormElement
  input; // HTMLInputElement

  sourceCode; // string
  disabled = false; // boolean


  // TODO: Allow for linebreaks in textContent.
  constructor() {
    super();

    if (this.getAttribute('disabled') != null) this.disabled = true;

    /*
     * Hijack the textContent. We don't actually want to display it, so stash it
     * away in sourceCode and set textContent to empty string.
     * There is probably away to use textContent properly, but I'm not sure
     * how...
     */
    this.sourceCode = this.textContent || '';
    this.textContent = '';

    // Create sub-elements.
    this.code = document.createElement('code');
    this.form = document.createElement('form');
    this.input = document.createElement('input');
    this.input.type = 'text';


    this.resizeInput();
    this.input.value = this.sourceCode;
    this.evaluate().then(r => this.code.textContent = r);
    // Inherit padding and margin, so the form doesn't inflate the line height
    this.form.style.margin = 'inherit';
    this.form.style.padding = 'inherit';
    this.input.style.margin = 'inherit';
    this.input.style.padding = 'inherit';

    // Initial display state has code shown, input hidden.
    this.form.style.display = 'none';
    this.code.style.display = 'inline-block';

    this.form.appendChild(this.input);
    this.appendChild(this.code);
    this.appendChild(this.form);

    if (!this.disabled) {
      // Display form when code is clicked on.
      this.code.addEventListener('click', (e) => {
        this.resizeInput();
        this.toggleDisplay();
        this.input.focus();
      });
    }

    // Update and display code when submitting form
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        this.sourceCode = this.input.value;
        this.code.textContent = await this.evaluate();
        delete this.dataset.negative;
      } catch (ex) {
        console.error(ex);
        this.code.textContent = ex.message;
        this.dataset.negative = 'true';
      }
      this.toggleDisplay();
    });
  }

  async evaluate() {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    return await (new AsyncFunction(`return ${this.sourceCode}`))();
  }

  resizeInput() {
    this.input.size = this.input.value.length || 10;
  }

  toggleDisplay() {
    this.code.style.display = this.code.style.display === 'none' ?
        'inline-block' :
        'none';
    this.form.style.display = this.form.style.display === 'none' ?
        'inline-block' :
        'none';
  }

  
}

customElements.define('djl-script', DjlScript)
