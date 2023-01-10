<template>
    <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-list"></i>
            <!-- Etapes -->
        </button>

        <ul class="dropdown-menu">
            <li v-for="blocItem in blocs" :key="blocItem.id">
                <div class="dropdown-item d-flex justify-content-between" type="button" @click="saveResp(blocItem)">
                    {{blocItem.bloc}}
                    <i class="bi bi-check2" v-if="bloc_id == blocItem.id"></i>
                </div>
            </li>

            <li>
                <div class="dropdown-item d-flex justify-content-between" @click="saveResp('end')" type="button">
                    Évaluation générale
                    <i class="bi bi-check2" v-if="!bloc_id"></i>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        bloc_id: String
    },

    computed: {
        ...mapState(['collecte']),

        blocs() {
            return this.collecte.formulaire.blocs
        }
    },

    methods: {
        saveResp(options) {
            this.$emit('update-resp');

            if ('end' === options) {
                this.$router.push({name: 'CollectKnEnd', params:{id: this.collecte.id}})
            } else {
                this.$router.push('/collecte/'+this.collecte.id+'/bloc/'+options.id);
            }
            
        }
    }
}
</script>