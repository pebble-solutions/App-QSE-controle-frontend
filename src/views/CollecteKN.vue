<template>    
    <div v-if="collecte">
		<div class="card sticky-top">
			<div class="card-header justify-content-between">
				
                <div class="d-flex justify-content-between align-items-center">
                    <h1 class="card-title">{{collecte.groupe}}</h1>
                    
                    <div class="dropdown" v-if="$route.params.bloc">
                        <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-list"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li v-for="blocItem in collecte.formulaire.blocs" :key="blocItem.id">
                                <router-link :to="'/collecte/'+collecte.id+'/bloc/'+blocItem.id" custom v-slot="{ navigate, href }">
                                    <a class="dropdown-item d-flex justify-content-between" :href="href" @click="navigate">
                                        {{blocItem.bloc}}
                                        <i class="bi bi-check2" v-if="$route.params.bloc == blocItem.id"></i>
                                    </a>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <div>

                        <button class="btn btn-outline-danger" @click="sendResp()">Valider</button>
                    </div>
                </div>
                
                <div class="card">
                    <form action="">
                        

                    </form>
                </div>
                <div class="row">
                    <div class="col">KN n° 21-001</div>
                    <div class="col">Contrôleur</div>
                    <div class="col">type KN</div>
                    <div class="col">Rachid BARBACH</div>
                    <div class="col">Chantier</div>
                </div>
            </div>
            
            <div v-if="!$route.params.bloc">
                <intro></intro>
            </div>
		</div>

        <router-view></router-view>
    </div>
    <div v-else>Pas collecte</div>

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

import {mapState, mapActions} from 'vuex';
import Intro from '../components/Intro.vue';

export default {
    data() {
        return {
            pending: {
                collecte:true
            }
        }
    },

    components: { Intro },

    computed: {
        ...mapState(['responses', 'collecte'])
    },

    methods: {
        ...mapActions(["setCollecte"]),

        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
        loadCollecte(id) {
            this.pending.collecte = true;
            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private'
            })
            .then(data => this.setCollecte(data)).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },
        
        sendResp() {
            console.log(this.responses, 'reponses envoyées');
            console.log(typeof this.responses,'type')
            this.$app.apiPost('data/POST/collecte', {
                reponses: JSON.stringify(this.responses),
                formulaire: this.collecte.id,
                environnement:'private',
            })
            .then((data) => {
                console.log('data', data.id);
            })
            .catch(this.$app.catchError);
        }
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        this.loadCollecte(to.params.id);
    },


    /**
     * Lorsqu'on quite la route active, l'élément ouvert est vidé.
     */
    beforeRouteLeave(from, to, next) {
        this.loadCollecte(null);
        next();
    },


    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    beforeMount() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        this.loadCollecte(this.$route.params.id);
    }
}

</script>
