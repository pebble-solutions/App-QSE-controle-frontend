<template>
    <div class="container py-2 px-0">
        <spinner v-if="pending.collecte" />
        <template v-else>
            
                <alert-message class="card" v-if="collecte.done =='NON'">
                    Ce contrôle de {{ collecte.cible_nom }} est en attente de validation
                </alert-message>
                <alert-message class="card" v-else-if="collecte.done =='OUI'">
                    Le contrôle de {{collecte.cible_nom}} (#{{collecte.id}}) est enregistré et n'est plus modifiable. <br>
                    Vous pourrez le retrouver via le menu consultation.<br>
                    Souhaitez-vous programmer un nouveau contrôle?
                </alert-message>
            
            <consultation-collecte-resume :collecte="collecte" :readonly="true" v-if="collecte"></consultation-collecte-resume>
            
            <FooterToolbar wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark" v-if="collecte.done == 'NON'">
                <div class="d-flex justify-content-between align-items-center">
                    <button class="btn btn-secondary" @click.prevent="routeToBilan()" >Retour</button>

                    <button class="btn btn-lg btn-danger" @click.prevent="validate()" >Terminer</button>
                </div>
            </FooterToolbar>
            <FooterToolbar v-else wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
                <div class="d-flex justify-content-center align-items-center">
                    <router-link :to="'/collecte/'+this.$route.params.id+'/next'" custom v-slot="{ navigate, href }"> 
                        <a class="btn btn-primary" :href="href" @click="navigate">
                            <i class="bi bi-plus-square me-2"></i>
                            Programmer une veille
                        </a>
                    </router-link>
                </div>
                
            </FooterToolbar>
        </template>
    </div>
    
    
</template>
    <!-- <router-view></router-view> -->

<script>

import {mapActions, mapState} from 'vuex'; 

import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';
export default {

    components:{ ConsultationCollecteResume, Spinner, AlertMessage,  FooterToolbar }, 

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
            tabQuestionObligatoire : [],
            validTerminer : true
            
        }
    },

    computed: {
        ...mapState(['collectes','collecte']),


        
    },
    methods: {

        ...mapActions(['refreshCollecte']),
        /**
         * retourne à la vue précédente de bilan
         */
        routeToBilan(){
            this.$router.go(-1);
        },
         /**
         * Envoie les données a l'api pour valider le KN
         */
        validate(collecte) {
            if (this.validTerminer){
                if (confirm('terminer votre contrôle? Vous ne pourrez plus le modifier')){
                    this.collecte.done ='OUI';
                    console.log (this.collecte, 'colle')
                    this.refreshCollecte(collecte)
                    this.$router.push({name:'CollecteVerif', params:{id:this.collecte.id}});
                }
            } else {
                alert("Vous ne pouvez pas terminez le controle car toutes les questions obligatoires ne sont pas remplies : " + this.tabQuestionObligatoire)
            }
        },

        /**
         * Retourne true si toutes les questions obligatoires sont remplies (On une valeur) et false sinon
         * 
         * @param {array} lignes 
         * @param {array} responses 
         * 
         * @returns {boolean}
         */
        verifQuestionObligatoire(lignes, responses) {
            let tabQuestion = []
            for (const {obligatoire, id, question} of lignes) {
                if (obligatoire === 'OUI') {
                    let trouvee = false;
                    for (const resp of responses) {
                        if (resp.question === id) {
                            if (!resp.data) {
                                tabQuestion.push(question);
                            }
                            trouvee = true;
                            break;
                        }
                    }
                    if (!trouvee) {
                        tabQuestion.push(question);
                    }
                }
            }

            if (tabQuestion.length) {
                this.tabQuestionObligatoire = tabQuestion;
                return true
            }else {
                return false
            }
        },

        /**
         * active une alerte si une des question obligatoire n'a pas de valeur de réponse
         */
        alerteVerifQuestion(){
            if (this.verifQuestionObligatoire(this.collecte.formulaire.questions, this.collecte.reponses)) {
                alert("Vous n'avez pas répondu a toutes les questions obligatoires : " + this.tabQuestionObligatoire);
                this.validTerminer = false
            } else {
                this.validTerminer = true
            }
        }
    },

    mounted(){
        this.alerteVerifQuestion()
    }
    
}

</script>