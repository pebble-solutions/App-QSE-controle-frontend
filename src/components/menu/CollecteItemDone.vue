<template>

	<div class="d-flex align-items-center justify-content-between">
  <div class="me-2">
    <UserImage :name="collecte.cible_nom ?? '?'"></UserImage>
  </div>
  
  <div class="d-flex flex-column flexwrap align-content-start justify-content-start w-100 position-relative">
    <div class="d-flex align-items-center">
      <small class="fw-lighter me-2">#{{collecte.id}}</small>
      <date-badge :collecte="collecte" />
      <span v-if="collecte.date_start && !collecte.unlocked" class="badge rounded-pill ms-1 bg-warning">
        <i class="bi bi-lock-fill"></i>
      </span>
    </div>
    
    <personnel-name :personnel-name="collecte.cible_nom" :personnel-id="collecte.cible__structure__personnel_id" />
    
    <formulaire-name :name="formulaireName" v-if="formulaireName" />
    
    <projet-name :name="collecte.projet_label" v-if="collecte.projet_label" />
  </div>
  
  <div class="position-absolute bottom-1 end-0 translate-middle mb-2 me-4" style="right: 19px;">
    <BouclageBadgeResult :resultat="collecte.following_result" v-if="collecte.following_result && collecte.following_result != 'null'" />

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
import DateBadge from '../collecte/DateBadge.vue';
import PersonnelName from '../collecte/PersonnelName.vue';
import FormulaireName from '../collecte/FormulaireName.vue';
import ProjetName from '../collecte/ProjetName.vue';
import BouclageBadgeResult from '../badges/BouclageBadgeResult.vue';


export default {
    props: {
        collecte: Object
    },

	


    computed: {
        ...mapState(['formulaires', 'listActifs', 'projets']),

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
			}
			return null;
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
		UserImage, DateBadge, PersonnelName, FormulaireName, ProjetName, BouclageBadgeResult,

	}
}


</script>