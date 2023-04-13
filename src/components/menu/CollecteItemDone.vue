<template>

	<div class="d-flex align-items-center justify-content-between">
		<div class="me-2">
			<UserImage :name="personnelName"></UserImage>
		</div>
		
		<div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100">
			<div class="d-flex align-items-center">
				<small class="fw-lighter me-2">#{{collecte.id}}</small>
				<span  class="badge bg-light text-dark rounded-pill border">
					<i class="bi bi-calendar-check"></i>
					{{dateLabel}}
				</span>
			</div>
			<div v-if="!collecte.cible__structure__personnel_id" class="text-warning">
				{{personnelName}}
			</div>
			<div v-else>
				{{personnelName}}
			</div>
			
			<div class="fw-lighter" >
				{{formulaireName}}
			</div>
			
			<div class="fs-7 fw-light" v-if="collecte.projet_label">
				<i class="bi bi-boxes me-2"></i>
				{{collecte.projet_label}}
			</div>
		</div>
		<div v-if="collecte.result_var && collecte.result_var != 'null'" class="badge fs-6 text-uppercase" :class="classNameFromSAMI(collecte.result_var)">
			{{collecte.result_var}}
		</div>
		<div v-else class="badge fs-6 text-uppercase" :class="classNameFromSAMI(collecte.result_var)">?</div>
	</div>	
		
</template>
<script>
import { mapState } from 'vuex';
import UserImage from '../pebble-ui/UserImage.vue';
import { dateFormat } from '../../js/collecte';


export default {
    props: {
        collecte: Object
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'projets']),

		/**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * 
		 * @return {string}
		 */
		dateLabel() {
			let dt = this.collecte.date_done ?? this.collecte.date;
			if (!dt) {
				return 'Date non renseignée';
			}
			else {
				return dateFormat(dt);
			}
		},

		/**
		 * Retourne le nom du personnel correspondant à la collecte.
		 * 
		 * @return {string}
		 */
		personnelName() {
			if (this.collecte.cible__structure__personnel_id) {
				return this.collecte.cible_nom ?? "Personnel introuvable";
			}
			return "Opérateur non renseigné";
		},

		/**
		 * Retourne le nom du formulaire correspondant à la collecte
		 * 
		 * @return {string}
		 */
		formulaireName() {
			return this.getGroupNameFromId(this.collecte.information__groupe_id);
		}
    },

    methods: {
        /**
		 * Récupere le nom du groupe d'information de la collect via un id de
		 * 
		 * @param {number} groupInformationId l'id du group information de la collecte
		 * 
		 * @return {string}
		 */
		getGroupNameFromId(groupInformationId) {
			let groupInformation = this.formulaires.find(e => e.id == groupInformationId);

			if (groupInformation) {
				return groupInformation.groupe;
			} else { 
				return 'Formulaire non renseigné';
			}
		},

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

	components: {
		UserImage
	}
}


</script>