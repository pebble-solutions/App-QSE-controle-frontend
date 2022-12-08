<template>
    
    <div class="card my-2" v-if="collecte">
        
        <div class="card-body">

            <div class="card-title">
                <label for="context" class="form-label">Décrivez ici le contexte général dans lequel se déroule le contrôle:</label>
                <textarea class="form-control" id="context" name="context" rows="6" placeholder="contexte..."></textarea>
            </div>

            <div class="btn" v-if="collecte.formulaire?.blocs?.length">
                <router-link :to="'/collecte/'+collecte.id+'/bloc/'+collecte.formulaire.blocs[0].id" custom v-slot="{ navigate, href }">
                    <a class="btn btn-outline-primary"  :href="href" @click="navigate">Commencer</a>
                </router-link>
            </div>
        </div>
    </div>

</template>

<script>

import {mapState} from 'vuex'

export default {
computed: {
    ...mapState(['collecte'])
}
}
</script>