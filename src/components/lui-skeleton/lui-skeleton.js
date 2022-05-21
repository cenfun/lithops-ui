import { html, styleMap } from '../../vendor/lit.js';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';

import componentStyle from './lui-skeleton.scss';


const SKELETON_TYPES = ['avatar-text', 'text-avatar', 'avatar', 'image', 'table', 'text'];
const SKELETON_ANIMATIONS = ['wave', 'fade', 'none'];

const MAX_ROWS = 1000;
const MAX_COLS = 10;
const MIN_ROWS = 1;
const MIN_COLS = 1;

const TYPE_MAP_METHOD_NAME = {
    text: 'getText',
    avatar: 'getAvatar',
    image: 'getImage',
    table: 'getTable',
    'avatar-text': 'getAvatarText',
    'text-avatar': 'getTextAvatar'
};
export default class extends LuiBase {

    static properties = {
        type: {
            type: String
        },
        animation: {
            type: String
        },
        width: {
            type: String
        },
        height: {
            type: String
        },
        rows: {
            type: Number
        },
        cols: {
            type: Number
        },
        avatarRadius: {
            type: String,
            attribute: 'avatar-radius'
        },
        textAlign: {
            type: String,
            attribute: 'text-align'
        },
        space: {
            type: String
        },
        columnWidths: {
            attribute: 'column-widths',
            type: String
        },
        columnAligns: {
            attribute: 'column-aligns',
            type: String
        }
    };

    constructor() {
        super();
        this.type = 'text';
        this.animation = 'wave';
        this.avatarRadius = '64px';
        this.columnWidths = '';
        this.columnAligns = '';
        this.space = '20px';
        this.rows = 4;
        this.cols = 4;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-skeleton');
    }

    formatType() {
        this.type = `${this.type}`.toLowerCase();
        if (SKELETON_TYPES.includes(this.type)) {
            return;
        }
        for (const type of SKELETON_TYPES) {
            if (this.type.includes(type)) {
                this.type = type;
                return;
            }
        }
        this.type = 'text';
    }

    formatAnimation() {
        const animation = `${this.animation}`.toLowerCase();
        this.animation = SKELETON_ANIMATIONS.includes(animation) ? animation : 'none';
    }

    formatColsAndRows() {
        this.rows = this.rows || MIN_ROWS;
        this.cols = this.cols || MIN_COLS;
        this.rows = Math.max(MIN_ROWS, Math.min(MAX_ROWS, this.rows));
        this.cols = Math.max(MIN_COLS, Math.min(MAX_COLS, this.cols));
    }

    getImage() {
        const styleList = {
            width: this.width,
            height: this.height
        };
        return html`
            <div class="skeleton-image skeleton-body" style="${styleMap(styleList)}"></div>
        `;
    }

    getAvatar() {
        const styleList = {
            width: this.avatarRadius,
            height: this.avatarRadius
        };
        return html`
            <div class="skeleton-avatar skeleton-body" style="${styleMap(styleList)}"></div>
        `;
    }

    getText(textAlign) {
        const lines = [];
        const styleList = {
            width: this.width,
            'text-align': this.textAlign || textAlign
        };
        for (let i = 0; i < this.rows; i++) {
            lines.push(html`<p class="skeleton-body"></p>`);
        }
        return html`<div class="skeleton-text" style="${styleMap(styleList)}">${lines}</div>`;
    }

    getTable() {
        const styleList = {
            width: this.width,
            'text-align': this.textAlign
        };
        const columnWidths = this.columnWidths.split(',');
        const columnAligns = this.columnAligns.split(',');
        const rows = [];
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(
                    html`
                        <td style="width: ${columnWidths[j]}; text-align: ${columnAligns[j]}">
                            <div class="skeleton-body"></div>
                        </td>
                    `
                );
            }
            rows.push(html`<tr>${row}</tr>`);
        }
        return html`
            <div class="skeleton-table" style="${styleMap(styleList)}">
                <table>
                    ${rows}
                </table>
            </div>
        `;
    }

    getAvatarText() {
        const styleList = {
            width: this.width
        };
        return html`
            <div class="skeleton-avatar-text" style="${styleMap(styleList)}">
                ${this.getAvatar()}
                <div style="width: ${this.space};" class="space"></div>
                ${this.getText()}
            </div>
        `;
    }

    getTextAvatar() {
        const styleList = {
            width: this.width
        };
        return html`
            <div class="skeleton-avatar-text" style="${styleMap(styleList)}">
                ${this.getText('right')}
                <div style="width: ${this.space};"></div>
                ${this.getAvatar()}
            </div>
        `;
    }

    render() {
        
        this.formatType();
        this.formatAnimation();
        this.formatColsAndRows();

       
        const methodName = TYPE_MAP_METHOD_NAME[this.type];
        const $child = this[methodName]();

        return html`
            <div class="lui-skeleton animation-${this.animation}">
                ${$child}
            </div>
        `;
    }


}
