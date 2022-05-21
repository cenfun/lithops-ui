import { html } from '../../../vendor/lit.js';

//import Util from '../../../util/util.js';

import LuiBase from '../../../base/lui-base.js';

export default class extends LuiBase {

    static private = true;

    static properties = {
        position: {
            type: String
        }
    };

    constructor() {
        super();
        this.position = 'left';
    }

    render() {

        return html`
            <div style="float:${this.position};">
                <slot></slot>
            </div>
        `;
    }

}
