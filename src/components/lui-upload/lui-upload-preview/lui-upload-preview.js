import { html } from 'lit';

import Util from '../../../util/util.js';

import LuiBase from '../../../base/lui-base';

import componentStyle from './lui-upload-preview.scss';

const PREVIEW_SIZE = 200;
const ARROW_SIZE = 5;

export default class extends LuiBase {
    static private = true;

    static properties = {
        url: {
            type: String
        },
        parentRect: {
            type: Object
        }
    };

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-upload-preview');
    }

    render() {
        const transTop = this.parentRect.top > PREVIEW_SIZE + ARROW_SIZE;

        const imageStye = {
            left: `${this.parentRect.left}px`,
            width: `${PREVIEW_SIZE}px`,
            height: `${PREVIEW_SIZE}px`
        };

        if (transTop) {
            imageStye.top = `${this.parentRect.top - PREVIEW_SIZE - ARROW_SIZE}px`;
        } else {
            imageStye.top = `${this.parentRect.top + this.parentRect.height + ARROW_SIZE}px`;
        }

        return html`
            <div class="lui-upload-preview" style="${Util.styleMap(imageStye)}">
                <img class="image" src="${this.url}" />
                <i class="${transTop ? 'icon-bottom' : 'icon-top'}"></i>
            </div>
        `;
    }
}
