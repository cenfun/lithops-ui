import {
    html, classMap, styleMap
} from '../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-switch.scss';


const DEFAULT_COLORS = ['#1890ff', '#aaa'];

export default class extends LuiBase {

    static properties = {
        checked: {
            type: Boolean
        },
        flags: {
            type: String
        },
        colors: {
            type: String
        },
        width: {
            type: Number,
            state: true
        },
        size: {
            converter: (value, String) => {
                value = value.toLowerCase();
                if (value === 's' || value === 'small') {
                    return 's';
                }
                if (value === 'l' || value === 'large') {
                    return 'l';
                }
                return 'm';
            }
        }
    };

    constructor() {
        super();
        this.checked = false;
        this.flags = '';
        this.colors = '';
        this.size = 'm';
    }

    get baseSize() {
        if (this.size === 's') {
            return 14;
        }
        if (this.size === 'l') {
            return 18;
        }
        return 16;
    }

    updated() {
        super.updated();
        const checkedWidth = this.$('.lui-switch-button-checked-text').getBoundingClientRect().width;
        const uncheckedWidth = this.$('.lui-switch-button-unchecked-text').getBoundingClientRect().width;
        this.width = Math.max(checkedWidth, uncheckedWidth) + this.baseSize;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-switch');
    }

    clickHandler() {
        if (this.disabled) {
            return;
        }
        this.checked = !this.checked;
        this.emit('change', this.checked);
    }

    slotChangeHandler() {
        clearTimeout(this.timeoutSlotChange);
        this.timeoutSlotChange = setTimeout(() => {
            this.afterSlotChange();
        }, 0);
    }

    afterSlotChange() {
        if (this.$('slot').assignedNodes().length) {
            this.$('.lui-switch-label').style.display = 'inline-block';
        }
    }

    /* eslint-disable complexity */
    render() {
        const switchClassList = {
            'lui-switch': true,
            'lui-switch-small': this.size === 's',
            'lui-switch-large': this.size === 'l'
        };

        const buttonClassList = {
            'lui-switch-button': true,
            'lui-switch-button-checked': this.checked,
            'lui-switch-button-disabled': this.disabled
        };

        const colors = this.colors.split(',').map((item) => item.trim());
        const buttonStyle = {
            width: `${this.width + this.baseSize}px`,
            'background-color': this.checked ? colors[0] || DEFAULT_COLORS[0] : colors[1] || DEFAULT_COLORS[1]
        };

        const leftFlagStyle = {
            opacity: this.checked ? '1' : '0',
            width: this.checked ? `${this.width}px` : '0',
            color: this.checked ? '#fff' : 'transparent'
        };

        const rightFlagStyle = {
            opacity: this.checked ? '0' : '1',
            width: this.checked ? '0' : `${this.width}px`,
            color: this.checked ? 'transparent' : '#fff'
        };

        const flags = this.flags.split(',').map((item) => item.trim()) || [];
        const $flags = html`
            <div class="lui-switch-button-flag" style="${styleMap(leftFlagStyle)}">
                <span class="lui-switch-button-checked-text">${flags[0] || ''}</span>
            </div>
            <div class="lui-switch-button-flag" style="${styleMap(rightFlagStyle)}">
                <span class="lui-switch-button-unchecked-text">${flags[1] || ''}</span>
            </div>
        `;

        return html`
            <div class="${classMap(switchClassList)}">
                <div class="lui-switch-label">
                    <slot @slotchange="${this.slotChangeHandler}"></slot>
                </div>
                <div class="${classMap(buttonClassList)}" style="${styleMap(buttonStyle)}" @click=${this.clickHandler}>
                    ${$flags}
                    <div class="lui-switch-button-icon"></div>
                </div>
            </div>
        `;
    }
    
}
