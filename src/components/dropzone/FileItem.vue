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

                <a class="btn btn-light btn-sm mx-1" :href="document.url" target="_blank"><i class="bi bi-folder2-open"></i></a>
                <span class="dz-file-status ml-2"><i class="bi bi-check-circle-fill text-success"></i></span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        document: Object
    },

    data() {
        return {
            pending: false
        }
    }
}

</script>