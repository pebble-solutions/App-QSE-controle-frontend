<template>
    <div class="container">
      <div class="row">
        <div class="col-lg-2 col-md-12 col-12">
          <div class="row">
            <div class="col-12 col-lg-12 text-center">
              <strong class="me-2 text-secondary">#{{ collecte.id }}</strong>
            </div>
            <div class="col-12 col-lg-12 text-center">
              <div class="d-flex align-items-center justify-content-center">
                <date-badge :collecte="collecte" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9 col-12 pt-2">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center justify-content-md-end">
                <span>
                  <user-image :name="collecte.enqueteur_nom" v-if="collecte.enqueteur_nom" class="me-1" size="sm" />
                </span>
                <personnel-name :displayFonction="true" fonctionLabel="Contrôleur"
                  :personnelId="collecte.enqueteur__structure__personnel_id"
                  :personnelName="collecte.enqueteur_nom" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="d-flex ">
                    <!-- Affiche l'icône spécifique pour les écrans larges avec une marge à droite -->
    <i class="bi bi-arrow-right me-3 d-none d-md-block"></i>
    <!-- Affiche l'icône spécifique pour les écrans moyens et petits -->
    <i class="bi bi-arrow-return-right m-1 ms-1 d-md-none"></i>
                <span>
                  <user-image :name="collecte.cible_nom" v-if="collecte.cible_nom" class="me-1" size="sm" />
                </span>
                <personnel-name :displayFonction="true" fonctionLabel="Opérateur"
                  :personnelId="collecte.cible__structure__personnel_id"
                  :personnelName="collecte.cible_nom" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-11 col-12 d-flex align-items-center justify-content-md-end">
          <div v-if="collecte.result_var && collecte.result_var != 'null' && !editable"
            class="badge fs-6 text-uppercase ms-2" :class="classNameFromSAMI(collecte.result_var)">
            {{ collecte.result_var }}
          </div>
          <div v-else-if="collecte.result_var && collecte.result_var == 'null' && !editable"
            class="badge fs-6 text-uppercase ms-2" :class="classNameFromSAMI(collecte.result_var)">Non évalué</div>
        </div>
        <div class="col-md-1 col-12">
          <projet-name v-if="displayProjet && collecte.projet_id" :name="projet_label" />
          <formulaire-name v-if="displayForm && collecte.formulaire" :name="form_label" />
        </div>
      </div>
    </div>
  </template>

<script>

import UserImage from './pebble-ui/UserImage.vue';
import { mapState } from 'vuex';
import DateBadge from './collecte/DateBadge.vue';
import PersonnelName from './collecte/PersonnelName.vue';
import ProjetName from './collecte/ProjetName.vue';
import FormulaireName from './collecte/FormulaireName.vue';

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

                label = this.formulaires.find(e => e.id == c.formulaire);

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

    components: { UserImage, DateBadge, PersonnelName, ProjetName, FormulaireName },
}
</script>

<style scoped>
.arrow-icon-md {
  margin-right: 2rem; /* ou la valeur que vous souhaitez */
}
</style>