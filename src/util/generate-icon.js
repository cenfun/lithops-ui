import { html } from 'lit';

const icons = {

    x: () => {
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" pointer-events="none" width="100%" height="100%" viewBox="0 0 24 24">
                <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor">
                    <path d="M0 0h24v24H0z" stroke="none"/>
                    <path d="M18 6 6 18M6 6l12 12"/>
                </g>
            </svg>
        `;
    }

};

export default (name) => {
    const handler = icons[name];
    if (handler) {
        return handler();
    }
};

