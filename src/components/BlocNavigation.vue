<template>
    <div class="btn-group">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-list me-2"></i>contrôle
        </button>

        <ul class="dropdown-menu">
            <li v-for="blocItem in blocs" :key="blocItem.id">
                <button class="dropdown-item d-flex justify-content-between" type="button" @click.prevent="navigate(blocItem)">
                    {{blocItem.bloc}}
                    <i class="bi bi-check2 ms-1" v-if="currentBlocId == blocItem.id"></i>
                </button>
            </li>

            <li>
                <button class="dropdown-item d-flex justify-content-between" @click.prevent="navigate('end')" type="button">
                    Bilan
                    <i class="bi bi-check2 ms-1" v-if="!currentBlocId"></i>
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
        navigate(options) {
            if ('end' === options) {
                this.$router.push({name: 'CollectKnEnd', params:{id: this.collecte.id}})
            } else {
                this.$router.push('/collecte/'+this.collecte.id+'/bloc/'+options.id);
            }
        }
    }
}
</script>