<template>
    <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-list"></i>
            <!-- Etapes -->
        </button>

        <ul class="dropdown-menu">
            <li v-for="blocItem in blocs" :key="blocItem.id">
                <button class="dropdown-item d-flex justify-content-between" type="button" @click.prevent="saveResp(blocItem)">
                    {{blocItem.bloc}}
                    <i class="bi bi-check2" v-if="currentBlocId == blocItem.id"></i>
                </button>
            </li>

            <li>
                <button class="dropdown-item d-flex justify-content-between" @click.prevent="saveResp('end')" type="button">
                    Évaluation générale
                    <i class="bi bi-check2" v-if="!currentBlocId"></i>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        currentBlocId: String
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