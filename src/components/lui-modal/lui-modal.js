import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-modal.scss';


export default class extends LuiBase {

    static properties = {
        header: {
            type: String
        }
    };

    constructor() {
        super();
        this.header = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-modal');
    }


    closeHandler() {
        this.remove();
        this.emit('close');
    }

    render() {

        let $header = '';
        if (this.header) {
            $header = html`
                <div class="lui-modal-header">${this.header}</div>
            `;
        }

        return html`
            <div class="lui-modal-mask" @click="${this.closeHandler}"></div>
            <div class="lui-modal ${this.cid}">
                <div class="lui-modal-main lui-flex-column">
                    ${$header}
                    <div class="lui-modal-content lui-flex-auto">
                        <slot></slot>
                    </div>
                </div>
                <div class="lui-modal-close" @click="${this.closeHandler}">X</div>
            </div>
        `;
    }

}
