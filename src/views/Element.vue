<template>
    <div v-if="openedElement">
        <h1>{{openedElement.name}}</h1>
        <p>{{openedElement.description}}</p>
        <div>{{openedElement.id}}</div>
        <pre>{{openedElement}}</pre>
        
        <router-view></router-view>
    </div>
</template>

<script>

import {mapState} from 'vuex'

export default {

    computed: {
        ...mapState(['openedElement'])
    },

    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        this.$store.dispatch('load', to.params.id);
    },


    /**
     * Lorsqu'on quite la route active, l'élément ouvert est vidé.
     */
    beforeRouteLeave(from, to, next) {
        this.$store.dispatch('unload');
        next();
    },


    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    mounted() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        this.$store.dispatch('load', this.$route.params.id);
    }
}

</script>
