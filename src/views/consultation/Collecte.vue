<template>
    <div class="container py-2 px-2">
        <spinner v-if="pending.collecte" />
        <template v-else>
            <hab-monitor v-if="collecte.tli && collecte.tlc == 'CharacteristicPersonnel'" :habId="collecte.tli" :collecte="collecte" :info="infosColl"></hab-monitor>
            <collecte-resume :collecte="collecte" :readonly="true" v-if="collecte" />
            <router-view></router-view>
        </template>
    </div>
</template>

<script>

import {mapState, mapActions} from 'vuex'; 

import CollecteResume from '../../components/collecte/Resume.vue';
import Spinner from '../../components/pebble-ui/Spinner.vue';
import HabMonitor from '../../components/collecte/HabMonitor.vue';


export default {
    components:{CollecteResume, Spinner, HabMonitor}, 

    data() {
        return {
            pending: {
                collecte: true
            },
            infosColl: ''
        }
    },

    computed: {
        ...mapState(['collectes', 'collecte', 'login', 'collectesCollection', 'veilleConfig']),


        /**
         * filtre les collectes en fonction de l'id de la collecte concernée
         * et retourne les contrôle  correspondant
         */

        filterCollecte() {
            let collecteid = this.collectes.filter((collecte)=> collecte.id == this.$route.params.idCollecte);
            // console.log(collecteid, 'computed')
            return collecteid;
        },
    },
    methods: {
        ...mapActions(["setCollecte", "resetResponses"]),


        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
        loadCollecte(id) {
            this.pending.collecte = true;

            this.$app.apiGet('data/GET/collecte/'+id, {
                environnement: 'private',
                afficher_corbeille: 'aussi'
                
            })
            .then((data) => {
                this.setCollecte(data);
                
            }).catch(this.$app.catchError).finally(() => this.pending.collecte = false);
        },

        /**
         * Charge une collecte depuis le serveur dans le store.
         * 
         * @param {number} id L'ID de la collecte à charger
         */
        loadinfosCollecte(id) {
        this.$app.apiGet('v2/collecte', {
          id: id,
          kn2kn_info: 'OUI',
          retard_info: 'OUI',
          type: 'KN'
        })
        .then((data) => {
          this.infosColl = data
        })
        .catch(this.$app.catchError).finally(() => this.pending.control = false);
    },
        
    },
    /**
     * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
     */
    beforeRouteUpdate(to) {
        if (to.params.idCollecte != this.collecte?.id) {
            this.resetResponses();
            this.loadCollecte(to.params.idCollecte);
            this.loadinfosCollecte(to.params.idCollecte);
        }
    },

    /**
     * Lorsque l'élément est monté, on va lire l'élément à charger passé en paramètre.
     */
    beforeMount() {
        /**
         * Ici on va charger l'élément ouvert afin de le stocker dans le store
         */
        // this.resetResponses();
        this.loadCollecte(this.$route.params.idCollecte);
        this.loadinfosCollecte(this.$route.params.idCollecte)

        // this.loadinfosCollecte(collecte.id)

    }
}

</script>