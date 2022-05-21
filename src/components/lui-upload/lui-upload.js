import { html, classMap } from '../../vendor/lit.js';

import Util from '../../util/util.js';

import LuiBase from '../../base/lui-base';

import componentStyle from './lui-upload.scss';


export default class extends LuiBase {

    static properties = {
        multiple: {
            type: Boolean
        },
        accept: {
            type: String
        },
        maxSize: {
            attribute: 'max-size',
            type: Number
        },
        maxAmount: {
            attribute: 'max-amount',
            type: Number
        },
        fileDroppable: {
            attribute: 'file-droppable',
            type: Boolean
        },
        content: {
            type: String
        },
        selectedFiles: {
            type: Array,
            state: true
        },
        hasSlot: {
            type: Boolean,
            state: true
        }
    };

    constructor() {
        super();
        this.accept = '*';
        this.selectedFiles = [];
        this.maxSize = -1;
        this.maxAmount = -1;
        this.content = '';
        this.fileDroppable = false;
        this.hasSlot = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addStyle(componentStyle, 'lui-upload');
    }

    setSelectedFiles(files) {
        this.selectedFiles = files;
    }

    uploadBeginHandler() {
        if (this.disabled) {
            return;
        }
        this.$('.lui-upload-input').click();
    }

    fileSelectHandler(e) {
        let files = Array.from(e.target.files);

        if (this.maxSize >= 0) {
            const tempList = [];
            files = files.filter((file) => {
                if (file.size / 1024 / 1024 < this.maxSize) {
                    return true;
                }
                tempList.push(file);
                return false;
            });
            if (tempList.length) {
                this.emit('warning', {
                    type: 'size',
                    maxSize: this.maxSize,
                    files: tempList
                });
            }
        }

        if (this.multiple) {
            this.selectedFiles.push(... files);
   
            if (this.maxAmount >= 0 && this.maxAmount < this.selectedFiles.length) {
                this.emit('warning', {
                    type: 'amount',
                    maxAmount: this.maxAmount,
                    files: this.selectedFiles.slice(this.maxAmount)
                });
                this.selectedFiles.length = this.maxAmount;
            }
        } else {
            this.selectedFiles = [files[0]];
        }
        this.requestUpdate();
        e.target.value = '';
        this.emit('change', [... this.selectedFiles]);
    }

    deleteFileHandler(e) {
        if (this.disabled) {
            return;
        }
        const index = e.target.fileIndex;
        this.selectedFiles.splice(index, 1);
        this.requestUpdate();
        this.closeImagePreview();
        this.emit('change', [... this.selectedFiles]);
    }

    showImagePreview(e) {
        const index = e.target.fileIndex;
        const file = this.selectedFiles[index];
        if (file?.type?.indexOf('image') > -1) {
            const url = URL.createObjectURL(file);
            const $preview = document.createElement('lui-upload-preview');
            $preview.url = url;
            $preview.parentRect = e.target.getBoundingClientRect();
            this.$preview = $preview;
            document.body.appendChild(this.$preview);
        }
    }

    closeImagePreview() {
        if (this.$preview) {
            this.$preview.remove();
        }
    }

    slotChangeHandler(e) {
        if (e.target.assignedNodes().length > 0) {
            this.hasSlot = true;
            return;
        }
        this.hasSlot = false;
    }

    dropHandler(e) {
        e.preventDefault();
        if (this.disabled) {
            return;
        }
        const files = e.dataTransfer.files;
        this.fileSelectHandler({
            target: {
                files
            }
        });
    }

    dragoverHandler(e) {
        e.preventDefault();
    }

    render() {
        const classList = {
            'lui-upload': true,
            'lui-upload-disabled': this.disabled,
            'lui-upload-multiple': this.multiple
        };

        let uploadButton;
        if (this.fileDroppable) {
            uploadButton = html`
                <div
                    class="lui-upload-drop"
                    @click="${this.uploadBeginHandler}"
                    @dragover="${this.dragoverHandler}"
                    @drop="${this.dropHandler}"
                >
                    <div class="icon"></div>
                    <p class="text" style="display: ${this.hasSlot || this.content ? 'block' : 'none'};">
                        <slot @slotchange=${this.slotChangeHandler}>${this.content}</slot>
                    </p>
                </div>
            `;
        } else {
            uploadButton = html`
                <div class="lui-upload-button" @click="${this.uploadBeginHandler}">
                    <div class="icon"></div>
                    <span class="text" style="display: ${this.hasSlot || this.content ? 'block' : 'none'};">
                        <slot @slotchange=${this.slotChangeHandler}>${this.content}</slot>
                    </span>
                </div>
            `;
        }

        const filePreview = this.selectedFiles.map((file, index) => {
            let size = '';
            if (Util.isNum(file.size)) {
                size = `${Util.BF(file.size, 2)}`;
            }

            return html`
                <div
                    class="file"
                    .fileIndex="${index}"
                    @mouseenter=${this.showImagePreview}
                    @mouseleave="${this.closeImagePreview}"
                >
                    <lui-icon class="file-icon" name="paper-clip-outlined" size="14px"></lui-icon>
                    <p class="file-name">${file.name}</p>
                    <p class="file-size">${size}</p>
                    <lui-icon
                        class="delete-icon"
                        name="x"
                        size="14px"
                        color="currentColor"
                        .fileIndex="${index}"
                        @click="${this.deleteFileHandler}"
                    ></lui-icon>
                </div>
            `;
        });

        return html`
            <div class="${classMap(classList)}">
                <input
                    class="lui-upload-input"
                    type="file"
                    accept="${this.accept}"
                    .multiple="${this.multiple}"
                    @change="${this.fileSelectHandler}"
                />
                ${uploadButton}
                <div class="lui-upload-preview">
                    ${filePreview}
                </div>
            </div>
        `;
    }

}
