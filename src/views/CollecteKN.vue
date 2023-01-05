<template>

    <div class="container py-3">
        <div v-if="collecte">
            <div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center">
                        <UserImage class="me-2" :name="agent"></UserImage>
                        {{agent}}
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-secondary me-2">programmé le {{changeFormatDateLit(collecte.date)}}</span>
                        <!-- <span class="badge bg-warning">{{dateJour()}}</span> -->
                    </div>
                    
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div class="fw-lighter">
                        <small class="me-2">#{{collecte.id}}</small>
                        <span>{{typeKn}}</span>
                    </div>
                </div>

                    <!-- <div>
                        <i class="bi bi-person-fill-check me-1"></i>
                        {{controleur}}
                    </div> -->

                    <div class="d-flex justify-content-start align-items-center">
                        <small><i class="bi bi-boxes me-1"></i>{{projet}}</small>
                    </div>
            </div>

            <div class="my-2" v-if="collecte.done == 'OUI'">
                <alert-message icon="bi-check-circle" variant="success">Ce contrôle est terminé</alert-message>
            </div>

            <template v-if="collecte.done == 'OUI'">
                <consultation-collecte-resume :collecte="collecte"/>
            </template>
    
            <template v-else>
                <div class="card mt-3" v-if="(!$route.params.bloc && $route.name != 'CollectKnEnd')">
                    <intro></intro>
                </div>
            </template>    
        </div>
        
        <div v-else>
            <spinner/>
        </div>

        <router-view></router-view>
    </div>

</template>

<script>

import {mapState, mapActions} from 'vuex';
import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import Intro from '../components/Intro.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';
import UserImage from '../components/pebble-ui/UserImage.vue';


export default {
    data() {
        return {
            pending: {
                collecte:true
            }
        }
    },

    components: { Intro, ConsultationCollecteResume, AlertMessage, Spinner, UserImage },

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
				return 'Chantier non renseigné'
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
        },

        /**
		 * Retourn la date formater en d/m/Y
		 */
		collectDate() {
			let date = new Date();
			return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
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
        /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
		},

        dateJour() {
            date.locale(fr);
            return date.format(new Date(), 'DD MMM YYYY')
        }
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
