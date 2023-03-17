<template>
    <div class="container py-2 px-0">
        <spinner v-if="pending.collecte" />
        <template v-else>
            <div class="d-flex justify-content-between">
                <h2 class="fw-lighter">Visualisation de votre contrôle en attente de validation</h2>
                <button class="btn btn-outline-primary" @click.prevent="routeToBilan()">
                    <i class="bi bi-file-earmark-text"></i>
                    Bilan du contrôle
                </button>
            </div>
            <consultation-collecte-resume :collecte="collecte" :readonly="true" v-if="collecte"></consultation-collecte-resume>
            
            <router-view></router-view>
        </template>
    </div>
    
</template>

<script>

import {mapState} from 'vuex'; 

import ConsultationCollecteResume from '../components/ConsultationCollecteResume.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    components:{ConsultationCollecteResume, Spinner}, 

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