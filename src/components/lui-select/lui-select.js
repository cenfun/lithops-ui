import { html } from 'lit';

import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base';

import componentStyle from './lui-select.scss';
import componentListStyle from './lui-select-list.scss';
export default class extends LuiBase {

    static properties = {
        label: {
            type: String
        },
        input: {
            type: Boolean
        },
        width: {
            type: String
        },
        options: {
            type: Array
        },
        list: {
            type: Array
        },
        value: {
            type: String
        },

        _viewWidth: {
            state: true
        }
    };

    constructor() {
        super();
        this.value = '';
        this.input = false;

        this._viewWidth = '45px';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-select');
        //for width generating
        this.addStyle(componentListStyle, 'lui-select-list');
        //for global style
        this.addStyle(componentListStyle, 'lui-select-list', true);
    }

    firstUpdated() {
        this.$view = this.$('.lui-select-view');
        this.$list = this.$('.lui-select-list');
        this.updateViewWidth();
    }

    updated() {
        this.updateViewWidth();
    }

    updateViewWidth() {

        if (this._viewWidthUpdated) {
            return;
        }

        if (this.width) {
            this._viewWidth = this.width;
            this._viewWidthUpdated = true;
            return;
        }

        if (!this.list) {
            return;
        }

        if (!this.$list) {
            return;
        }

        const iconWidth = 15;
        const listMinWidth = 45;
        const listMaxWidth = 300;
        
        const listRect = this.$list.getBoundingClientRect();
        //console.log(this.cid, listRect.width);
        const vw = Util.clamp(Math.ceil(listRect.width) + iconWidth, listMinWidth, listMaxWidth);

        this._viewWidth = `${vw}px`;
        this._viewWidthUpdated = true;

        //console.log(this._viewWidth);

        
    }

    open() {

        if (this.isOpen) {
            return;
        }

        if (this.disabled) {
            return;
        }

        if (!this.list) {
            return;
        }
        
        document.body.appendChild(this.$list);
        //this.$list.focus();

        this.isOpen = true;

        this.layout();

        //this.bindEvents();

    }

    layout() {
        if (!this.isOpen) {
            return;
        }

        const viewRect = this.$view.getBoundingClientRect();
        const listRect = this.$list.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();

        const spacing = 2;

        let top = Math.max(viewRect.top + viewRect.height + spacing, 0);
        if (viewRect.top + viewRect.height + listRect.height > bodyRect.height) {
            top = viewRect.top - listRect.height - spacing;
        }

        let left = Math.max(viewRect.left, 0);
        if (left + listRect.width > bodyRect.width) {
            left = bodyRect.width - listRect.width;
        }

        const st = this.$list.style;
        st.left = `${left}px`;
        st.top = `${top}px`;
        st.minWidth = `${viewRect.width}px`;

        //selected element.scrollIntoView();
        const $selected = this.$list.querySelector('.lui-select-item.selected');
        if ($selected) {
            $selected.scrollIntoView();
        }

    }

    closeAsync() {
        clearTimeout(this.timeout_close);
        this.timeout_close = setTimeout(() => {
            this.close();
        }, 10);
    }

    close() {
        this.isOpen = false;
        //this.unbindEvents();
        this.$list.remove();
    }

    onClick(e) {
        //console.log(e.type);
        this.open();
    }

    onFocus(e) {
        //console.log(e.type);
        this.open();
    }

    onBlur(e) {
        // console.log(e.type);
        if (this.isOpen) {
            this.closeAsync();
        }
    }

    onItemClick(e) {
        //console.log(e.type, 'onItemClick');

        this.closeAsync();

        //target for deletable
        const $elem = e.currentTarget;
        const index = $elem.getAttribute('index');
        if (!index) {
            //console.log('clicked index', index);
            return;
        }
        const clickedItem = this.list[index];
        if (!clickedItem || clickedItem === this.selectedItem) {
            return;
        }

        let selectedIndex = 0;
        this.list.forEach((item, i) => {
            if (item === clickedItem) {
                selectedIndex = i;
                item.selected = true;
            } else {
                item.selected = false;
            }
        });

        this.setSelected(selectedIndex);
        //console.log(this.selectedItem);

    }

