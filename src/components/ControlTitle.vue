<template>
    <div >
        <div v-if="collecte" class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center">
                        <UserImage class="me-2" :name="agent"></UserImage>
                        <div>
                            {{agent}}
                            <div class="fw-lighter">
                                <span class="me-2">#{{collecte.id}}</span>
                                <span>{{typeKn}}</span>
                            </div>

                            <!-- <div class="d-flex" v-if="collecte.projet_id">
                                <i class="bi bi-boxes me-2"></i>
                                {{ collecte.projet_label }}
                            </div> -->
                            
                            <div v-if="collecte.projet_id" class="d-flex justify-content-start align-items-center">
                                <span><i class="bi bi-boxes me-2"></i></span>
                                <!-- {{collecte.projet_label}}  {{ collecte.projet_id }} {{ collecte.id }} -->
                                <span class="me-2"> {{ projet }} </span>
                                <button v-if="!action" class="btn btn-sm btn-outline-primary" type="button" @click.prevent="SelectProject()">modifier</button>
                            </div>
                            <div v-else class="d-flex justify-content-start align-items-center">
                                <span><i class="bi bi-boxes me-2"></i></span>
                                <span class="me-2 text-warning">Projet non renseigné</span>

                                <button v-if="!action" class="btn btn-sm btn-outline-primary" type="button" @click.prevent="SelectProject()">Sélectionner</button>
                            </div> 
                            
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-center">
                        <span class="badge bg-warning me-2" v-if="!collecte.date || collecte.date ==='null' || collecte.date === '0000-00-00 00:00:00' || collecte.date ==='NULL'">date non renseignée</span>
                        <span v-else class="badge bg-secondary me-2">Programmé le {{changeFormatDateLit(collecte.date)}}</span>
                    </div>                    
                </div>
                <div v-else>
                    <spinner/>
                </div>
            </div>
            <div v-if="select" id="SelectProject" class="col-sm-12 col-md-6">
                <form method="post" @submit.prevent="changeProjet()">
                    <label for="collecteProjet" class="form-label">Sélectionnez un projet:</label>
                    <select class="form-select" id="collecteProjet" name="projet.intitule" v-model="collecte.projet_id">
                        <option  v-for="(projet) in projets" :value="projet.id" :key="projet.id">{{projet.intitule}}</option>
                    </select>
                <button class="btn btn-lg btn-outline-primary mt-2 " type="submit">Valider</button>
                </form>

            </div>
</template>

<script>

import {mapState, mapActions} from 'vuex';
import Spinner from '../components/pebble-ui/Spinner.vue';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';
import UserImage from '../components/pebble-ui/UserImage.vue';


export default {
    data() {
        return {
            pending: {
                collecte:true
            },
            select: false,
            action: false,
            projetId: null,
        }
    },

    components: { Spinner, UserImage },

    computed: {
        ...mapState(['responses', 'collecte', 'listActifs', 'formulaires', 'projets']),

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
			let projetName = this.projets.find(projet => projet.id == this.collecte.projet_id);

			if (projetName) {
				return projetName.intitule;
			} else {
				return 'Projet non renseigné'
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
         * enregistre le nouveau projet affecté à la collecte
         * met à jour le store
         * 
         * @param {number} id   l'id du projet affecté à la collecte
         */
        SelectProject() {
            this.select = true;
            this.action = true;
        },

        changeProjet() {
            confirm('voulez-vous modifier le projet?');
            console.log(this.projet, this.projet_id,'id projet');
            console.log(this.collecte.projet_id, this.collecte.projet_label, 'collectee projet');
        
            // this.pending.collecte = true;
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                environnement: 'private', projet_id: this.collecte.projet_id
            })
            .then((data) => {
                
                this.setCollecte(data); 
                console.log(data, 'data')
            })
            .catch(this.$app.catchError)
            .finally(() => this.pending.collecte = false);
            this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                environnement: 'private'
            })
            .then((data) => {
                // this.setCollecte(data);
                console.log(data, 'loadmodif');
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);


            this.select = false;
            this.action= false;

        },

        

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
                console.log(data, 'load');
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