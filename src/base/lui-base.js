import { LitElement } from 'lit';
import Util from '../util/util.js';
import baseStyle from './lui-base.scss';

let uid = 1;
class LuiBase extends LitElement {

    //must be override
    static tagName = '';
    
    static properties = {
        instanceId: {
            attribute: 'instance-id',
            type: String
        },
        dataId: {
            attribute: 'data-id',
            type: String
        },
        data: {
            attribute: false
        },
        // active: {
        //     type: Boolean,
        //     reflect: true
        // }
        label: {
            type: String
        },
        disabled: {
            type: Boolean
        }
    };

    constructor() {
        super();
        this.uid = `${uid++}`;
        this.instanceId = `lui-${this.uid}`;
        this.label = '';
        this.disabled = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.host = this.shadowRoot.host;
        this.addStyle(baseStyle, 'base');
    }

    addStyle(style, context, $element) {

        if ($element === true) {
            $element = document.head;
        }

        const $root = $element || this.shadowRoot;

        //console.log($root);
        if (!$root) {
            return;
        }

        if (context) {
            const $prev = $root.querySelector(`style[context="${context}"]`);
            if ($prev) {
                return $prev;
            }
        }

        const getStyleStr = (st) => {
            if (typeof st.toString === 'function') {
                st = st.toString();
            }
            if (typeof st !== 'string') {
                st = `${st}`;
            }
            return st;
        };

        const $style = document.createElement('style');
        $style.innerHTML = getStyleStr(style);
        if (context) {
            $style.setAttribute('context', context);
        }
        $root.appendChild($style);
        
        return $style;
    }

    //===================================================================

    $(selector) {
        if (this.shadowRoot) {
            return this.shadowRoot.querySelector(selector);
        }
        return null;
    }

    $$(selector) {
        if (this.shadowRoot) {
            return this.shadowRoot.querySelectorAll(selector);
        }
        return null;
    }

    isCE($elem) {
        return Util.isCE($elem);
    }

    emit(type, detail, bubbles = false) {
        this.dispatchEvent(new CustomEvent(type, {
            detail,
            bubbles
        }));
        return this;
    }

    on(type, handler) {
        this.addEventListener(type, handler);
        return this;
    }

    off(type, handler) {
        this.removeEventListener(type, handler);
        return this;
    }

    //===================================================================

    render() {
        return 'Hello Base Element';
    }

}

export default LuiBase;
