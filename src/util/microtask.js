export default class {

    constructor(callback, args, target) {
        this.callback = callback;
        this.args = args;
        this.target = target;
        if (typeof window.queueMicrotask === 'function') {
            window.queueMicrotask(() => {
                this.callbackHandler();
            });

        } else {
            Promise.resolve().then(() => {
                this.callbackHandler();
            });
        }
    }

    destroy() {
        this.callback = null;
        this.args = null;
        this.target = null;
    }

    callbackHandler() {
        if (this.canceled) {
            this.destroy();
            return;
        }
        if (typeof this.callback === 'function') {
            this.callback.apply(this.target, this.args);
        }
    }

    cancel() {
        this.canceled = true;
        this.destroy();
    }

}
