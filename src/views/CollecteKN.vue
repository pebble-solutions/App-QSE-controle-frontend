<template>
    <div class="container py-3">
        <div class="card"  v-if="collecte">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="">
                        Kn n° {{collecte.id}}
                    </div>
    
                    <div class="">
                        <i class="bi bi-person-badge-fill"></i>
                        {{agent}}
                    </div>
    
                    <div class="">
                        <span class="badge text-bg-secondary">{{typeKn}}</span>
                    </div>
    
                    <div class="">
                        <i class="bi bi-person-fill-check"></i>
                        {{controleur}}
                    </div>
    
                    <div class="">
                        <i class="bi bi-boxes"></i>
                        {{projet}}
                    </div>
    
                    <div class="dropdown" v-if="$route.params.bloc">
                        <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <!-- <i class="bi bi-list"></i> -->
                            Questionnaire
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
                </div>
            </div>
    
            <div class="alert alert-success my-2" v-if="collecte.done == 'OUI'">
                <i class="bi bi-check-circle"></i> Cette collecte est terminée et non modifiable
            </div> 
    
            <template v-else>
                <div v-if="(!$route.params.bloc && $route.name != 'CollectKnEnd')">
                    <intro></intro>
                </div>
            </template>
    
    
            <router-view></router-view>
        </div>
    </div>
</template>

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
        ...mapState(['responses', 'collecte', 'listActifs', 'formulaires', 'projetsActif']),

        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @return {string} // deja utilise dans App.vue 
		 */
        agent() {
            let controleurName = this.listActifs.find(personnel => personnel.id == this.collecte.cible__structure__personnel_id);

            if (controleurName) {
                return controleurName.cache_nom;
            } else {
                return 'Opérateur non renseigné'
            }
        },

        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @return {string} // deja utilise dans App.vue 
		 */
        typeKn() {
			let groupInformation = this.formulaires.find(e => e.id == this.collecte.information__groupe_id);

			if (groupInformation) {
				return groupInformation.groupe;
			} else { 
				return 'Type KN non renseigné';
			}
        },

        controleur() {
            let controleurName = this.listActifs.find(personnel => personnel.id == this.collecte.enqueteur__structure__personnel_id);

            if (controleurName) {
                return controleurName.cache_nom;
            } else {
                return 'Contrôleur non renseigné'
            }
        },

        /**
		 * Récupère le nom du projet de la collecte
		 * 
		 * @return {string}
		 */
		projet() {
			let projetName = this.projetsActif.find(projet => projet.id == this.collecte.projet_id);

			if (projetName) {
				return projetName.intitule;
			} else {
				return 'projet inexsitant'
			}
		},

        /**
         * Récupère la collecte id via le store
         */
        collecteId() {
            if (this.collecte) {
                return this.collecte.id;
            }

            return '';
        }
    },

    watch: {
        collecteId() {
            this.initResp(this.collecte.reponses);
        }
    },

    methods: {
        ...mapActions(["setCollecte", 'initResp']),

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
            .then((data) => {
                this.setCollecte(data);

                // if(data.reponses && 0 == this.responses.length) {
                //     this.initResp(data.reponses);
                // }
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.id) {
            this.loadCollecte(to.params.id);
        }
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
