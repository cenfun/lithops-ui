import { html } from '../../vendor/lit.js';

import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-tab.scss';


export default class extends LuiBase {

    static properties = {
        selectedIndex: {
            attribute: 'selected-index',
            type: Number
        },
        position: {
            type: String
        },
        fullHeight: {
            attribute: 'full-height',
            type: Boolean
        }
    };

    _selectedIndex = 0;

    set selectedIndex(val) {
        const prev = this._selectedIndex;
        this._selectedIndex = val;
        if (prev !== val) {
            this.updateSelected();
        }
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-tab');
    }

    setSelected(index) {

        index = Util.toNum(index);
        if (index === this.selectedIndex) {
            return;
        }

        this.selectedIndex = index;
        
        this.updateSelected();

        this.emit('change', this.value || index);

    }

    updateSelected() {
        const $tabSlots = this.$('.lui-tab-tabs slot');
        if ($tabSlots) {
            const $tabItems = $tabSlots.assignedNodes({
                flatten: true
            });
            $tabItems.forEach(($tabItem, i) => {
                if (i === this.selectedIndex) {
                    $tabItem.setAttribute('selected', 'selected');
                    this.value = $tabItem.getAttribute('value');
                } else {
                    $tabItem.removeAttribute('selected');
                }
            });
        }

        const $paneSlots = this.$('.lui-tab-panes slot');
        if ($paneSlots) {
            const $paneItems = $paneSlots.assignedNodes({
                flatten: true
            });
            $paneItems.forEach(($paneItem, i) => {
                if (i === this.selectedIndex) {
                    $paneItem.setAttribute('selected', 'selected');
                } else {
                    $paneItem.removeAttribute('selected');
                }
            });
        }
    }

    initTabSlots() {
        const $tabSlots = this.$('.lui-tab-tabs slot');
        if ($tabSlots) {
            const $tabItems = $tabSlots.assignedNodes({
                flatten: true
            });
            $tabItems.forEach(($tabItem, i) => {
                $tabItem.setAttribute('index', i);
                $tabItem.setAttribute('position', this.position);
            });
        }
    }

    tabClickHandler(e) {
        let $tab = e.target;
        while ($tab && typeof $tab.getAttribute === 'function') {
            //console.log($tab);
            if ($tab.getAttribute('slot') === 'tab') {
                break;
            }
            $tab = $tab.parentNode;
        }

        if (!$tab) {
            return;
        }

        const index = $tab.getAttribute('index');
        if (index) {
            this.setSelected(index);
        }
    }

    firstUpdated() {
        this.initTabSlots();
        this.updateSelected();
    }

    slotChangeHandler() {
        //console.log(1);
        clearTimeout(this.timeout_slot);
        this.timeout_slot = setTimeout(() => {
            //console.log(2);
            this.initTabSlots();
            this.updateSelected();
        }, 10);
    }
    
    render() {
        const $toolbar = html`
            <div class="lui-tab-toolbar flex-row">
                <slot name="toolbar" @slotchange="${this.slotChangeHandler}"></slot>
            </div>
        `;

        const $tabs = html`
            <div class="lui-tab-tabs flex-row" @click="${this.tabClickHandler}">
                <slot name="tab" @slotchange="${this.slotChangeHandler}"></slot>
            </div>
        `;

        let $header = html`
            ${$tabs}
            <div class="flex-auto"></div>
            ${$toolbar}
        `;
        if (this.position === 'right') {
            $header = html`
                ${$toolbar}
                <div class="flex-auto"></div>
                ${$tabs}
            `;
        }

        const fh = this.fullHeight ? ' lui-tab-full-height' : '';

        return html`
    
        <div class="lui-tab${fh}">
            <div class="lui-tab-header flex-row">
                ${$header}
            </div>
            <div class="lui-tab-panes">
                <slot name="pane" @slotchange="${this.slotChangeHandler}"></slot>
            </div>
        </div>
        
        `;
    }

}
