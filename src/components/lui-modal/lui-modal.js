import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-modal.scss';


export default class extends LuiBase {

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-modal');
    }


    closeHandler() {
        this.remove();
        this.emit('close');
    }

    render() {

        return html`
            <div class="lui-modal">
                <div class="lui-modal-main lui-flex-column">
                    <div class="lui-modal-header">
                        <slot name="header"></slot>
                    </div>
                    <div class="lui-modal-content lui-flex-auto">
                        <slot name="content"></slot>
                    </div>
                </div>
                <div class="lui-modal-close" @click="${this.closeHandler}">X</div>
            </div>
        `;
    }

}
