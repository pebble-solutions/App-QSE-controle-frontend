<template>
    <div class="d-flex justify-content-between align-items-center">
        <strong class="me-2 text-secondary" style="width:40px">#{{collecte.id}}</strong>
        
        <div class="w-100 d-flex flex-column align-items-md-center flex-md-row-reverse justify-content-md-between">
            
			<div class="mb-1 mb-md-0">
				<date-badge :collecte="collecte" />
			</div>
            <div class="w-100 d-flex align-items-center justify-content-between me-2">
				<div>
					<div class="d-block d-md-flex align-items-center">
						<div class="d-flex align-items-center">
							<span>
								<user-image :name="collecte.enqueteur_nom" v-if="collecte.enqueteur_nom" className="me-1" size="sm" />
							</span>
							<personnel-name :displayFonction="true" fonctionLabel="Contrôleur" :personnelId="collecte.enqueteur__structure__personnel_id" :personnelName="collecte.enqueteur_nom" />
						</div>
	
						<div class="d-flex align-items-center text-secondary">
							<i class="bi bi-arrow-right mx-2 d-none d-md-inline"></i>
							<i class="bi bi-arrow-return-right me-1 ms-2 d-inline d-md-none"></i>
							<span>
								<user-image :name="collecte.cible_nom" v-if="collecte.cible_nom" className="me-1" size="sm" />
							</span>
							<personnel-name :displayFonction="true" fonctionLabel="Opérateur" :personnelId="collecte.cible__structure__personnel_id" :personnelName="collecte.cible_nom" />
						</div>
					</div>
					<div v-if="showForm || showProjet" class="mt-1">
						<projet-name v-if="showProjet" :name="projet_label" />
						<formulaire-name v-if="showForm && collecte.formulaire" :name="form_label" />
					</div>
				</div>
				<result-badge :result="collecte.result_var" className="fs-6" />
            </div>
        </div>
    </div>
    
</template>

<script>

import UserImage from '../pebble-ui/UserImage.vue';
import { mapState } from 'vuex';
import DateBadge from './DateBadge.vue';
import PersonnelName from './PersonnelName.vue';
import ProjetName from './ProjetName.vue';
import FormulaireName from './FormulaireName.vue';
import ResultBadge from '../badges/Result.vue';

export default {

	props: {
		collecte: Object,
		editable: {
			type: Boolean,
			default: true,
		},
        displayForm: {
            type: Boolean,
            default: false,
        },
        displayProjet: {
            type: Boolean,
            default: false,
        }
	},

    computed: {
        ...mapState(['formulaires']),

		/**
		 * Retourne true si le projet doit être affiché.
		 * 
		 * Le projet doit être affiché si les conditions suivantes sont remplies :
		 * - displayProjet est true
		 * - il y a un projet sur la collecte
		 * 
		 * @return {bool}
		 */
		showProjet() {
			return this.displayProjet && this.collecte.projet_id;
		},

		/**
		 * Retourne true si le formulaire doit être affiché.
		 * 
		 * Le formulaire doit être affiché si les conditions suivantes sont remplies :
		 * - displayForm est true
		 * - il y a un formulaire sur la collecte
		 * 
		 * @return {bool}
		 */
		showForm() {
			return this.displayForm && this.collecte.formulaire;
		},

        /**
         * Retourne le libellé du projet en fonction des informations projet_id et projet_label sur la collecte.
         * 
         * @return {string}
         */
        projet_label() {
            let c = this.collecte;
            let label;
            if (c.projet_id) {
                label = c.projet_label ? c.projet_label : `Projet sans nom (#${c.projet_id})`;
            }
            else {
                label = null;
            }
            return label;
        },
        /**
         * Retourne le libellé du projet en fonction des informations projet_id et projet_label sur la collecte.
         * 
         * @return {string}
         */
        form_label() {
            let c = this.collecte;
            let label;
            let formLabel;
            if (c.formulaire) {
                
                label= this.formulaires.find(e => e.id == c.formulaire);
                
                formLabel = label.groupe;
                return formLabel
            }
            return null;
        }
    },

	methods: {
		/**
         * Retourne une classe CSS par rapport à une réponse S A M I
         * 
         * @param {string} reponse S A M I
         * 
         * @return {string}
         */
		classNameFromSAMI(reponse) {
            if (typeof reponse === 'string') {
                if (reponse.toLowerCase() == 's') return 'text-bg-success';
                else if (reponse.toLowerCase() == 'a') return 'text-bg-primary';
                else if (reponse.toLowerCase() == 'm') return 'text-bg-warning';
                else if (reponse.toLowerCase() == 'i') return 'text-bg-danger';
            }
            return 'text-bg-secondary';
        },
	},

	components: { UserImage, DateBadge, PersonnelName, ProjetName, FormulaireName, ResultBadge },
}
</script>