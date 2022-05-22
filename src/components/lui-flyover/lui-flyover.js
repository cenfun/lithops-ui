import { html } from 'lit';

//import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base.js';
import componentStyle from './lui-flyover.scss';


export default class extends LuiBase {

    static properties = {
        width: {
            type: String
        },
        position: {
            type: String
        },
        visible: {
            type: Boolean
        }
    };

    constructor() {
        super();
        this.position = 'right';
        this.width = '50%';
        this.animationHandler = () => {
            this.onEnd();
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-flyover', document.head);

        this.classList.add('lui-flyover', `lui-flyover-${this.position}`);

        this.initBodyClass();

        this.onStart(true);
    }

    initBodyClass() {
        if (this.position === 'left') {
            this.bodyClass = '';
            return;
        }
        this.bodyClass = 'lui-flyover-overflow-hidden';
    }

    lockBody(lock) {
        if (!this.bodyClass) {
            return;
        }
        //for body hide scrollbar when animation
        const cl = document.body.classList;
        if (lock) {
            cl.add(this.bodyClass);
        } else {
            cl.remove(this.bodyClass);
        }
    }

    onStart(visible) {
        this.visible = visible;
        if (this.hasStarted) {
            this.onEnd();
        }
        this.lockBody(true);
        this.unbindEvents();
        const cl = this.classList;
        const st = this.style;
        if (visible) {
            cl.add(`lui-slide-in-${this.position}`, 'lui-flyover-show');
            st.width = this.width;
        } else {
            cl.add(`lui-slide-out-${this.position}`);
        }
        this.hasStarted = true;
        this.bindEvents();
    }

    onEnd() {
        this.hasStarted = false;
        this.lockBody(false);
        this.unbindEvents();
        const cl = this.classList;
        const st = this.style;
        if (this.visible) {
            cl.remove(`lui-slide-in-${this.position}`);
        } else {
            cl.remove(`lui-slide-out-${this.position}`, 'lui-flyover-show');
            st.width = '0px';
            this.closeSync();
        }
    }

    bindEvents() {
        this.addEventListener('animationend', this.animationHandler);
    }

    unbindEvents() {
        this.removeEventListener('animationend', this.animationHandler);
    }

    close(sync) {
        if (sync) {
            this.closeSync();
            return;
        }
        this.onStart(false);
    }

    closeSync() {
        this.emit('close');
        this.remove();
    }
    
    closeHandler() {
        this.close();
    }

    renderWidth() {
        const st = this.style;
        st.width = this.width;
    }

    render() {
        this.renderWidth();
        return html`<slot></slot>`;
    }

}
