<template>
    
    <div class="mx-3">

        <div v-if="$route.name != 'Programmation' && formulaire">
            <router-link to="/programmation" v-slot="{navigate,href}" custom>
                <a :href="href" @click="navigate" class="btn btn-dark me-2"><i class="bi bi-arrow-left"></i></a>
            </router-link>
            <span>{{formulaire.groupe}}</span>
        </div>
        <span v-else>Contrôles programmés</span>
    </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['formulaire'])
    }
};

</script>