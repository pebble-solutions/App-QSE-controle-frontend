<template>
    <div class="list-group-item position-relative">
        <div class="d-flex justify-content-between align-items-center">
            <span>
                <span data-dz-name>{{ document.nom }}</span>
                <em class="fw-bold ms-2"><span data-dz-size>{{ document.poids }}</span></em>
            </span>
            <div class="d-flex align-items-center dz-file-aside">
                <span class="dz-file-status ml-2" v-if="pending">
                    <span class="spinner-border spinner-border-sm" role="status"></span>
                </span>

                <div class="btn-group mx-1" v-else>
                    <a class="btn btn-light btn-sm" :href="document.url" target="_blank"><i class="bi bi-folder2-open"></i></a>
                    <button class="btn btn-light btn-sm" @click.prevent="deleteDocument()" v-if="input_md5"><i class="bi bi-trash"></i></button>
                </div>
                <span class="dz-file-status ms-2"><i class="bi bi-check-circle-fill text-success"></i></span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        document: Object,
        input_md5: String
    },

    data() {
        return {
            pending: false
        }
    },

    emits: ['deleted'],

    methods: {
        /**
         * Demande la suppression du document à l'API
         */
        deleteDocument() {
            if (confirm("Confirmez-vous la suppression de ce document ?")) {
                this.pending = true;
    
                this.$app.apiDelete('v2/document/'+this.input_md5+'/'+this.document.id)
                .then(() => {
                    this.$emit('deleted');
                }).catch(this.$app.catchError).finally(() => this.pending = false);
            }
        }
    }
}

</script>