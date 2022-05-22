import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-progress.scss';


export default class extends LuiBase {

    static properties = {
        percentage: {
            type: Number
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-progress');
    }
    
    render() {
        return html`<div class="lui-progress" style="background-size:${this.percentage}%;"></div>`;
    }

}
