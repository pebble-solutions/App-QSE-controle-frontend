<template>
    <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-list"></i>
            <!-- Etapes -->
        </button>

        <ul class="dropdown-menu">
            <li v-for="blocItem in blocs" :key="blocItem.id">
                <router-link :to="'/collecte/'+collecte.id+'/bloc/'+blocItem.id" custom v-slot="{ navigate, href }">
                    <a class="dropdown-item d-flex justify-content-between" :href="href" @click="navigate">
                        {{blocItem.bloc}}
                        <i class="bi bi-check2" v-if="bloc_id == blocItem.id"></i>
                    </a>
                </router-link>
            </li>

            <li>
                <router-link :to="{name: 'CollectKnEnd', params:{id:collecte.id}}" custom v-slot="{navigate, href}">
                    <a class="dropdown-item d-flex justify-content-between" :href="href" @click="navigate">
                        Évaluation générale
                        <i class="bi bi-check2" v-if="!bloc_id"></i>
                    </a>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        bloc_id: String
    },

    computed: {
        ...mapState(['collecte']),

        blocs() {
            return this.collecte.formulaire.blocs
        }
    }
}
</script>