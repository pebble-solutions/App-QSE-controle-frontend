<template>
    <div v-if="collecte" class="d-flex justify-content-end align-items-center my-3">
        
                
                <div v-if="collecte.projet_id && !selectProjetForm && collecte.done != 'OUI'" class="d-flex align-items-baseline">
                    <!-- <span class="me-2">{{collecte.projet_label}}</span> -->
                    <button v-if="isRouteHome" class="btn btn-sm btn-outline-secondary" type="button" @click.prevent="selectProject()">  
                        <i class="bi bi-boxes me-2"></i>
                        Modifier le projet</button>
                </div>

                <template v-else-if="!collecte.projet_id">
                    <button v-if="!selectProjetForm && isRouteHome" class="btn btn-sm btn-outline-secondary" type="button" @click.prevent="selectProject()">
                        <i class="bi bi-boxes me-2"></i> Sélectionnez un projet
                    </button>
                </template> 

                <form method="post" @submit.prevent="changeProjet()" v-if="selectProjetForm">
                    <div class="d-flex align-items-end" v-if="isRouteHome">
                        <div class="me-2">
                            <label for="collecteProjet" class="form-label">Sélectionnez un projet:</label>
                            <select class="form-select form-select-sm" id="collecteProjet" name="projet.intitule" v-model="projet_id">
                                <option  v-for="(projet) in projets" :value="projet.id" :key="projet.id">{{projet.intitule}}</option>
                            </select>
                        </div>
                        <button class="btn btn-sm btn-outline-primary" type="submit" :disabled="pending.collecte">Valider</button>
                    </div>
                </form>
        </div>
                
        
</template>

<script>

import { mapState} from 'vuex';


export default {
    props: {
        collecte: Object
    },

    data() {
        return {
            selectProjetForm: false,
            projet_id: null,
            pending: {
                collecte: false
            }
        }
    },

    // components: { UserImage },

    computed: {
        ...mapState(['listActifs', 'formulaires', 'projets']),
        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @return {string} // deja utilise dans App.vue 
		 */
        agent() {
            let personnel = this.listActifs.find(personnel => personnel.id == this.collecte.cible__structure__personnel_id);

            if (personnel) {
                return personnel.cache_nom;
            } else {
                return 'Opérateur non renseigné'
            }
        },

        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @return {string} // deja utilise dans App.vue 
		 */
        formulaireLabel() {
			let groupInformation = this.formulaires.find(e => e.id == this.collecte.information__groupe_id);

			if (groupInformation) {
				return groupInformation.groupe;
			} else { 
				return 'Formulaire non renseigné';
			}
        },

        /**
         * Retourne true si la route est sur l'accueil du KN
         */
        isRouteHome() {
            if (this.$route.name =='collecteKN' && this.collecte.done == "NON"){
                return true
            } else {return false}
            // return this.$route.name == 'collecteKN' ? true : false;
        },

        /**
         * Retourne une classe CSS en fonction de la date de la collecte
         * 
         * @return {string}
         */
        dateClassName() {
            return this.collecte.date ? 'text-secondary' : 'text-warning';
        },

        /**
         * Retourne un libellé en fonction de la valeur de la date.
         * 
         * @return {string}
         */
        dateLabel() {
            return this.collecte.date ? "Programmé le "+this.changeFormatDateLit(this.collecte.date) : "Date non renseignée";
        }
    },

    methods: {
        // ...mapActions(['refreshCollecte']),

        /**
         * Ouvre le formulaire permettant de modifier le projet sélectionné
         */
        selectProject() {
            this.selectProjetForm = true;
        },

        /**
         * Envoie une requête à l'API pour modifier le projet_id
         */
        changeProjet() {
            this.pending.collecte = true;
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                environnement: 'private', projet_id: this.projet_id
            })
            .then(() => {
                // this.refreshCollecte(this.collecte)
                this.$emit('projet-change', {
                    projet_id: this.projet_id,
                    projet_label: this.getProjetLabelFromId(this.projet_id)
                });
                this.selectProjetForm = false;
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.collecte = false
            });
        },

        /**
         * Retourne le libellé d'un projet depuis son ID
         * 
         * @param {number} id ID du projet à trouver
         * 
         * @return {string}
         */
        getProjetLabelFromId(id) {
            const projet = this.projets.find(e => e.id == id);
            return projet ? projet.intitule : `Projet sans nom (${id})`;
        },

        // /**
		//  * Modifie le format de la date entrée en paramètre et la retourne 
		//  * sous le format 01 févr. 2021
		//  * @param {string} date 
		//  */
		// changeFormatDateLit(el) {
        //     return dateFormat(el);
		// },
    },

    mounted() {
        this.projet_id = this.collecte.projet_id;
    }
}

</script>