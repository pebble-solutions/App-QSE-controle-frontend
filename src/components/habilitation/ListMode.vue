<template>
    
    <div class="m-1">
        <div class="dropdown d-grid">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">
                <i class="bi bi-list"></i>
                {{ activeLabel }}
            </button>
            
            <ul class="dropdown-menu">
                <button type="button" class="dropdown-item d-flex align-items-center justify-content-between" v-for="(action, index) in actions" :key="action.key" @click.prevent="activate(index)">
                    {{ action.label }}
                    <i class="bi bi-check text-success" v-if="index === active"></i>
                </button>
            </ul>
        </div>
    </div>

</template>

<script>

export default {

    data() {
        return {
            actions: [
                { key: "todo", label: "Habilitations à contrôler", route: "habilitationPersonnel" },
                { key: "habilitationType", label: "Grouper par type d'habilitation", route: "habilitation"}
            ],
            active: 0
        }
    },

    emits: ['view-change'],

    computed: {
        /**
         * Retourne le libellé de l'item actif
         */
        activeLabel() {
            return this.actions[this.active].label ?? "Vue non sélectionnée";
        }
    },

    watch: {
        /**
         * Lorsque la vue active change, un événement view-change est emit avec les informations
         * de la nouvelle vue.
         * @param {number} newVal Le nouvel index
         */
        active(newVal) {
            const action = this.actions[newVal];

            if (action) {
                this.$router.push(action.route);
            }
            this.$emit("view-change", action)
        }
    },

    methods: {
        /**
         * Modifie la vue active
         * 
         * @param {number} actionIndex Index de l'action à activer
         */
        activate(actionIndex) {
            this.active = actionIndex;
        }
    }
}
</script>