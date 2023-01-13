<template>
    <div v-if="collecte" class="mx-3">
        <div v-if="$route.name != 'collecte' && collecte" class="d-flex align-items-center">
            <router-link to="/collecte" v-slot="{navigate,href}" custom>
                <a :href="href" @click="navigate" class="btn btn-dark me-2"><i class="bi bi-arrow-left"></i></a>
            </router-link>
            <span>#{{collecte.id}} {{collecte?.formulaire?.groupe}}</span>
        </div>
        <span v-else>
            <span>Réalisation des contrôles</span>
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