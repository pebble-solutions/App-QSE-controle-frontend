<template>

	<div class="d-flex align-items-center">
			<div class="me-2">
				<UserImage :name="getPersonnelNameFromId(collecte.cible__structure__personnel_id)"></UserImage>
			</div>

			<div class="d-flex flex-column align-content-between">
				<div class="d-flex align-items-center">
					<small class="fw-lighter me-2">#{{collecte.id}}</small>
					<span class="badge bg-secondary me-2">{{changeFormatDateLit(collecte.date)}}</span>
					<span 
						class="badge"
						:class="{
							'bg-danger': colorBadge == 'danger',
                            'bg-success': colorBadge == 'success',
							'bg-warning': colorBadge == 'warning',
						}"
					>
						<i v-if="colorBadge == 'danger'" class="bi bi-calendar-x-fill"></i>
						<i v-else-if="colorBadge == 'warning'" class="bi bi-calendar-event-fill"></i>
						<i v-else class="bi bi-calendar-check-fill"></i>
						{{ remainingDays() }}
					</span>
				</div>

				<div class="d-flex">
					{{getPersonnelNameFromId(collecte.cible__structure__personnel_id)}}
				</div>

				<div class="d-flex">
					<div class="fw-lighter" >
						<i class="bi bi-check me-1" v-if="collecte.done == 'OUI'"></i>
						{{getGroupNameFromId(collecte.information__groupe_id)}}
					</div>
				</div>

				<div class="d-flex" v-if="collecte.projet_id">
					<i class="bi bi-boxes"></i>
					{{getProjetName(collecte.projet_id)}}
				</div>

				<div v-else>
					<i class="bi bi-boxes"></i>
					Chantier non renseigné
				</div>
			</div>
	</div>	
		
</template>

<script>
import { mapState } from 'vuex';
import UserImage from './pebble-ui/UserImage.vue';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';


export default {
    props: {
        collecte: Object
    },

	data() {
		return {
            colorBadge: null
        }
	},

    computed: {
        ...mapState(['formulaires', 'listActifs', 'projetsActif']),

		/**
		 * Retourn la date de la collecte formater en d/m/Y
		 * 
		 * @return {string}
		 */
		collectDate() {
			let date = new Date(this.collecte.date);
			return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
		},
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
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			date.locale(fr);
			return date.format(new Date(el), 'DD MMM YYYY')
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

		/**
		 * Compte le nombre de jour restant entre 2 date
		 */
		countRemainingDays(refDate, date = new Date) {
			let collecteDate = new Date(refDate);

			let timeDifference = collecteDate.getTime() - date.getTime();

			return timeDifference;
		},

		/**
		 * Retourne nombre de jour ou d'heure et minutes restant entre 2 date
		 * 
		 * @return {string}
		 */
		remainingDays() {
			let countRemainingDays = this.countRemainingDays(this.collecte.date);

			let totalMinutes = Math.round(countRemainingDays / (1000 * 60));
			let days = Math.floor(totalMinutes / (60 * 24));
			let hours = Math.floor(totalMinutes / 60);
			let minutes = totalMinutes % 60;

			if (0 == days+1){
				this.colorBadge = 'warning';
				return `${Math.abs(hours)}h ${Math.abs(minutes)}min`;
			} 

			this.colorBadge = 'success';

			if (days < 0) {
				this.colorBadge = 'danger';
			}


			return `${days+1} jour${ (days+1) > 1 || (days+1) < -1 ? "s" : ""}`;
		}
    },
	components: {
		UserImage
	}
}

</script>