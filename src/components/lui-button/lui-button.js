import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-button.scss';


export default class extends LuiBase {

    static properties = {
        label: {
            type: String
        },
        primary: {
            type: Boolean
        }
    };

    // constructor() {
    //     super();
    //     this.setSettings({
    //         languageId: 'en'
    //     });
    // }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-button');
    }
    
    render() {

        //console.log('settings', this.settings);
        ///console.log('labels', this.labels);

        const classList = ['lui-button'];
        if (this.primary) {
            classList.push('lui-button-primary');
        }

        return html`
            <div class="${classList.join(' ')}">
                <slot>${this.label}</slot>
            </div>
        `;
    }

}
