<template>
    <programmation-collecte-modal
    :collecte="collecte"
    :formulaires="formulaires"
    :personnels="mergedPersonnels"
    :veille =true
    
    v-if="inited"
    
    @updated="routeToFormulaire" />
</template>

<script>

import { mapState } from 'vuex'
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue'

export default {

    data() {
        return {
            collecte: {
                formulaire:'',
                cible_personnel: null,
                date: null,
                enqueteur_personnel: null,
                environnement: "private",
                tlc: '',
                tli: ''
                
            },
            inited: false
        }
    },

    computed: {
        ...mapState(['formulaires', 'listActifs', 'personnels','habilitationType','veilleConfig']),

        mergedPersonnels() {
            let list = this.personnels;
            this.listActifs.forEach(personnel => {
                const found = list.find(e => e.id == personnel.id);
                if (!found) {
                    list.push(personnel);
                }
            });
            return list;
        }
    },

    methods: {
        /**
         * Affiche 
         * 
         * @param {object} collecte
         */
        routeToFormulaire(collecte) {
            this.$router.push("/programmation/"+collecte.information__groupe_id);
        },
    },

    components: { ProgrammationCollecteModal },

    mounted() {
        this.collecte.formulaire =this.habilitationType;
        this.inited = true

    }
}

</script>
