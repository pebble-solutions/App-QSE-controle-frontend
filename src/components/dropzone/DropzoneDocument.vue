<template>

    <div>
        <div class="list-group mb-2 mt-3">
            <button :id="dropzoneId" class="list-group-item list-group-item-action list-group-item-light d-flex align-items-center justify-content-between dropzone-area">
                Cliquez-ici ou déposer des fichiers ici.
                <i class="bi bi-cloud-arrow-up"></i>
            </button>
        </div>
        <div :id="dzFilesId" class="list-group my-2">
            <file-item v-for="document in initialDocuments" :document="document" :key="document.id" :input_md5="params.input_md5" @deleted="removeDocument(document)" />
        </div>
    </div>

</template>

<style lang="scss" scoped>
.dropzone-area {
    border-style: dashed !important;
    border-width: 2px !important;
}
</style>

<script>

import Dropzone from 'dropzone';
import FileItem from './FileItem.vue';

export default {
    components: { FileItem },

    props: {
        dropzoneId: String,
        params: Object,
        url: String,
        documents: Array
    },

    data() {
        return {
            initialDocuments: []
        }
    },

    emits: ['upload-success', 'upload-error', 'removed-document'],

    computed: {
        /**
         * Retourne l'ID unique de la liste des fichiers déposés.
         * @return {string}
         */
        dzFilesId() {
            return this.dropzoneId+'-files';
        }
    },

    methods: {
        /**
         * completeUpload()
         * This function manage end of upload display, event and data storage on the client
         * browser.
         * If upload is positive (OK), so green check is added to the preview template
         * Otherwise, red cross is added and message is displayed.
         * @param {string} status           'OK' ou 'error'
         * @param {object} file 
         * @param {object} response 
         */
        completeUpload(status, file, response) {
            let el = file.previewElement;
            let progressEl = el.querySelector('.dz-progress-bar');
            let statusEl = el.querySelector('.dz-file-status');
            progressEl.remove();

            if (status === 'OK') {
                el.remove();
                this.initialDocuments.push(response.data);
                this.$emit('upload-success', response.data);
            }
            else {
                statusEl.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
                statusEl.classList.add('text-danger');

                let er = document.createElement('div');
                er.classList.add('text-danger');
                er.appendChild(document.createTextNode(response.message));

                el.appendChild(er);
                el.classList.add('list-group-item-danger');

                this.$emit('upload-error', response);
            }
        },

        /**
         * Initialise la boite de dépôt.
         */
        initDz() {
            let dz = new Dropzone("#"+this.dropzoneId, {
                url: this.url,
                autoProcessQueue: false,
                previewsContainer: '#'+this.dzFilesId,
                previewTemplate: `
                <div class="list-group-item position-relative">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>
                            <span data-dz-name></span>
                            <em><span data-dz-size></span></em>
                        </span>
                        <div class="d-flex align-items-center dz-file-aside">
                            <span class="dz-file-status ml-2">
                                <span class="spinner-border spinner-border-sm" role="status"></span>
                            </span>
                        </div>
                    </div>
                    <div class="position-absolute dz-progress-bar" style="z-index:5; top:0px;left:0px;right:0px;bottom:0px;">
                        <span data-dz-uploadprogress class="bg-primary d-block bg-opacity-25" style="height:100%;"></span>
                    </div>
                </div>`
            });

            dz.on("addedfile", () => {
                this.$app.api.auth().then(() => {
                    return true;
                }).catch(error => {
                    return this.$app.api.tryAgainOrThrow(error)
                }).then(() => {
                    dz.options.headers = {
                        "Structure": this.$app.api.structure.id,
                        "Authorization": `Bearer ${this.$app.api.local_user.token.jwt}`
                    };
                    dz.options.params = this.params;
                    dz.processQueue();
                }).catch(this.$app.catchError);

            });

            dz.on("error", (file, error) => {
                this.completeUpload('error', file, error);
            });

            dz.on('success', (file) => {
                this.completeUpload('OK', file, JSON.parse(file.xhr.response));
            });

            this.initialDocuments = [];
            this.documents.forEach(document => {
                this.initialDocuments.push(document);
            });
        },

        /**
         * Retire un document de la liste
         * @param {object} document Le document à supprimer
         */
        removeDocument(document) {
            const index = this.initialDocuments.findIndex(e => e.id == document.id);
            if (index !== -1) {
                this.initialDocuments.splice(index, 1);
            }
            this.$emit('removed-document', document);
        }
    },

    mounted() {
        this.initDz();
    }
}

</script>