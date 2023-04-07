<template>

    <button @click.prevent="toggleForm()" v-if="!showForm && !readonly" class="btn btn-light" :title="collecte.projet_label" :disabled="pending.collecte">
        <i class="bi bi-boxes me-2" v-if="!pending.collecte"></i>
        <span class="spinner-border spinner-border-sm me-2" role="status" v-else></span>
        <span v-if="hasProject">{{ shortProjetLabel }}</span>
        <span v-else>Affecter un projet</span>
    </button>

    <form method="post" @submit.prevent="changeProjet()" v-if="showForm && !readonly">
        <div class="input-group">
            <label for="collecte_projet" class="input-group-text">Projet</label>
            <select class="form-select" id="collecte_projet" name="collecte_projet" v-model="projet_id">
                <option value="0">Aucun projet</option>
                <option v-for="(projet) in projets" :value="projet.id" :key="projet.id">{{projet.intitule}}</option>
            </select>
            <button class="btn btn-outline-primary" type="submit" :disabled="pending.collecte">
                <span class="spinner-border spinner-border-sm" role="status" v-if="pending.collecte"></span>
                Valider
            </button>
        </div>
    </form>

    <span v-if="readonly && hasProject" :title="collecte.projet_label">
        <i class="bi bi-boxes me-1"></i>
        {{ shortProjetLabel }}
    </span>

</template>

<script>
import { mapState } from 'vuex';

export default {

    props: {
        collecte: Object,
        readonly: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            projet_id: null,
            showForm: false,
            pending: {
                collecte: false
            }
        }
    },

    emits: ['projet-change'],

    computed: {
        ...mapState(['projets']),

        /**
         * Retourne vrais si la collecte est liée à un projet
         * 
         * @return {bool}
         */
        hasProject() {
            return (this.collecte.projet_id);
        },

        /**
         * Retourne les 16 premiers caractères du nom du projet
         * 
         * @return {string}
         */
        shortProjetLabel() {
            let projet_label = this.collecte.projet_label.slice(0, 16);
            if (this.collecte.projet_label.length > 16) {
                projet_label += '...';
            }
            return projet_label;
        }
    },

    methods: {
        /**
         * Envoie une requête à l'API pour modifier le projet_id
         */
        changeProjet() {
            this.pending.collecte = true;
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                environnement: 'private', 
                projet_id: this.projet_id
            })
            .then((data) => {
                this.$emit('projet-change', data);
                this.showForm = false;
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.collecte = false;
            });
        },

        /**
         * Inverse le mode d'affichage du formulaire
         */
        toggleForm() {
            this.showForm = !this.showForm;
        }
    },

    mounted() {
        this.projet_id = this.collecte.projet_id;
    }
}

</script>