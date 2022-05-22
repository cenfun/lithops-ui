import { html } from 'lit';

import LuiBase from '../../../base/lui-base.js';
import componentStyle from './lui-select-option.scss';

export default class extends LuiBase {
    static private = true;

    static properties = {
        key: {
            type: String
        },
        value: {
            type: String
        },
        selected: {
            type: Boolean,
            reflect: true
        },
        label: {
            type: String
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-select-option');
    }

    clickHandler() {
        this.selected = !this.selected;
        const detail = {
            key: this.key,
            value: this.value,
            text: this.innerText,
            label: this.label
        };
        this.emit('change', detail, true);
    }

    render() {
        return html`
            <div class="lui-select-option" @click="${this.clickHandler}">
                <slot></slot>
            </div>
        `;
    }
}
