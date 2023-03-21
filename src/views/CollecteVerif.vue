<template>
    <div class="container py-2 px-0">
        <spinner v-if="pending.collecte" />
        <template v-else>
            
                <alert-message class="card">
                    Le contrôle de {{ collecte.cible_nom }} est en attente de validation
                </alert-message>
               
                <BlocNavigation></BlocNavigation>
            
            <consultation-collecte-resume :collecte="collecte" :readonly="true" v-if="collecte"></consultation-collecte-resume>
            
            <router-view></router-view>
        </template>
    </div>
    
</template>

<script>

import {mapState} from 'vuex'; 

import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import BlocNavigation from '../components/BlocNavigation.vue';
export default {
    components:{ConsultationCollecteResume, Spinner, AlertMessage, BlocNavigation}, 

    data() {
        return {
            
            pending: {
                collecte: false
            },
        }
    },

    computed: {
        ...mapState(['collectes','collecte']),


        
    },
    methods: {
        routeToBilan(){
            this.$router.go(-1);

        }

      
    },
    

    
}

</script>