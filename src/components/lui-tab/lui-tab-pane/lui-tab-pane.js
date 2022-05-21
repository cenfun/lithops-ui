import { html } from '../../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../../base/lui-base.js';
import componentStyle from './lui-tab-pane.scss';
export default class extends LuiBase {

    static private = true;

    static properties = {
        selected: {
            type: Boolean
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-tab-pane');
    }


    render() {

        if (this.selected) {
            this.style.display = 'block';
        } else {
            this.style.display = 'none';
        }

        return html`
            <div class="lui-tab-pane">
                <slot></slot>
            </div>
        `;
    }

}
