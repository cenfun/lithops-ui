import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-loading.scss';


export default class extends LuiBase {

    static properties = {
        center: {
            type: Boolean
        },
        fast: {
            type: Boolean
        },
        color: {
            type: String
        },
        size: {
            type: String
        },
        hide: {
            type: Boolean
        }
    };

    constructor() {
        super();
        this.color = '#999';
        //'', 's', 'm', 'l'
        this.size = 'm';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-loading');
    }

    getClassList() {
        const ls = ['lui-loading', this.cid];
        if (this.fast) {
            ls.push('lui-loading-fast');
        }
        ls.push(`lui-loading-${this.size || 'm'}`);
        if (this.hide) {
            ls.push('lui-loading-hide');
        }
        return ls.join(' ');
    }
    
    render() {

        const classList = this.getClassList();

        let cssText = '';
        if (this.center) {
            cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);';
        }
        this.host.style.cssText = cssText;

        return html`
        <div class="${classList}">
            <div class="lui-loading-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path
                        d="M1,8 A7 7 0 1 1 8 15"
                        stroke="${this.color}"
                        stroke-width="2"
                        stroke-linecap="round"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
        `;
    }

}
