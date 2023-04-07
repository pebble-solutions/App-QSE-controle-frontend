<template>
    <div class="container py-2 px-0">
        <spinner v-if="pending.collecte" />
        <template v-else>
            
            <alert-message icon="bi-info-square" class="mt-2" v-if="collecte.done =='NON'">
                Le contrôle de {{ collecte.cible_nom }} n'est pas clôturé
            </alert-message>
            <alert-message icon="bi-info-square" v-else-if="collecte.done =='OUI'">
                <div class="d-flex flex-column">
                    <div class="my-2">
                        Le contrôle de {{collecte.cible_nom}} (#{{collecte.id}}) est enregistré et n'est plus modifiable. <br>
                        Vous pourrez le retrouver via le menu consultation.<br>
                    </div>
                    <div>
                        Souhaitez-vous programmer la prochaine veille?
                        <router-link :to="'/collecte/'+this.$route.params.id+'/collecte-verif/next'" custom v-slot="{ navigate, href }"> 
                            <a class="btn btn-outline-primary ms-3" :href="href" @click="navigate">
                                <i class="bi bi-plus-square me-2"></i>
                                Programmer une veille
                            </a>
                        </router-link>

                    </div>
                </div>
                <div >
                </div>
            </alert-message>
            
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
                <div class="d-flex justify-content-center align-items-center">
                    <router-link :to="'/collecte/'+this.$route.params.id+'/collecte-verif/next'" custom v-slot="{ navigate, href }"> 
                        <a class="btn btn-lg btn-primary" :href="href" @click="navigate">
                            <i class="bi bi-plus-square me-2"></i>
                            Programmer une veille
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