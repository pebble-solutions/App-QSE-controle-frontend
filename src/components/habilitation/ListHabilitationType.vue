<template>
    
    <template v-for="hab in habilitationType" :key="hab.id">
        <app-menu-item :href="'/habilitationHab/' + hab.id">
            {{ hab.nom }}
        </app-menu-item>
    </template>

    <div class="alert alert-info m-2" v-if="!habilitationType?.length">
        Il n'y a pas de type d'habilitation enregistré
    </div>

</template>

<script>
import { mapState } from 'vuex'
import AppMenuItem from '../pebble-ui/AppMenuItem.vue'

export default {
    components: { AppMenuItem },
    computed: {
        ...mapState(['habilitationType'])
    }
}

</script>
