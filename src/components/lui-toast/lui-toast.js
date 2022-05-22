import { html } from 'lit';

import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base';
import componentStyle from './lui-toast.scss';


const toastList = {
    'left-top': [],
    'center-top': [],
    'right-top': [],
    'left-center': [],
    'center-center': [],
    'right-center': [],
    'left-bottom': [],
    'center-bottom': [],
    'right-bottom': []
};
export default class extends LuiBase {

    static properties = {
        step: {
            state: true,
            type: String
        },
        type: {
            type: String
        },
        autoClose: {
            state: true,
            type: Boolean
        },
        timeout: {
            type: Number
        },
        message: {
            type: String
        },
        position: {
            type: String
        }
    };

    typeMapIcon = {
        info: {
            name: 'information-circle-solid',
            color: '#0dcaf0'
        },
        warning: {
            name: 'exclamation-solid',
            color: '#ffc107'
        },
        error: {
            name: 'exclamation-circle-solid',
            color: '#dc3545'
        },
        success: {
            name: 'check-circle-solid',
            color: '#198754'
        }
    };

    get index() {
        return toastList[this.position]?.indexOf(this);
    }

    constructor() {
        super();
        this.timeout = 3000;
        this.message = '';
        this.type = 'info';
        this.position = 'center-top';
        this.step = 'created';
        this.isShowing = false;
        this.autoClose = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-toast');
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        super.attributeChangedCallback(attr, oldVal, newVal);
        if (attr === 'position') {
            this.position = this.translatePosition(newVal);
        }
    }

    /* eslint-disable complexity */
    async show(message, type, timeout, position) {
        clearTimeout(this.closeTimeout);
        if (message || message === '') {
            this.message = message;
        }
        if (type) {
            this.type = type;
        }
        if (timeout || timeout === 0) {
            this.timeout = timeout;
        }
        if (position) {
            position = this.translatePosition(position);
            if (this.isShowing && this.position !== position) {
                toastList[this.position]?.splice(this.index, 1);
                toastList[position]?.push(this);
            }
            this.position = position;
        }

        if (!this.isShowing) {
            document.body.appendChild(this);
            toastList[this.position]?.push(this);
            await this.updateComplete;
            this.isShowing = true;
        }
        this.$('.lui-toast-message').innerHTML = this.message;
        this.step = 'enter';
        if (this.timeout > 0) {
            this.autoClose = true;
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, this.timeout);
            return;
        }
        this.autoClose = false;
    }
    /* eslint-enable */

    translatePosition(position) {
        let ret = '';
        const lowerPosition = `${position}`.toLowerCase();
        if (lowerPosition.indexOf('left') > -1) {
            ret = 'left-';
        } else if (lowerPosition.indexOf('right') > -1) {
            ret = 'right-';
        } else {
            ret = 'center-';
        }

        if (lowerPosition.indexOf('top') > -1) {
            return `${ret}top`;
        }
        if (lowerPosition.indexOf('bottom') > -1) {
            return `${ret}bottom`;
        }

        return `${ret}center`;
    }

    close() {
        clearTimeout(this.closeTimeout);
        this.step = 'leave';
    }

    animationHandler() {
        if (this.step === 'enter') {
            this.step = 'entered';
            return;
        }
        if (this.step === 'leave') {
            this.step = 'leaved';
            toastList[this.position]?.splice(this.index, 1);
            this.remove();
            this.isShowing = false;
            toastList[this.position]?.forEach((item) => {
                item.requestUpdate();
            });
        }
    }

    updated() {
        super.updated();
        this.height = this.$('.lui-toast').offsetHeight;
    }

    mouseEnterHandler() {
        if (this.autoClose) {
            clearTimeout(this.closeTimeout);
        }
    }

    mouseLeaveHandler() {
        if (this.autoClose) {
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, this.timeout);
        }
    }
    
    /* eslint-disable complexity */
    render() {
        const classList = {
            'lui-toast': true
        };
        classList[`lui-toast-${this.position}`] = true;
        classList[`lui-toast-${this.position}-enter`] = this.step === 'enter';
        classList[`lui-toast-${this.position}-leave`] = this.step === 'leave';
        const style = {
            paddingRight: this.autoClose ? '14px' : '32px',
            display: this.isShowing ? 'flex' : 'none'
        };

        
        let height = 0;
        for (let i = 0; i < this.index; i++) {
            height = height + toastList[this.position][i].height + 10;
        }
        switch (this.position) {
            case 'left-center':
            case 'center-center':
            case 'right-center': {
                style.top = `${height + document.body.clientHeight / 2 - 100}px`;
                break;
            }
            case 'left-bottom':
            case 'center-bottom':
            case 'right-bottom': {
                style.bottom = `${height + 50}px`;
                break;
            }
            case 'left-top':
            case 'right-top':
            default: {
                style.top = `${height + 50}px`;
            }
        }

        let closeIcon = null;
        if (!this.autoClose) {
            closeIcon = html`
                <lui-icon 
                    class="close-icon"
                    name="x"
                    size="16px"
                    color="rgb(0 0 0 / 65%)"
                    @click=${this.close}
                >
                </lui-icon>
            `;
        }

        return html`
            <div
                class="${Util.classMap(classList)}"
                style="${Util.styleMap(style)}"
                @animationend="${this.animationHandler}"
                @mouseenter="${this.mouseEnterHandler}"
                @mouseleave="${this.mouseLeaveHandler}"
            >
                <lui-icon
                    class="icon"
                    name="${this.typeMapIcon[this.type].name}"
                    color="${this.typeMapIcon[this.type].color}"
                    size="24px"
                ></lui-icon>
                <div class="lui-toast-message"></div>
                ${closeIcon}
            </div>
        `;
    }


}
