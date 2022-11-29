<template>
    
        <div class="card border-success">
            
            
            <div class="">
                <label for="context" class="form-label">Décrivez ici le contexte général dans lequel se déroule le contrôle</label>
                <textarea class="form-control" id="context" name="context" rows="6"></textarea>
            </div>

            <div class="" v-if="openedElementBlocs.length">
                <router-link :to="'/element/'+openedElement.id+'/bloc/'+openedElementBlocs[0].id" custom v-slot="{ navigate, href }">
                    <a class="btn btn-primary d-block btn-lg"  :href="href" @click="navigate">Démarrer</a>
                </router-link>
            </div>
        </div>
    
</template>

<script>

import {mapState, mapGetters} from 'vuex'

export default {
    computed: {
        ...mapState(['openedElement']),
        ...mapGetters(['openedElementBlocs'])
    }
}
</script>