<template>
	
	<div class="d-flex flex-column align-items-start">
		<div class="d-flex justify-content-start align-items-center">
			<div>
				<i class="bi bi-person-badge-fill me-1"></i>
			</div>

			<div>
				{{getPersonnelNameFromId(collecte.cible__structure__personnel_id)}}
			</div>
		</div>
		<div class="d-flex align-items-center">
			<div class="me-1">
				#{{collecte.id}}
			</div>
			<div class="fw-lighter" >
				<i class="bi bi-check me-1" v-if="collecte.done == 'OUI'"></i>
				{{getGroupNameFromId(collecte.information__groupe_id)}}
			</div>
			
			<div v-if="collecte.projet_id">
				<i class="bi bi-boxes"></i>
				{{getProjetName(collecte.projet_id)}}
			</div>
		</div>

		<div class="badge rounded-pill text-bg-secondary">
			{{collectDate}}
		</div>
	</div>
		
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        collecte: Object
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'projetsActif']),

		/**
		 * Retourn la date de la collecte formater en d/m/Y
		 */
		collectDate() {
			let date = new Date(this.collecte.date);
			return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
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
				return 'formulaire non renseigné';
			}
		},

		/**
		 * Récupère le nom d'un personnel actif via un id
		 * 
		 * @param {number} personnelId l'id d'un personnel actif
		 * 
		 * @return {string}
		 */
		getPersonnelNameFromId(personnelId) {
			let personnelName = this.listActifs.find(personnel => personnel.id == personnelId);

			if (personnelName) {
				return personnelName.cache_nom;
			} else {
				return 'Personnel non renseigné'
			}
		},

		/**
		 * Récupère le nom du projet de la collecte
		 * 
		 * @param {number} projetId l'id du projet de la collecte
		 * 
		 * @return {string}
		 */
		getProjetName(projetId) {
			let projetName = this.projetsActif.find(projet => projet.id == projetId);

			if (projetName) {
				return projetName.intitule;
			} else {
				return 'projet non renseigné'
			}
		},
    }
}

</script>