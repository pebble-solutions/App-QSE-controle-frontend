<template>
    <div class="container py-2 px-0">
        <spinner v-if="pending.validation" />
        <template v-else>
            
            <alert-message icon="bi-info-square" class="mt-2" v-if="collecte.done =='NON'">
                Le contrôle #{{ collecte.id }} <span v-if="collecte.cible_nom" class="mx-1">de {{collecte.cible_nom}}</span> n'est pas clôturé
            </alert-message>
            <alert-message icon="bi-info-square" v-else-if="collecte.done =='OUI'">
                <div class="my-2">
                    Le contrôle #{{collecte.id}}<span v-if="collecte.cible_nom" class="mx-1">de {{collecte.cible_nom}}</span> est enregistré et n'est plus modifiable. <br>
                    Vous pourrez le retrouver via le menu consultation.<br>
                </div>
            </alert-message>
                <AlertMessage  icon="bi-question-square" :class="classFromSAMI()" v-if="!collecte.following_id & collecte.done=='OUI'">
                         <strong>Souhaitez-vous programmer un contrôle de bouclage ?</strong> 
                        <router-link :to="'/collecte/'+this.$route.params.id+'/collecte-verif/next'" custom v-slot="{ navigate, href }"> 
                            <a class="btn btn-outline-light ms-3" :href="href" @click="navigate">
                                <i class="bi bi-plus-square me-2"></i>
                                bouclage
                            </a>
                        </router-link>
                </AlertMessage>
               
                
            
            <collecte-resume :collecte="collecte" :readonly="false" :timeline="false" v-if="collecte"></collecte-resume>
            
            <FooterToolbar wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark" v-if="collecte.done == 'NON'">
                <div class="d-flex justify-content-between align-items-center g-4">
                    <button class="btn btn-secondary" @click.prevent="routeToBilan()" >
                        <i class="bi bi-box-arrow-left me-2"></i>
                        Modifier
                    </button>
                    <button class="btn" :class="classFromSAMI(collecte.result)"  @click.prevent="validate()" >
                        <Spinner v-if="pending.validation"></Spinner>
                        <span v-else><i class="bi bi-check-square me-2"></i>Clôturer</span>
                    </button>
                </div>
            </FooterToolbar>
            <FooterToolbar v-else wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
                <div class="d-flex justify-content-between align-items-center" v-if="!collecte.following_id">
                    <router-link :to="'/collecte/'+this.$route.params.id+'/collecte-verif/next'" custom v-slot="{ navigate, href }"> 
                        <a class="btn btn-secondary" :href="href" @click="navigate">
                            <i class="bi bi-plus-square me-2"></i>
                            Programmer un bouclage
                        </a>
                    </router-link>
                    <router-link :to="'/collecte/'+collecte.id" custom v-slot="{ navigate, href }"> 
                        <a class="btn btn-info" :href="href" @click="navigate">
                            <i class="bi bi-plus-square me-2"></i>
                            retour à la liste
                        </a>
                    </router-link>
                </div>
            </FooterToolbar>
        </template>
    </div>
    
    <router-view></router-view>
    
</template>

<script>

import {mapActions, mapState} from 'vuex'; 

import CollecteResume from '../components/collecte/Resume.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';
import { listMissingMandatoryQuestions } from '../js/collecte';
export default {

    components:{ CollecteResume, Spinner, AlertMessage,  FooterToolbar }, 

    data() {
        return {
            
            pending: {
                collecte: false,
                validation: false
            },
            itemResponse: {
                result_type: 'sami',
                result: '',
                rapport: '',
                actions: '',
                environnement: 'private',
                done: '',
            },
            
        }
    },

    computed: {
        ...mapState(['collectes','collecte']),
    },
    methods: {

        ...mapActions(['refreshCollectes','refreshCollecte']),
        /**
         * retourne à la vue précédente de bilan
         */
        routeToBilan(){
            this.$router.go(-1);
        },
         /**
         * Envoie les données a l'api pour valider le KN
         */
        validate() {
            if(this.alertQuestionManquante()) {
                if (confirm('Une fois clôturé, le contrôle ne sera plus modifiable.')){
                    this.pending.validation = true;
                    this.$app.apiPost('v2/collecte/'+this.collecte.id+'/validate')
                    .then((data) => {
                        return this.refreshCollectes([data]);
                    })
                    .then(() => {
                        return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                            environnement: 'private'
                        });
                    })
                    .then((collecte) => {
                        this.refreshCollecte(collecte);
                        this.$router.push({name:'CollecteVerif', params:{id:this.collecte.id}});
    
                    })
                    .catch(this.$app.catchError).finally(() => this.pending.validation = false);
                }
            }
        },
        /**
         * retourne la classe du message d'alerte en fonction du résultat de la collecte
         */
        classFromSAMI(){
            if(this.collecte.result_var == 'S') {
                return 'text-light bg-success'
            }
            else if(this.collecte.result_var =='A') {
                return 'text-light bg-primary'
            }
            else if(this.collecte.result_var == 'M') {
                return 'text-light bg-warning'
            }
            else if(this.collecte.result_var == 'I') {
                return 'text-light bg-danger'
            }
            else return 'bg-secondary'
        },

        /**
         * Verifie si les questions obligatoires ont des réponses.
         *  - Si aucune réponse n'est fournie, alors une alerte est envoyée
         * 
         * @returns {boolean}
         */
        alertQuestionManquante() {
            const lignes = this.collecte.formulaire.questions;
            const questionsManquantes = listMissingMandatoryQuestions(this.collecte?.reponses, lignes);

            if (questionsManquantes.length) {
                alert("Impossible de clôturer le contrôle car toutes les questions obligatoires n'ont pas été complétées : " + questionsManquantes.join(", "));
                return false
            } else {
                return true
            }

        }
      
    },
    

    
}

</script>