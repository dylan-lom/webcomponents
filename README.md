# webcomponents

A small set of not-super-useful [Web Components][1]

* `djl-lipsum`    - lorem-ipsum on demand!
* `djl-script`    - inline, editable javascript!
* `djl-spinner`   - a generic loading spinner!
* `djl-json`      - display a JSON property!
* `djl-codeblock` - syntax-highlighted codeblock!
* `djl-tex`       - render equations with [KaTex][2]!
* `djl-youtube`   - embed youtube videos!
* `djl-(if|else)` - conditionally manage elements!
* `djl-switch`    - conditionally render elements!

You can view some examples [here](https://dylan-lom.github.io/webcomponents/example.html)

## Usage

The components are designed to be standalone -- for example if you
only want to use the `djl-script` component, something like 
`<script type="module" src="https://raw.githubusercontent.com/dylan-lom/webcomponents/main/DjlScript.js"></script>`
would be sufficient to enable to `<djl-script>` element.

See [example.html](example.html) for a working example usage. Components
should be largely self-documenting from their source code.

[1]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[2]: https://github.com/KaTeX/KaTeX

