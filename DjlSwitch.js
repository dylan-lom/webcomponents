export default class DjlSwitch extends HTMLElement {
    static #AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

    static define(tag = 'djl-switch') {
        customElements.define(tag, this)
    }

    static get observedAttributes() {
        return [ 'expression', 'default' ]
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

    #isConnected = false
    shadow = null

    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async #rerender() {
        if (!this.#isConnected) return

        const f = (new DjlSwitch.#AsyncFunction(`return ${this.expression}`))
        const value = await f()

        // Clear children
        while (this.shadow.firstChild)
            this.shadow.removeChild(this.shadow.firstChild)

        // If no slot provided for this value, fallback to default slot.
        const slotName = this.querySelector(`*[slot="${value}"`) != null
            ? value
            : (this.default ?? "_")

        const template = document.createElement('template')
        template.innerHTML = `<slot name="${slotName}" />`
        this.shadow.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#isConnected = true
        this.#rerender()
    }

    attributeChangedCallback() {
        this.#rerender()
    }
}

DjlSwitch.define()