<template>
    <div class="d-flex flex-wrap justify-content-between align-items-center">
        <!-- <div class="d-flex align-items-center">
            <strong class="me-2 text-secondary" style="width:40px">#{{collecte.id}}</strong>

            <div>
                <div>
                    <div  v-if="!getPersonnelNameFromId(collecte.enqueteur__structure__personnel_id)" class="me-2 text-warning">
						Contrôleur non programmé 
					</div>

                    <div v-else class="d-flex align-items-center">
                        <span>
                            <user-image :name="getPersonnelNameFromId(collecte.enqueteur__structure__personnel_id)" className="me-1" size="sm" />
                        </span>
                        
                        Contrôleur: {{getPersonnelNameFromId(collecte.enqueteur__structure__personnel_id)}}
                    </div>

                    <div class="d-flex align-items-center text-secondary">
                        <i class="bi bi-arrow-return-right me-1 ms-2"></i>

                        <div v-if="!getPersonnelNameFromId(collecte.cible__structure__personnel_id)" class="me-2 text-warning">
							Opérateur non programmé 
						</div>

                        <div v-else class="d-flex align-items-center fs-7">
                            <span>
								<user-image :name="getPersonnelNameFromId(collecte.cible__structure__personnel_id)" className="me-1" size="sm" />
							</span>

                            Opérateur: {{getPersonnelNameFromId(collecte.cible__structure__personnel_id)}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-grow-1 flex-md-grow-0">
            <div class="d-flex flex-row-reverse flex-md-row justify-content-between align-items-baseline">
                <div v-if="collecte.result_var && collecte.result_var != 'null' && !editable" class="badge fs-5 text-uppercase mx-2 " :class="classNameFromSAMI(collecte.result_var)">
                    {{collecte.result_var}}
                </div>
    
                <div class="mb-1">
                    <i class="bi bi-calendar-event mx-2"></i>
                    <span class="me-2 text-warning" v-if="!collecte.date">Date non programmée</span>
                    <span v-else class="me-2">{{changeFormatDateLit(collecte.date)}}</span>
                </div>
    
            </div>
        </div> -->

        <div class="d-flex w-100">
            <div class="d-flex align-items-center">
                <strong class="me-2 text-secondary" style="width:40px">#{{collecte.id}}</strong>
            </div>

            <div class="w-100 d-flex flex-column flex-md-row-reverse justify-content-md-between">
                <div class="d-flex justify-content-between align-items-start mb-2 flex-md-row-reverse align-items-md-center">
                    <div>
                        <i class="bi bi-calendar-event me-2"></i>
                        <span class="me-2 text-warning" v-if="!collecte.date">Date non programmée</span>
                        <span v-else class="me-2">{{changeFormatDateLit(collecte.date)}}</span>
                    </div>

                    <div v-if="collecte.result_var && collecte.result_var != 'null' && !editable" class="badge fs-6 text-uppercase me-md-2" :class="classNameFromSAMI(collecte.result_var)">
                        {{collecte.result_var}}
                    </div>
                </div>

                <div>
                    <div  v-if="!getPersonnelNameFromId(collecte.enqueteur__structure__personnel_id)" class="me-2 text-warning">
						Contrôleur non programmé 
					</div>

                    <div v-else class="d-flex align-items-center">
                        <span>
                            <user-image :name="getPersonnelNameFromId(collecte.enqueteur__structure__personnel_id)" className="me-1" size="sm" />
                        </span>
                        
                        Contrôleur: {{getPersonnelNameFromId(collecte.enqueteur__structure__personnel_id)}}
                    </div>

                    <div class="d-flex align-items-center text-secondary">
                        <i class="bi bi-arrow-return-right me-1 ms-2"></i>

                        <div v-if="!getPersonnelNameFromId(collecte.cible__structure__personnel_id)" class="me-2 text-warning">
							Opérateur non programmé 
						</div>

                        <div v-else class="d-flex align-items-center fs-7">
                            <span>
								<user-image :name="getPersonnelNameFromId(collecte.cible__structure__personnel_id)" className="me-1" size="sm" />
							</span>

                            Opérateur: {{getPersonnelNameFromId(collecte.cible__structure__personnel_id)}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    
</template>

<script>
import UserImage from './pebble-ui/UserImage.vue';
import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

export default {

	props: {
		collecte: Object,
		personnels: Object,
		editable: {
			type: Boolean,
			default: true,
		}
	},

	methods: {
		/**
         * Récupère le nom d'un personnel actif via un id
         * 
         * @param {number} personnelId l'id d'un personnel actif
         * 
         * @return {string}
         */
		getPersonnelNameFromId(personnelId) {
            let personnelName = this.personnels.find(personnel => personnel.id == personnelId);
    
            if (personnelName) {
                return personnelName.cache_nom;
            } else {
                return null
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

	components: { UserImage },
}
</script>