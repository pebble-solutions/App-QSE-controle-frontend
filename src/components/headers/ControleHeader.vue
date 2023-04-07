<template>
    <div v-if="collecte" class="mx-3">
        <div v-if="$route.name != 'collecte' && collecte" class="d-flex align-items-center">
            <router-link to="/collecte" v-slot="{navigate,href}" custom>
                <a :href="href" @click="navigate" class="btn btn-dark me-2"><i class="bi bi-arrow-left"></i></a>
            </router-link>
            <span>
                <strong class="me-1">#{{collecte.id}}</strong>
                <span class="fw-light me-1">{{collecte?.formulaire?.groupe}}</span>
                <strong>du {{ formatedDate }}</strong>
            </span>
        </div>
        <span v-else>
            <span>Réalisation des contrôles</span>
        </span>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { dateFormat } from '../../js/collecte';

export default {
    computed: {
        ...mapState(['collecte']),

        /**
         * Retourne la date formatée de la collecte
         * 
         * @return {string}
         */
        formatedDate() {
            return dateFormat(this.collecte.date);
        }
    }
};

</script>