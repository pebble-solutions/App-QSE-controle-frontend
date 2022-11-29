<template>    
    <div v-if="openedElement">
		<div class="card sticky-top">
			<div class="card-header justify-content-between">
				
                <div class="d-flex justify-content-between align-items-center">
                    <h1>{{openedElement.groupe}}</h1>

                    <div class="dropdown" v-if="$route.params.bloc">
                        <button class="btn btn-secondary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Changer de section
                        </button>
                        <ul class="dropdown-menu">
                            <li v-for="blocItem in openedElementBlocs" :key="blocItem.id">
                                <router-link :to="'/element/'+openedElement.id+'/bloc/'+blocItem.id" custom v-slot="{ navigate, href }">
                                    <a class="dropdown-item d-flex justify-content-between" :href="href" @click="navigate">
                                        
                                        {{blocItem.bloc}}
                                        <i class="bi bi-check2" v-if="$route.params.bloc == blocItem.id"></i>
                                    </a>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--
                <div class="row">
                    <div class="col">KN n° 21-001</div>
                    <div class="col">COntrôleur</div>
                    <div class="col">type KN</div>
                    <div class="col">Rachid BARBACH</div>
                    <div class="col">Chantier</div>
                </div>
                -->
			</div>
		</div>

        <router-view></router-view>
    </div>

</template>
<style lang="scss" scoped>

// .accordion-button{
//     padding: 0;
// }
// .btn{
//     font-size: 0.9rem;
// }

</style>
<script>

import {mapState, mapGetters} from 'vuex'

export default {

    computed: {
        ...mapState(['openedElement']),
        ...mapGetters(['openedElementBlocs', 'opendeElementLignes'])
    },

    methods: {
        loadGroupBlocs() {
            this.$app.apiGet('/informationBloc/GET/list', {
                information__groupe_id: this.openedElement.id
            })
            .then((data) => {
                this.$store.dispatch('refreshBlocs', data);
            })
            .catch(this.$app.catchError);

        },
        loadGroupLignes() {
            this.$app.apiGet('/informationLigne/GET/list', {
                information__groupe_id: this.openedElement.id
            })
            .then((data) => {
                this.$store.dispatch('refreshLignes', data);
            })
            .catch(this.$app.catchError);

        }

    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        this.$store.dispatch('load', to.params.id);
        this.loadGroupBlocs();
        this.loadGroupLignes();

    },


    /**
     * Lorsqu'on quite la route active, l'élément ouvert est vidé.
     */
    beforeRouteLeave(from, to, next) {
        this.$store.dispatch('unload');
        next();
    },


    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    beforeMount() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        this.$store.dispatch('load', this.$route.params.id);
        this.loadGroupBlocs();
        this.loadGroupLignes();

    }
}

</script>
