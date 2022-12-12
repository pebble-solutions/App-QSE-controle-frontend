<template>    
    <div v-if="collecte">
        {{collecte.groupe}}
		<div class="card sticky-top">
			<div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="">
                        Kn n° {{collecte.date.substr(0,4)}}-{{collecte.id}}
                    </div>

                    <div class="">
                        <i class="bi bi-person-badge-fill"></i>
                        {{agent}}
                    </div>

                    <div class="">
                        {{typeKn}}
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
            
            <div v-if="!$route.params.bloc">
                <intro></intro>
            </div>
		</div>

        <router-view></router-view>
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
		 * @param {number} groupInformationId l'id du group information de la collecte
		 * 
		 * @return {string} // deja utilise dans App.vue 
		 */
        agent() {
            let controleurName = this.listActifs.find(personnel => personnel.id == this.collecte.cible__structure__personnel_id);

            if (controleurName) {
                return controleurName.cache_nom;
            } else {
                return 'controleur inexistant'
            }
        },

        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @param {number} groupInformationId l'id du group information de la collecte
		 * 
		 * @return {string} // deja utilise dans App.vue 
		 */
        typeKn() {
			let groupInformation = this.formulaires.find(e => e.id == this.collecte.information__groupe_id);

			if (groupInformation) {
				return groupInformation.groupe;
			} else { 
				return 'group inexistant';
			}
        },

        controleur() {
            let controleurName = this.listActifs.find(personnel => personnel.id == this.collecte.enqueteur__structure__personnel_id);

            if (controleurName) {
                return controleurName.cache_nom;
            } else {
                return 'controleur inexistant'
            }
        },

        /**
		 * Récupère le nom du projet de la collecte
		 * 
		 * @param {number} projetId l'id du projet de la collecte
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
