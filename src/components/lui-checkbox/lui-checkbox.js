
import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-checkbox.scss';


export default class extends LuiBase {
    
    static properties = {
        checked: {
            type: Boolean
        },
        value: {
            type: String
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
        this.addStyle(componentStyle, 'lui-checkbox');
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
        this.checked = e.target.checked;
        this.emit('change', {
            value: this.value,
            checked: this.checked
        }, true);
    }

    render() {
        return html`
            <div class="lui-checkbox ${this.cid}">
                <input
                    id="${this.cid}"
                    .checked="${this.checked}"
                    .disabled="${this.disabled}"
                    value="${this.value}"
                    type="checkbox"
                    @change="${this.changeHandler}"
                >
                <label for="${this.cid}">
                    <slot></slot>
                </label>
            </div>
        `;
    }

}
