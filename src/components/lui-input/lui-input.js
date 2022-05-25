import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-input.scss';


export default class extends LuiBase {

    static properties = {
        placeholder: {
            type: String
        },
        type: {
            type: String
        },
        value: {
            type: String
        },
        width: {
            type: String
        },
        focused: {
            type: Boolean
        }
    };

    constructor() {
        super();
        this.type = 'text';
        this.width = '100px';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-input');
    }

    slotChangeHandler(e) {
        const $slot = e.target;
        if (!$slot) {
            return;
        }
        const childNodes = $slot.assignedNodes({
            flatten: true
        });
        if (childNodes.length) {
            this.$('label').style.display = 'inline-block';
        }
    }

    firstUpdated() {
        if (this.label) {
            this.slotChangeHandler({
                target: this.$('slot')
            });
        }
        if (this.focused) {
            const $input = this.$('input');
            $input.focus();
            $input.select();
        }
    }

    focusHandler(e) {
        e.target.select();
    }

    inputHandler(e) {
        e.stopPropagation();
        this.value = e.target.value;
        //console.log(this.value);
        this.emit('input', this.value);
    }
    
    render() {

        return html`
        
            <div class="lui-input ${this.cid}">
                <label>
                    <slot @slotchange=${this.slotChangeHandler}>${this.label}</slot>
                </label>
                <input
                    .disabled="${this.disabled}"
                    placeholder="${this.placeholder}"
                    .type="${this.type}"
                    value="${this.value}"
                    style="width: ${this.width};"
                    title="${this.title}"
                    @focus="${this.focusHandler}"
                    @input="${this.inputHandler}"
                />
            </div>
        
        `;
    }

}
