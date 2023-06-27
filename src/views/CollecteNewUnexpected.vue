<template>
    <programmation-collecte-modal
    :collecte="collecte"
    :formulaires="formulaires"
    :personnels="listActifs"
    :readonly="['enqueteur_personnel']"
    
    @updated="routeToCollecte" 
    v-if="inited"
    />


    </template>

<script>

import { mapState } from 'vuex';
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue';
import date from 'date-and-time';

export default {
    
    data() {
        return {
            collecte: {
                formulaire: null,
                cible_personnel: null,
                date: null,
                enqueteur_personnel: null,
                environnement: "private"
            },
            inited: false
        }
    },
    
    computed: {
        ...mapState(['formulaires', 'listActifs','collectes', 'login'])
    },

    methods: {
        /**
         * retourne à la route précédente
         */
        routeToCollecte(collecte) {
            this.$router.push('/collecte/'+collecte.id)
        },
        
    },

    components: { ProgrammationCollecteModal },

    mounted() {
        let now = new Date();
        this.collecte.date = date.format(now, 'YYYY-MM-DD');
        this.collecte.enqueteur_personnel = this.login.primary_personnel;
        this.inited = true;
    }
}

</script>
