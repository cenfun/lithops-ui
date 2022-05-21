import { html, classMap } from '../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base';
import componentStyle from './lui-select.scss';


export default class extends LuiBase {

    static properties = {
        label: {
            type: String
        },
        focus: {
            type: Boolean,
            state: true
        },
        dropdownDisplayed: {
            type: Boolean,
            state: true
        },
        multiple: {
            type: Boolean
        },
        width: {
            type: String
        },
        options: {
            type: Array,
            state: true
        }
    };

    constructor() {
        super();
        this.dropdownDisplayed = false;
        this.focus = false;
        this.multiple = false;
        this.selectedOptions = [];
        this.width = '200px';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-select');
    }

    firstUpdated() {
        this.dataOptions = this.options;
    }

    setOptions(options) {
        const mapOptions = options.map((option) => {
            const value = option.value;
            const text = option.text;
            const label = option.label || text;
            const key = option.key || value || label;
            return {
                key, value, label, text
            };
        });
        this.options = mapOptions;
        this.dataOptions = mapOptions;
        this.$dropdown?.requestUpdate();
    }

    childChangeHandler(e) {
        if (this.multiple) {
            clearTimeout(this.timeoutCloseDropdown);
            const index = this.selectedOptions.findIndex((item) => {
                return item.key === e.detail.key;
            });
            if (index >= 0) {
                this.selectedOptions.splice(index, 1);
            } else {
                this.selectedOptions.push(e.detail);
            }
        } else {
            this.selectedOptions = [];
            this.selectedOptions.push(e.detail);
        }
        this.requestUpdate();
        this.updateComplete.then(() => {
            this.$dropdown.parentRect = this.$('.lui-select-value').getBoundingClientRect();
            this.$dropdown.requestUpdate();
        });
        clearTimeout(this.timeoutBlur);
        this.$dropdown.childNodes.forEach((child) => {
            if (child !== e.target) {
                child.removeAttribute('selected');
            }
            e.target.setAttribute('selected', 'selected');
        });
        this.$('.lui-select-value').focus();
        
        this.emitChange();
    }

    emitChange() {
        let detail = this.selectedOptions[0]?.value;
        if (this.multiple) {
            detail = this.selectedOptions.map((item) => {
                return item.value;
            });
        }
        this.emit('change', detail);
    }

    switchDropdown() {
        if (this.disabled) {
            return;
        }
        if (this.dropdownDisplayed) {
            this.closeDropdown();
            return;
        }
        this.showDropdown();
    }

    showDropdown() {
        this.focus = true;
        if (!this.dataOptions || this.dataOptions.length === 0) {
            return;
        }
        const clientRect = this.$('.lui-select-value').getBoundingClientRect();
        const $dropdown = document.createElement('lui-select-dropdown');
        $dropdown.parentRect = clientRect;
        $dropdown.options = this.dataOptions;
        $dropdown.selectedOptions = this.selectedOptions;
        $dropdown.addEventListener('change', (e) => {
            this.childChangeHandler(e);
        });
        this.$dropdown = $dropdown;
        document.body.appendChild(this.$dropdown);
        this.dropdownDisplayed = true;
    }

    blurHandler() {
        this.timeoutBlur = setTimeout(() => {
            this.focus = false;
        }, 200);
        if (!this.multiple) {
            this.closeDropdown();
            return;
        }
        this.timeoutCloseDropdown = setTimeout(() => {
            this.closeDropdown();
        }, 200);
    }

    closeDropdown() {
        if (!this.$dropdown || !this.dropdownDisplayed) {
            return;
        }
        this.$dropdown.classList.add('lui-select-dropdown-leave');
        setTimeout(() => {
            this.$dropdown.classList.remove('lui-select-dropdown-leave');
            this.$dropdown.remove();
            this.dropdownDisplayed = false;
        }, 200);
    }

    slotChangeHandler() {
        clearTimeout(this.timeoutSlotChange);
        this.timeoutSlotChange = setTimeout(() => {
            this.afterSlotChange();
        }, 0);
    }

    afterSlotChange() {
        const $slot = this.$('slot');
        if (!$slot) {
            return;
        }
        const $options = $slot.assignedElements();
        const options = [];
        $options.forEach((option) => {
            const item = {
                key: option.key || option.value || option.innerText,
                value: (option.hasAttribute('value') || option.value) ? option.value : option.innerText,
                text: option.innerText,
                label: option.label || option.innerText
            };
            options.push(item);
            if (option.selected) {
                this.selectedOptions.push(item);
                this.requestUpdate();
            }
        });
        this.dataOptions = options;
    }

    deleteSelectedItem(e, item) {
        e.stopPropagation();
        if (this.disabled) {
            return;
        }
        this.selectedOptions.splice(this.selectedOptions.indexOf(item), 1);
        this.requestUpdate();
        if (this.dropdownDisplayed) {
            this.updateComplete.then(() => {
                this.$dropdown.parentRect = this.$('.lui-select-value').getBoundingClientRect();
                this.$dropdown.requestUpdate();
            });
        }
        
        this.emitChange();
    }

    render() {
        const labelClassList = {
            'lui-select-label': true,
            'lui-select-label-show': this.label
        };
        
        const inputClassList = {
            'lui-select-value': true,
            'lui-select-value-focus': this.focus,
            'lui-select-value-disabled': this.disabled
        };

        let value;
        if (this.multiple) {
            value = this.selectedOptions.map((item) => {
                const label = item.label;
                return html`
                    <div class="lui-select-selected-item">
                        ${label}
                        <svg 
                            class="lui-select-selected-item-delete"
                            @click="${(e) => this.deleteSelectedItem(e, item)}"
                            viewBox="0,0,4,4"
                        >
                            <line x1="0" y1="0" x2="4" y2="4"></line>
                            <line x1="0" y1="4" x2="4" y2="0"></line>
                        </svg>
                    </div>
                `;
            });
        } else {
            const label = this.selectedOptions[0]?.label;
            value = html`<div class="lui-select-selected-item">${label}</div>`;
        }

        let optionsSlot;
        if (!this.options) {
            optionsSlot = html`
                <div class="lui-select-options">
                    <slot @slotchange="${this.slotChangeHandler}">
                    </slot>
                </div>
            `;
        }

        return html`
            <div class="${classMap(labelClassList)}">
                ${this.label}
            </div> 
            <div class="lui-select" style="width: ${this.width};">
                <div
                    class="${classMap(inputClassList)}"
                    type="text"
                    tabindex="0"
                    @click="${this.switchDropdown}"
                    @blur="${this.blurHandler}"
                >
                    ${value}
                </div>
                <i class="lui-select-dropdown-icon"></i>
                ${optionsSlot}
            </div>
        `;
    }
}
