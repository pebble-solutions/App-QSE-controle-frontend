<template>
    <div class="d-flex justify-content-between align-items-center">
        <strong class="me-2 text-secondary" style="width:40px">#{{collecte.id}}</strong>
        
        <div class="w-100 d-flex flex-column align-items-md-center flex-md-row-reverse justify-content-md-between">
            
            <div class="text-nowrap badge rounded-pill border" :class="{'text-bg-warning' : (!collecte.date && !collecte.date_done), 'text-bg-light' : (collecte.date || collecte.date_done), 'text-success border-success': (collecte.date_done)}">
                <i class="bi bi-calendar-check me-2" v-if="collecte.date_done"></i>
                <i class="bi bi-calendar-event me-2" v-else></i>
                <span v-if="!collecte.date || collecte.date ==='null' || collecte.date === '0000-00-00 00:00:00' || collecte.date ==='NULL'">Non renseignée</span>
                <span v-else>{{changeFormatDateLit((collecte.date_done ?? collecte.date))}}</span>
            </div>
            <div class="w-100 d-flex align-items-center justify-content-between">
                <div>
                    <div  v-if="!collecte.enqueteur_nom" class="me-2 text-warning">
                        Contrôleur non programmé 
                    </div>

                    <div v-else class="d-flex align-items-center">
                        <span>
                            <user-image :name="collecte.enqueteur_nom" className="me-1" size="sm" />
                        </span>
                        
                        <div>
                            <strong class="fs-7 d-block d-md-inline text-secondary">Contrôleur:</strong>
                            {{collecte.enqueteur_nom}}
                        </div>
                    </div>

                    <div class="d-flex align-items-center text-secondary">
                        <i class="bi bi-arrow-return-right me-1 ms-2"></i>

                        <div v-if="!collecte.cible_nom" class="me-2 text-warning">
                            Opérateur non programmé 
                        </div>

                        <div v-else class="d-flex align-items-center">
                            <span>
                                <user-image :name="collecte.cible_nom" className="me-1" size="sm" />
                            </span>

                            <div>
                                <strong class="fs-7 d-block d-md-inline text-secondary">Opérateur:</strong>
                                {{collecte.cible_nom}}
                            </div>
                        </div>
                    </div>

                    <div class="fw-light fs-7" v-if="displayProjet">
                        <div class="d-flex" v-if="collecte.projet_id">
                            <i class="bi bi-boxes me-2"></i>
                            {{ projet_label }}
                        </div>
                    </div>
                    <div class="fw-light fs-7" v-if="displayForm">
                        <div class="d-flex" v-if="collecte.formulaire">
                            <i class="bi bi-card-list me-2"></i>
                            {{ form_label }} 
                        </div>
                    </div>
                    
                </div>
                <div v-if="collecte.result_var && collecte.result_var != 'null'&& !editable " class="badge fs-6 text-uppercase me-md-2" :class="classNameFromSAMI(collecte.result_var)">
                    {{collecte.result_var}}
                </div>
                <div v-else-if="collecte.result_var && collecte.result_var == 'null' && !editable" class="badge fs-6 text-uppercase me-md-2" :class="classNameFromSAMI(collecte.result_var)">Non évalué</div>
            </div>
        </div>
    </div>
    
</template>

<script>

import UserImage from './pebble-ui/UserImage.vue';
import { mapState } from 'vuex';
import { dateFormat } from '../js/collecte';

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
                label = "Projet non renseigné";
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
            else {
                label = "Formulaire non renseigné";
            }
            return label;
        }
    },

	methods: {
		/**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */
		changeFormatDateLit(el) {
			return dateFormat(el);
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