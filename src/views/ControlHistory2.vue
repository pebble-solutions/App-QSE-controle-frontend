<template>
      
    <div v-if="!pending.control">
            <h3 class="mx-2">Historique des contrôles </h3>

            <div class="list-group" v-if="listControlDone.length">
                <div v-for="control in listControlDone" :key="control.id">
                    <RouterLink :to="+$route.params.id+'/'+$route.params.idHab+'/'+control.id" custom v-slot="{navigate, href, isActive}">
                        <a :href="href" @click="navigate" :class="{'active':isActive}" class="list-group-item list-group-item-action d-flex flex-column justify-content-between align-items-between mb-2">
                            <div class="list-group-item list-group-item-action d-flex flex-column justify-content-between align-items-center mb-2" >
                                <div v-if="control.result_var" class="badge" :class="classNameFromSAMI(control.result_var)">{{ control.result_var}}</div>
                                <span class="text-danger" v-else><i class="bi bi-exclamation-square me-2"></i>Pas d'évaluation générale</span>
                                <span class="fw-lighter">le {{ changeFormatDateLit(control.date_done)}}</span>
                            </div>
                            <span v-if="control.rapport" class="fw-lighter me-2"><i class="bi bi-check-square me-2"></i>{{ control.rapport }} </span>
                            <span class="text-warning" v-else><i class="bi bi-exclamation-square me-2"></i>Pas de rapport final</span>
                            <span v-if="control.nb_question & control.nb_reponse" class="fw-lighter me-2"><i class="bi bi-check-square me-2"></i>{{ control.nb_reponse }} réponses sur  {{ control.nb_question }} questions</span>
                            <span class="text-warning" v-else><i class="bi bi-exclamation-square me-2"></i>Pas de bilan chiffré</span>
                            <div class="d-flex justify-content-end align-items-center mt-2">
                                <!-- <a class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i></a> -->
                                <span class="fw-lighter me-2">Contrôle</span><span class="fw-lighter me-2">#{{ control.id }}</span><span class="fw-lighter me-2">réalisé par </span><span class="fw-lighter me-1">{{ control.enqueteur_nom }}</span>
                            </div>
                            <div v-if="control.done == 'OUI'">clôturé</div>
                            <div v-else-if="control.done == 'NON'">en cours</div>
                            <div v-else>autre</div>

                        </a>
                    </RouterLink>
                </div>
            </div>
            <AlertMessage v-else><i class="bi bi-info-square me-2"></i>pas de contrôle enregistré</AlertMessage>
            <RouterView></RouterView>
        </div>
        <AlertMessage v-else><i class="bi bi-info-square me-2"></i>Cliquez sur une veille dans la liste de gauche pour lister les contrôles réalisés</AlertMessage>

</template>
<script>
import { mapState } from 'vuex';
import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
import {dateFormat} from '../js/collecte';


export default{
components: {AlertMessage},
computed: {
    ...mapState(['habilitationType']),
    
},

data() {
    return {
        pending: {
            control: false
        },
        listControlDone: [],
    }
},

methods: {

    /**
     * Retourne une classe CSS par rapport à une réponse S A M I
     * 
     * @param {string} reponse S A M I
     * 
     * @return {string}
     */
    classNameFromSAMI(reponse) {
        if (typeof reponse === 'string') {
            if (reponse.toLowerCase() == 's') return 'text-bg-success';
            else if (reponse.toLowerCase() == 'a') return 'text-bg-primary';
            else if (reponse.toLowerCase() == 'm') return 'text-bg-warning';
            else if (reponse.toLowerCase() == 'i') return 'text-bg-danger';
        }
        return 'text-bg-secondary';
    },

    /**
     * Envoie une requête pour charger la liste des collectes 
     * en fonction de l'id fourni
     * @param {Number} id de l'habilitatation du personnel
     */
     loadCollecte(id) {
        this.pending.control=true;
        this.$app.apiGet('data/GET/collecte', {
            tli : id,
            // done: 'OUI'
        })
        .then((data) => {
            this.listControlDone = data;
            console.log(data, 'listcontroldone')
        })
        .catch(this.$app.catchError).finally(() => this.pending.control= false);
    },
     /**
     * Modifie le format de la date entrée en paramètre et la retourne 
     * sous le format 01 févr. 2021
     * @param {string} date 
     */

    changeFormatDateLit(el) {
        return dateFormat(el);
    },
},

/**
 * Lorsque la route interne est mise à jour, le nouvel élément doit être chargé.
 */
 beforeRouteUpdate(to,from) {
    console.log(to.params.idHab, from.params.idHab, 'to,from')
    if (to.params.idHab != from.params.idHab) {
        console.log(to.params.idHab, 'av charge')
        this.loadCollecte(to.params.idHab);

    }
},

mounted () {
    /**
     * charge la liste des collectes
     */
    this.loadCollecte(this.$route.params.idHab);
}

}
</script>