    initList(list) {
        if (!list.length) {
            return;
        }

        this.list = list;

        let selectedIndex = 0;
        list.forEach((item, index) => {
            item.index = index;
            if (item.selected) {
                item.selected = false;
                selectedIndex = index;
            }
        });

        this.setSelected(selectedIndex);

        //console.log(this.list, this.value);
    }

    setSelected(selectedIndex = 0) {
        if (!this.list) {
            return;
        }
        this.selectedIndex = selectedIndex;
        this.selectedItem = this.list[selectedIndex];
        if (this.selectedItem) {
            this.selectedItem.selected = true;
            this.value = this.selectedItem.value;
        }
        this.emit('change', this.selectedItem);
    }

    initOptions(options) {
        const dataOptions = Array.from(options).map((item) => {
            if (item && typeof item === 'object') {
                const label = item.label;
                let value = item.value;
                if (Util.isInvalid(value)) {
                    value = label;
                }
                const selected = Boolean(item.selected);
                const deletable = Boolean(item.deletable);
                return {
                    label,
                    value,
                    selected,
                    deletable
                };
            }
            return {
                label: item,
                value: item
            };
        });
        this.initList(dataOptions);
    }

    slotChangeHandler(e) {
        const childNodes = e.target.assignedNodes({
            flatten: true
        }).filter((elem) => elem.nodeType === 1);
        const slotOptions = [];
        childNodes.forEach((elem) => {
            const label = elem.innerText;
            //value could be (empty)
            let value = elem.getAttribute('value');
            if (value === null) {
                value = label;
            }
            //selected only has key
            const selected = elem.getAttribute('selected') !== null;
            const deletable = elem.getAttribute('deletable') !== null;
            slotOptions.push({
                label,
                value,
                selected,
                deletable
            });
        });
        this.initList(slotOptions);
    }

    render() {

        let $label = '';
        if (this.label) {
            $label = html`
                <label>${this.label}</label>
            `;
        }

        let $options = '';
        if (this.options) {
            this.initOptions(this.options);
        } else {
            $options = html`
            <div class="lui-select-options">
                <slot @slotchange="${this.slotChangeHandler}"></slot>
            </div>
            `;
        }

        let $items = '';
        
        if (this.list) {
            $items = this.list.map((item) => {
                const cls = ['lui-select-item'];
                //no multiple selected
                if (item.index === this.selectedIndex) {
                    cls.push('selected');
                }
                let $delete = '';
                if (item.deletable) {
                    $delete = html`<div class="lui-select-item-delete" @click="${this.onItemDelete}"></div>`;
                }
                return html`
                    <div class="${Util.classMap(cls)}" index="${item.index}" @mousedown="${this.onItemClick}">
                        <div class="lui-select-item-label">${item.label}</div>
                        ${$delete}
                    </div>
                `;
            });
        }

        const viewCls = {
            'lui-select-view': true,
            'lui-select-input': this.input
        };

        const viewStm = {
            width: this._viewWidth ? `${this._viewWidth}` : null
        };

        return html`
            <div class="lui-select ${this.cid}">
                ${$label}
                <input
                    type="text"
                    class="${Util.classMap(viewCls)}"
                    style="${Util.styleMap(viewStm)}"
                    value="${this.value}"
                    .disabled="${this.disabled}"
                    ?readonly="${!this.input}"
                    @click="${this.onClick}"
                    @focus="${this.onFocus}"
                    @blur="${this.onBlur}"
                />
            </div>
            ${$options}
            <div class="lui-select-list" tabindex="0">
                ${$items}
            </div>
        `;
    }
}
