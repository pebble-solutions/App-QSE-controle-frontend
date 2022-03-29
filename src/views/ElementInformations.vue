<template>
    <AppModal id="elementProperties" title="Informations">
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(value, key) in openedElement" :key="key">
                <strong class="d-block">{{key}}</strong>
                <div>{{value}}</div>
            </li>
        </ul>
    </AppModal>
</template>

<script>

import AppModal from '@/components/pebble-ui/AppModal.vue'

import {mapState} from 'vuex'

export default {
    computed: {
        ...mapState(['openedElement'])
    },

    components: {
        AppModal
    }
}
</script>