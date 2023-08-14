<template>
    <div class="d-flex align-items-center justify-content-between">
        <div class="row d-flex align-items-center">
            <div class="me-2 col-1">
                <i class="bi" :class="icon"></i>
            </div>
            <div class="col-1">
                <UserImage :name="personnel.cache_nom"></UserImage>
            </div>
            <div class="col-1"></div>
            <div class="col">
                <div class="d-flex justify-content-between align-items-center">{{personnel.cache_nom}}</div>
            </div>
        </div>
        <div class="badge bg-secondary ms-1 col-1" v-if="num">{{num}}</div>
    </div>
</template>


<script>

import UserImage from '../pebble-ui/UserImage.vue';

export default {
    props: {
        personnel: Object,
        icon: {
            type: String,
            default: 'bi-person-fill'
        },
        num: {
            type: Number,
            default: null
        }
    },

    components: {UserImage}
}

</script>