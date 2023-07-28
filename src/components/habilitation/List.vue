<template>
    
    <list-mode @view-change="changeListMode" />

    <ListControlTodo v-if="listMode === 'todo'" />

    <list-habilitation-type v-else-if="listMode === 'habilitationType'" />

    <div class="alert alert-warning m-1" v-else>
        Cette erreur ne devrait pas s'afficher, nous sommes désolé !<br>
        Sélectionner le mode de liste à afficher via le menu ci-dessus.
    </div>

</template>

<script>
import ListMode from './ListMode.vue'
import ListControlTodo from './ListControlTodo.vue';
import ListHabilitationType from './ListHabilitationType.vue';

export default {

    data() {
        return {
            listMode: "todo"
        }
    },

    components: { ListMode, ListControlTodo, ListHabilitationType },

    methods: {
        /**
         * Modifie la liste à afficher : "todo" ou "habilitationType"
         * 
         * @param {object} action L'action à sélectionner. Objet contenant un clé key
         */
        changeListMode(action) {
            this.listMode = action.key;
        }
    }
}

</script>