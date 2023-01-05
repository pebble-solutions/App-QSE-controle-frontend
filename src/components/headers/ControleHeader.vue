<template>
    <div class="mx-3 v_if='collecte'">
        <div v-if="$route.name == 'collecteKN' || 'collecteKnBloc' || 'CollectKnEnd'">
            <router-link to="/collecte" v-slot="{navigate,href}" custom>
                <a :href="href" @click="navigate" class="btn btn-dark me-2"><i class="bi bi-arrow-left"></i></a>
            </router-link>
            <!-- #{{collecte.id}} -->
        </div>
        <span v-else>
            <span>Réalisation des contrôles</span>
            <span>
                retour
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