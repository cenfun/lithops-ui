import { html } from 'lit';

import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-switch.scss';

const defaultStates = ['', ''];
const defaultColors = ['#aaaaaa', '#1890ff'];

const defaultWidth = 'auto';

export default class extends LuiBase {

    static properties = {
        checked: {
            type: Boolean
        },
        states: {
            type: String,
            converter: (value) => {
                const ls = `${value}`.split(',').map((it) => it.trim());
                return [ls[0] || defaultStates[0], ls[1] || defaultStates[1]];
            }
        },
        colors: {
            type: String,
            converter: (value) => {
                const ls = `${value}`.split(',').map((it) => it.trim());
                return [ls[0] || defaultColors[0], ls[1] || defaultColors[1]];
            }
        },
        size: {
            converter: (value) => {
                value = value.toLowerCase();
                if (value === 's' || value === 'small') {
                    return 's';
                }
                if (value === 'l' || value === 'large') {
                    return 'l';
                }
                return 'm';
            }
        },
        width: {
            type: Number,
            state: true
        }
    };

    constructor() {
        super();
        this.checked = false;
        this.states = defaultStates;
        this.colors = defaultColors;
        this.size = 'm';
        this.width = defaultWidth;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-switch');
        //console.log(this.states, this.colors);
    }

    clickHandler() {
        if (this.disabled) {
            return;
        }
        this.checked = !this.checked;
        this.emit('change', this.checked);
    }

    firstUpdated() {
        //lock width
        const br = this.$('.lui-switch-button').getBoundingClientRect();
        const w = Math.ceil(br.width);

        this.width = `${w}px`;
        //console.log(this.cid, br.width, this.width);
    }

    slotChangeHandler() {
        clearTimeout(this.timeoutSlotChange);
        this.timeoutSlotChange = setTimeout(() => {
            this.afterSlotChange();
        }, 0);
    }

    afterSlotChange() {
        if (this.$('slot').assignedNodes().length) {
            this.$('.lui-switch-label').style.display = 'block';
        }
    }

    render() {

        const switchClassList = ['lui-switch', this.cid, `lui-switch-${this.size}`];

        const buttonClassList = {
            'lui-switch-button': true,
            'checked': this.checked,
            'disabled': this.disabled
        };

        const buttonStyle = {
            'width': this.width,
            'background-color': this.checked ? this.colors[1] : this.colors[0]
        };

        const $states = this.states.map((item, i) => {

            const stateCls = {
                'lui-switch-state': true,
                'checked': Boolean(i)
            };

            if (this.width !== defaultWidth) {
                let show = false;
                if ((this.checked && i === 1) || (!this.checked && i === 0)) {
                    show = true;
                }

                stateCls.show = show;
                stateCls.hide = !show;
            }
            
            return html`<div class="${Util.classMap(stateCls)}">${item}</div>`;
        });

        return html`
            <div class="${Util.classMap(switchClassList)}">
                <div class="lui-switch-label">
                    <slot @slotchange="${this.slotChangeHandler}"></slot>
                </div>
                <div class="${Util.classMap(buttonClassList)}" style="${Util.styleMap(buttonStyle)}" @click=${this.clickHandler}>
                    ${$states}
                    <div class="lui-switch-icon"></div>
                </div>
            </div>
        `;
    }
    
}
