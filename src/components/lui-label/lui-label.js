import { html } from '../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-label.scss';


export default class extends LuiBase {

    static properties = {
        content: {
            type: String
        },
        size: {
            type: Number
        }
    };

    constructor() {
        super();
        this.size = 16;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-label');
    }
    
    render() {

        return html`<div style="font-size:${this.size}px;">
                <slot>${this.content}</slot>
            </div>
        `;
    }

}
