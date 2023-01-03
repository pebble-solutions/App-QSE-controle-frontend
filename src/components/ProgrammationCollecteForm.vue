<template>
    <div v-if="tmpCollecte">
        <div class="row g-2">
            <div class="col mb-3">
                <label for="collecteFormulaire" class="form-label">Type de contrôle</label>
                <select class="form-select" id="collecteFormulaire" name="formulaire" v-model="tmpCollecte.formulaire" required>
                    <option v-for="(form) in formulaires" :value="form.id" :key="form.id" >{{form.groupe}}</option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label" for="collecteDate">Date programmée</label>
            <input type="date" class="form-control" id="collecteDate" name="date" v-model="tmpCollecte.date">
        </div>
        <div class="row g-2">
            <div class="col mb-3">
                <label for="collecteCible" class="form-label">Opérateur </label>
                <select class="form-select" id="collecteCible" name="cible_personnel" v-model="tmpCollecte.cible_personnel">
                    <option v-for="(agent) in personnels" :value="agent.id" :key="agent.id" > {{agent.cache_nom}} </option>
                </select>
            </div>
            <div class="col mb-3">
                <label for="collecteEnqueteur" class="form-label">Nom du contrôleur</label>
                <select class="form-select" id="collecteEnqueteur" name="enqueteur_personnel" v-model="tmpCollecte.enqueteur_personnel">
                    <option  v-for="(controleur) in personnels" :value="controleur.id" :key="controleur.id">{{controleur.cache_nom}}</option>
                </select>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    props: {
        collecte: Object,
        personnels: Array,
        formulaires: Array
    },

    data() {
        return {
            tmpCollecte: null
        }
    },

    emits:['delete-collecte', 'update-collecte'],

    watch: {
        /**
         * Mise à jour de la collecte
         * 
         * @param {object} newVal Les nouvelles valeurs de la collecte
         */
        tmpCollecte: {
            handler(newVal) {
                this.$emit('update-collecte', newVal);
            },
            deep: true
        }
    },
    
    methods: {
        
        /**
         * Envoie un événement de suppression de la collecte
         */
        deleteCollecte() {
            this.$emit('delecte-collecte', this.collecte);
        },
    
    },

    mounted() {
        this.tmpCollecte = JSON.parse(JSON.stringify(this.collecte));
        if (this.tmpCollecte.date) {
            let part = this.tmpCollecte.date.split(" ");
            this.tmpCollecte.date = part[0];
        }
    },
}

</script>