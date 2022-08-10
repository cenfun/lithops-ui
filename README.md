![](scripts/lithops.jpg)
# Lithops UI
- Lightweight UI web components based on [lit](https://github.com/lit/lit)
- Zero dependencies (lit bundled)
- Dist size (js minified: false): 240.6KB / gzip: 47.8KB

## Preview Online
[https://cenfun.github.io/lithops-ui/](https://cenfun.github.io/lithops-ui/)

## Components
- lui-button- lui-checkbox- lui-flyover- lui-input- lui-loading- lui-modal- lui-progress- lui-radio- lui-select- lui-switch- lui-tab
## Install
```sh
npm i lithops-ui
```
## Usage
```html
<script src="path-to/dist/lithops-ui.js"></script>
<script>
    const lui = window['lithops-ui'];
    console.log(lui.components);
</script>
<lui-button>button</lui-button>
<lui-button primary>primary</lui-button>
<lui-button disabled>disabled</lui-button>

```
see [public/index.html](public/index.html)

