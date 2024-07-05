<template>
    
    <div class="d-flex align-items-center justify-content-between" v-if="num">
        <div class="d-flex align-items-center">
            <div class="me-2">
                <i class="bi me-2" :class="icon"></i>
            </div>
            <div class="justify-content-between align-items-center"  >
                <div class="d-flex justify-content-between align-items-center">#{{ projet.id }} : {{projet.intitule}}</div>
            </div>
        </div>
        <div class="badge bg-secondary ms-1" v-if="num">{{num}}</div>
    </div>
</template>


<script>

export default {
    props: {
        projet: Object,
        icon: {
            type: String,
            default: 'bi bi-boxes me-2'
        },
        num: {
            type: Number,
            default: null
        }
    }
}

</script>