<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
            <div class="me-2">
                <i class="bi me-2" :class="icon"></i>
            </div>
            <div class="justify-content-between align-items-center"  >
                <div class="d-flex justify-content-between align-items-center">{{formulaire.groupe}}</div>
            </div>
        </div>
        <div class="badge bg-secondary" v-if="num">{{num}}</div>
    </div>
</template>


<script>

export default {
    props: {
        formulaire: Object,
        icon: {
            type: String,
            default: 'bi-file-earmark'
        },
        num: {
            type: Number,
            default: null
        }
    }
}

</script>