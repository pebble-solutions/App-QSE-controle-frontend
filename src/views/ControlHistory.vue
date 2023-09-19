<template>
    <div v-if="!pending.control">
        <h3 class="mx-2">Historique des contrôles </h3>

        <div class="list-group" v-if="listControlDone.length">
            <div v-for="control in listControlDone" :key="control.id">
                <RouterLink :to="'/operateur/'+$route.params.id+'/'+$route.params.idHab+'/'+control.id" custom v-slot="{navigate, href, isActive}">
                    <a :href="href" @click="navigate" :class="{'active':isActive}" class="list-group-item list-group-item-action d-flex flex-column justify-content-between align-items-between mb-2">
                        <div class=" d-flex flex-column justify-content-between align-items-center mb-2" >
                            <div v-if="control.result_var" class="badge" :class="classNameFromSAMI(control.result_var)">{{ control.result_var}}</div>
                            <span class="text-danger" v-else><i class="bi bi-exclamation-square me-2"></i>Pas d'évaluation générale</span>
                            <span class="fw-lighter">le {{ changeFormatDateLit(control.date_done)}}</span>
                        </div>
                        <span v-if="control.rapport" class="fw-lighter me-2"><i class="bi bi-check-square me-2"></i>{{ control.rapport }} </span>
                        <span class="text-warning" v-else><i class="bi bi-exclamation-square me-2"></i>Pas de rapport final</span>
                        <span v-if="control.nb_question & control.nb_reponse" class="fw-lighter me-2"><i class="bi bi-check-square me-2"></i>{{ control.nb_reponse }} réponses sur  {{ control.nb_question }} questions</span>
                        <span class="text-warning" v-else><i class="bi bi-exclamation-square me-2"></i>Pas de bilan chiffré</span>
                        <div class="d-flex justify-content-end align-items-center mt-2">
                            <span class="fw-lighter me-2">Contrôle</span><span class="fw-lighter me-2">#{{ control.id }}</span><span class="fw-lighter me-2">réalisé par </span><span class="fw-lighter me-1">{{ control.enqueteur_nom }}</span>
                        </div>
                    </a>
                </RouterLink>
            </div>
        </div>

        <AlertMessage v-else><i class="bi bi-info-square me-2"></i>pas de contrôle enregistré</AlertMessage>
    </div>

    <AlertMessage v-else><i class="bi bi-info-square me-2"></i>Cliquez sur une veille dans la liste de gauche pour lister les contrôles réalisés</AlertMessage>
    <RouterView></RouterView>
</template>

<script>
import { mapState } from 'vuex';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import {dateFormat} from '../js/collecte';
import { classNameFromSAMI } from '../js/collecte';


export default{
    components: {AlertMessage},
    computed: {
        ...mapState(['habilitationType']),
        
    },

    emits: ["formulaire"],

    data() {
        return {
            pending: {
                control: false
            },
            listControlDone: [],
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
            return classNameFromSAMI(reponse);
        },

        /**
         * Envoie une requête pour charger la liste des collectes 
         * en fonction de l'id fourni
         * @param {Number} idHabilitation de l'habilitation
         */
        loadCollecte(idHabilitation) {
            this.pending.control=true;
            this.$app.apiGet('data/GET/collecte', {
                tli : idHabilitation,
                tlc: "CharacteristicPersonnel",
                locked: 1
            })
            .then((data) => {
                this.listControlDone = data;

                if (data.length) {
                    this.$emit('formulaire', data[0].information__groupe_id);
                }
            })
            .catch(this.$app.catchError).finally(() => this.pending.control= false);
        },
         /**
		 * Modifie le format de la date entrée en paramètre et la retourne 
		 * sous le format 01 févr. 2021
		 * @param {string} date 
		 */

		changeFormatDateLit(el) {
			return dateFormat(el);
		},
    },

    

    mounted () {
        /**
         * charge la liste des collectes
         */
        this.loadCollecte(this.$route.params.idHab);
    }

}
</script>