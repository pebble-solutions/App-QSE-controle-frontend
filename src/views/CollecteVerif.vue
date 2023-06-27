<template>
    <div class="container py-2 px-0">
        <spinner v-if="pending.collecte" />
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
                <AlertMessage  icon="bi-question-square" variant="warning" v-if="!collecte.following_id & collecte.done=='OUI'">
                         <strong>Souhaitez-vous programmer un contrôle de bouclage?</strong> 
                        <router-link :to="'/collecte/'+this.$route.params.id+'/collecte-verif/next'" custom v-slot="{ navigate, href }"> 
                            <a class="btn btn-outline-primary ms-3" :href="href" @click="navigate">
                                <i class="bi bi-plus-square me-2"></i>
                                bouclage
                            </a>
                        </router-link>
                </AlertMessage>
                <div class="d-flex flex-column">
                </div>
                <div >
                </div>
            
            <consultation-collecte-resume :collecte="collecte" :readonly="false" :timeline="false" v-if="collecte"></consultation-collecte-resume>
            
            <FooterToolbar wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark" v-if="collecte.done == 'NON'">
                <div class="d-flex justify-content-between align-items-center g-4">
                    <button class="btn btn-secondary" @click.prevent="routeToBilan()" >
                        <i class="bi bi-box-arrow-left me-2"></i>
                        Modifier
                    </button>
                    <button class="btn btn-success btn-lg" @click.prevent="validate()" >
                        <i class="bi bi-check-square me-2"></i>
                        Clôturer
                    </button>
                </div>
            </FooterToolbar>
            <FooterToolbar v-else wrapper-class="px-2 py-1 border-top border-dark" class-name="bg-dark">
                
                <div class="d-flex justify-content-between align-items-center" v-if="!collecte.following_id">
                    <router-link :to="'/collecte/'+this.$route.params.id+'/collecte-verif/next'" custom v-slot="{ navigate, href }"> 
                        <a class="btn btn-primary" :href="href" @click="navigate">
                            <i class="bi bi-plus-square me-2"></i>
                            Programmer un bouclage
                        </a>
                    </router-link>
                    <router-link :to="'/collecte'" custom v-slot="{ navigate, href }"> 
                        <a class="btn btn-secondary" :href="href" @click="navigate">
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
            if (confirm('Une fois clôturé, le contrôle ne sera plus modifiable.')){
                this.pending.validation = true;
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                    environnement: 'private',
                    done: 'OUI'
                })
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
        },

      
    },
    

    
}

</script>