import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../../base/lui-base.js';
import componentStyle from './lui-tab-item.scss';

export default class extends LuiBase {

    static private = true;

    static properties = {
        position: {
            type: String
        },
        selected: {
            type: Boolean
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-tab-item');
    }


    render() {

        const classList = ['lui-tab-item'];
        if (this.position) {
            classList.push(`lui-tab-${this.position}`);
        }
        if (this.selected) {
            classList.push('selected');
        }

        classList.push('flex-row');

        return html`
            <div class="${classList.join(' ')} ">
                <slot></slot>
            </div>
        `;
    }

}
