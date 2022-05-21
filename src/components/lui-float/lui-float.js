import { html } from '../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-float.scss';


export default class extends LuiBase {

    static properties = {
        content: {
            type: String
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-float');
    }
    
    render() {
        return html`<slot>${this.content}</slot>`;
    }

}
