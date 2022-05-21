import {
    html, classMap, styleMap
} from '../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-radio.scss';


export default class extends LuiBase {

    static properties = {
        checked: {
            type: Boolean
        },
        value: {
            type: String
        },
        maxWidth: {
            attribute: 'max-width',
            type: Number
        },
        name: {
            type: String
        }
    };

    constructor() {
        super();
        this.checked = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-radio');
        if (this.checked) {
            this.radioCheckedHandler();
        }
    }

    firstUpdated() {
        if (!this.value && !this.hasAttribute('value')) {
            this.$('slot').addEventListener('slotchange', () => {
                this.slotChangeHandler();
            });
        }
    }

    slotChangeHandler() {
        clearTimeout(this.timeoutSlotChange);
        this.timeoutSlotChange = setTimeout(() => {
            this.afterSlotChange();
        }, 0);
    }

    afterSlotChange() {
        const data = this.innerText;
        if (data) {
            this.value = data;
        }
    }

    changeHandler(e) {
        this.setAttribute('checked', 'checked');
        this.radioCheckedHandler();
        this.emit('change', e.target.value, true);
    }

    radioCheckedHandler() {
        const radios = this.getRootNode().querySelectorAll(`${this.constructor.tagName}[name=${this.name}]`);
        Array.from(radios).forEach((radio) => {
            if (radio === this) {
                return;
            }
            radio.removeAttribute('checked');
        });
    }

    render() {
        const labelStyle = {
            'max-width': this.maxWidth ? `${this.maxWidth}px` : null
        };
        const labelClass = {
            'label-ellipsis': Boolean(this.maxWidth)
        };
        const cid = `lui-radio-${this.uid}`;

        return html`
            <div class="lui-radio">
                <input
                    .checked="${this.checked}"
                    .disabled="${this.disabled}"
                    id="${cid}"
                    value="${this.value}"
                    type="radio"
                    @change="${this.changeHandler}"
                >
                <label for="${cid}" style="${styleMap(labelStyle)}" class="${classMap(labelClass)}">
                    <slot></slot>
                </label>
            </div>
        `;
    }

}
