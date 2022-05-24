import { html } from 'lit';

import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-progress.scss';


export default class extends LuiBase {

    static properties = {
        percentage: {
            type: Number
        },
        width: {
            type: String
        },
        height: {
            type: String
        },
        radius: {
            type: String
        },
        color: {
            type: String
        },
        borderColor: {
            attribute: 'border-color',
            type: String
        }
    };

    constructor() {
        super();
        this.percentage = 0;
        this.width = '100px';
        this.height = '15px';
        this.radius = '3px';
        this.color = '#ccc';
        this.borderColor = '#aaa';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-progress');
    }
    
    render() {
        const stm = {
            'width': this.width,
            'height': this.height,
            'border-radius': this.radius,
            'border-color': this.borderColor,
            'background': `linear-gradient(${this.color} 0 0) 0/${this.percentage}% no-repeat`
        };
        return html`<div class="lui-progress" style="${Util.styleMap(stm)}"></div>`;
    }

}
