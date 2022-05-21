import { html, styleMap } from '../../../vendor/lit.js';

import LuiBase from '../../../base/lui-base.js';
import componentStyle from './lui-select-dropdown.scss';

export default class extends LuiBase {
    static private = true;


    static properties = {
        parentRect: {
            attribute: 'parent-rect',
            type: Object
        },
        options: {
            type: Array
        },
        selectedOptions: {
            attribute: 'selected-options',
            type: Array
        },
        height: {
            type: Number,
            state: true
        }
    };

    constructor() {
        super();
        //for click target path
        this.isPopup = true;
        this.parentRect = {
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            height: 0,
            width: 0
        };
        this.options = [];
        this.selectedOptions = [];
        this.height = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-select-dropdown');
    }

    updated() {
        const $dropdown = this.$('.lui-select-dropdown');
        this.height = $dropdown.getBoundingClientRect().height;
    }

    changeHandler(e) {
        this.emit('change', e.detail);
    }

    render() {
        const top = this.parentRect.top + window.scrollY;
        const left = this.parentRect.left + window.scrollX;
        const width = this.parentRect.width;
        const transTop = this.parentRect.bottom + this.height > document.body.clientHeight
             && this.height < this.parentRect.top;
        const style = {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            transform: transTop ? 'translateY(-100%)' : `translateY(${this.parentRect.height}px)`,
            'box-shadow': transTop ? '0 -2px 8px rgb(0 0 0 / 30%)' : '0 2px 8px rgb(0 0 0 / 30%)'
        };

        const $options = this.options.map((option) => {
            const selected = this.selectedOptions.some((item) => {
                return item.key === option.key;
            });
            return html`
                <lui-select-option
                    .key="${option.key}"
                    .label="${option.label}"
                    .value="${option.value}"
                    .selected="${selected}"
                >
                    ${option.text}
                </lui-select-option>
            `;
        });

        return html`
            <div class="lui-select-dropdown" style="${styleMap(style)}" @change="${this.changeHandler}">
                ${$options}
            </div>
        `;
    }
}
