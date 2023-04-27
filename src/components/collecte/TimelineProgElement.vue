<template>
    <router-link :to="'/'+route+'/'+this.collecte.id+'/new'" v-slot="{navigate,href}" custom>
        <a :href="href"  @click="navigate" class="timeline-el btn btn-light border rounded-pill btn-sm">
            <i class="bi bi-plus" ></i>
            <span class="d-none d-md-inline ms-1">
                Bouclage?
            </span>
        </a>
    </router-link>
</template>

<script>

import { RouterLink } from 'vue-router';

export default {
    props: {
        collecte: Object,
        route: {
            type: String,
            default: 'consultation'
        },
    },

    components: { RouterLink }
}

</script>