<template>
    <div class="d-flex align-items-center justify-content-between">
        Kn n° {{collecte.id}}
        <span class="badge rounded-pill" :class="{'text-bg-secondary' : collecte.done == 'NON', 'text-bg-success' : collecte.done == 'OUI'}">
            <i class="bi bi-check me-1" v-if="collecte.done == 'OUI'"></i>
            {{getGroupNameFromId(collecte.information__groupe_id)}}
        </span>
    </div>

    <div>
        <i class="bi bi-person-badge-fill"></i>
        {{getPersonnelNameFromId(collecte.cible__structure__personnel_id)}}
    </div>

    <div v-if="collecte.projet_id">
        <i class="bi bi-boxes"></i>
        {{getProjetName(collecte.projet_id)}}
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        collecte: Object
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'projetsActif'])
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
				return 'group inexistant';
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
				return 'Personnel inexsitant'
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
				return 'projet inexsitant'
			}
		},
    }
}

</script>