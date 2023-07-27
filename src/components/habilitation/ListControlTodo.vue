<template>
    <template v-if="isReady">
        <last-control-filter-form />

        <template v-for="habilitationPersonnel in habilitationsPersonnels" :key="habilitationPersonnel.id">
            <app-menu-item v-if="habilitationPersonnel.last_control_result"
                :href="'/habilitationPersonnel/' + habilitationPersonnel.id">
                <control-todo-habilitation-item :habilitationPersonnel="habilitationPersonnel" />
            </app-menu-item>
        </template>
        <div class="alert alert-light mx-1 my-2" v-if="noResults">
            <i class="bi bi-file-x"></i> Aucun résultat, tentez d'étendre votre recherche
        </div>

        <div class="d-grid my-2" v-if="pending.habilitationsPersonnels || isMoreAvailable">
            <button class="btn btn-outline-secondary" :disabled="pending.habilitationsPersonnels"
                @click.prevent="loadMore()">
                <span v-if="pending.habilitationsPersonnels"><span class="spinner-border spinner-border-sm"></span>
                    Chargement...</span>
                <span v-else>Charger +</span>
            </button>
        </div>
    </template>
</template>

<script>
import { mapState } from 'vuex';
import AppMenuItem from '../pebble-ui/AppMenuItem.vue';
import ControlTodoHabilitationItem from './ControlTodoHabilitationItem.vue';
import LastControlFilterForm from "./LastControlFilterForm.vue";


export default {
    data() {
        return {
            collection: null,
            noMoreAvailable: false
        }
    },

    computed: {
        ...mapState(['habilitationsPersonnels', 'pending']),

        /**
         * Contrôle si il peut exister plus de résultats sur le serveurs que
         * de données stockées dans résults.
         *
         * On concidère qu'il peut exister des résultats supplémentaires sur le serveur
         * à partir du moment ou il y a plus de 50 items dans result et que result / 50 est
         * égal à 1.
         *
         * @return {bool}
         */
        isMoreAvailable() {
            let ln = this.habilitationsPersonnels.length;
            return (ln && ln % this.collection.requestPayload.limit === 0 && !this.noMoreAvailable);
        },

        /**
         * Retourne true lorsque la vue est prête à être affichée
         * 
         * @return {bool}
         */
        isReady() {
            return this.collection ? true : false;
        },

        /**
         * Retourne true lorsqu'il n'y a pas de résultats
         * 
         * @return {boolean}
         */
        noResults() {
            return !this.pending.habilitationsPersonnels && !this.habilitationsPersonnels.length ? true : false;
        }
    },

    methods: {
        /**
         * Charger plus de resultats
         */
        async loadMore() {
            this.collection.requestPayload.start = this.collection.requestPayload.start ?? this.collection.requestPayload.start + this.collection.requestPayload.limit;
            try {
                const data = await this.collection.load();
                if (!data.length) this.noMoreAvailable = true;
            }
            catch (e) {
                this.$app.catchError(e);
            }
        }
    },

    mounted() {
        this.collection = this.$assets.getCollection("habilitationsPersonnels");
    },

    components: { LastControlFilterForm, AppMenuItem, ControlTodoHabilitationItem }
}

</script>