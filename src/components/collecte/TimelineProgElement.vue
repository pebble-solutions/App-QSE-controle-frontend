<template>
    <router-link :to="'/'+route+'/'+this.collecte.id+'/new'" v-slot="{navigate,href}" custom>
        <a :href="href"  @click="navigate" class="timeline-el link-secondary">
            <div class="timeline-label btn btn-primary">
                <div class="d-flex">
                    <i class="bi bi-plus" ></i>
                    <span class="d-none d-lg-block ms-2">
                        Bouclage?
                    </span>
                </div>
            </div>
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