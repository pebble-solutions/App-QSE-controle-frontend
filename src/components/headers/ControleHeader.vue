<template>
    <div class="mx-3">
        <div v-if="$route.name == 'collecte'">
            <span>Réalisation des contrôles</span>
        </div>
        <span v-else>
            <router-link to="/collecte" v-slot="{navigate,href}" custom>
                <a :href="href" @click="navigate" class="btn btn-dark me-2"><i class="bi bi-arrow-left"></i></a>
            </router-link>
            <span>
                #{{ collecte.id }}
            </span>
        </span>
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['collecte'])
    }
};

</script>