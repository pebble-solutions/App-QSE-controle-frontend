<template>
    <div>
    {{ collecte }}
    </div>
    <programmation-collecte-modal
    
        :collecte="collecte"
        :formulaires="formulaires"
        :personnels="mergedPersonnels"
        :readonly="['cible_personnel']"

        :veille= true
        v-if="inited"
        @updated="routeToParent"/>
</template>

<script>

import { mapState } from 'vuex'
import ProgrammationCollecteModal from '../components/ProgrammationCollecteModal.vue';
// import AppModal from '../components/pebble-ui/AppModal.vue';
// import ProgrammationCollecteForm from '../components/ProgrammationCollecteForm.vue';

export default {

    data() {
        return {
            collecte: {
                formulaire: null,
                cible_personnel: null,
                date: null,
                enqueteur_personnel: null,
                environnement: "private",
                tlc: '',
                tli:''
            },
            inited: false
        }
    },

    computed: {
        ...mapState(['formulaires', 'personnels','listActifs']),

        /**
         * fusionne la liste du personnnel et la listActifs
         */
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
        routeToParent() {
            alert("Votre contrôle est programmé. Vous pouvez le retrouver depuis le menu Contrôle ou Programmation.");
            this.$router.go(-1);
        },
    },

    components: {ProgrammationCollecteModal}, //ProgrammationCollecteModal, ProgrammationCollecteForm

    mounted() {
        this.collecte.tli = this.$route.params.idHab;
        this.collecte.tlc = 'CharacteristicPersonnel';
        this.collecte.cible_personnel = this.$route.params.idOperateur;
        this.collecte.formulaire = this.$route.params.idForm;
        this.inited = true
        
    }
}

</script>
