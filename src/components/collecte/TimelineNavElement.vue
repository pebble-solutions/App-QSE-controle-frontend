<template>
    <router-link :to="'/'+route+'/'+collecte.id" v-slot="{navigate,href}" custom>
        <a :href="href"  @click="navigate" class="timeline-el link-secondary">
            <div class="timeline-label">
                <CollecteBadge :result="collecte.result_var" /><br>
                <span>
                    <i class="bi bi-arrow-left" v-if="direction == 'previous'"></i>
                    <span class="fw-light ms-1">#{{collecte.id}}</span>
                    <i class="bi bi-arrow-right" v-if="direction == 'following'"></i>
                </span>
            </div>
        </a>
    </router-link>
</template>

<script>

import { RouterLink } from 'vue-router';
import CollecteBadge from './CollecteBadge.vue';

export default {
    props: {
        collecte: Object,
        route: {
            type: String,
            default: 'consultation'
        },
        direction: String
    },

    components: { RouterLink, CollecteBadge }
}

</script>