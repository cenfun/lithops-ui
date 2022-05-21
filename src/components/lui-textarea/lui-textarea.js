import { html } from '../../vendor/lit.js';

import LuiBase from '../../base/lui-base';
import componentStyle from './lui-textarea.scss';


export default class extends LuiBase {

    static properties = {
        name: {
            type: String
        },
        label: {
            type: String
        },
        maxLength: {
            attribute: 'max-length',
            type: Number
        },
        placeholder: {
            type: String
        },
        resize: {
            type: String
        },
        width: {
            type: String
        },
        height: {
            type: String
        },
        autofocus: {
            type: Boolean
        },
        value: {
            type: String
        }
    };

    constructor() {
        super();
        this.resize = 'none';
        this.autofocus = false;
        this.value = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-textarea');
    }

    firstUpdated() {
        if (this.label) {
            this.$('label').style.display = 'inline-block';
        }
        if (this.autofocus) {
            this.$('textarea').focus();
        }
    }

    focusHandler(e) {
        e.target.select();
    }

    inputHandler(e) {
        e.stopPropagation();
        this.value = e.target.value;
        this.emit('input', this.value);
    }

    slotChangeHandler(e) {
        clearTimeout(this.timeoutSlotChange);
        this.timeoutSlotChange = setTimeout(() => {
            this.afterSlotChange();
        }, 0);
    }

    afterSlotChange() {
        const text = this.innerHTML;
        if (!text) {
            return;
        }
        this.value = text;
    }

    render() {
        const cid = `lui-textarea-${this.uid}`;
        return html`
            <div class="lui-textarea">
                <label for="${cid}">
                    ${this.label}
                </label>
                <textarea
                    id="${cid}"
                    name="${this.name}"
                    .disabled="${this.disabled}"
                    .value="${this.value}"
                    maxlength="${this.maxLength}"
                    placeholder="${this.placeholder}"
                    style="resize: ${this.resize}; width: ${this.width}; height: ${this.height};"
                    @focus="${this.focusHandler}"
                    @input="${this.inputHandler}"
                ></textarea>
                <div class="lui-textarea-slot">
                    <slot @slotchange="${this.slotChangeHandler}"></slot>
                </div>
            </div>
        `;
    }
}
