<template>
    
    <div class="my-2" v-if="collecte">
        <div class="card-body">
            <div class="card-title">
                <label for="context" class="form-label">
                    Contexte général du contrôle:
                </label>

                <textarea class="form-control" id="context" name="context" rows="6" placeholder="contexte..." v-model="itemResponse.commentaire"></textarea>
            </div>
            <div class="d-flex justify-content-start align-items-center">
                <div v-if="collecte.date_start" class="me-2">Date {{changeFormatDateLit(collecte.date_start)  }}</div>
                <div v-else>Programmé le {{changeFormatDateLit(collecte.date) }}</div>
                <button class="btn btn-outline-secondary me-2" @click.prevent="toggleForm()">Modifier</button>
                <form class="d-flex justify-content-start" for="dateControle" method="post" @submit.prevent="changeDate(dateStart)" v-if="showForm">
                    <input type="date" class="form-control" id="dateControle" name="dateControle"  required v-model="dateStart">
                    <!-- v-model="dateStart" -->
                    <button class="btn btn-outline-primary" type="submit" >
                        <span class="spinner-border spinner-border-sm" role="status" v-if="pending.date"></span>
                        Valider
                    </button>
                </form>

            </div>
            <div class="mt-3 text-end" v-if="collecte.formulaire?.blocs?.length">
                <button type="button" class="btn btn-primary" @click.prevent="startControl()" :disabled="pending.collecte">
                    <span v-if="collecte.date_start" >Modifier</span>
                    <span v-else >Commencer</span>
                    <span v-if="pending.collecte" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import {mapState, mapActions} from 'vuex';
import { dateFormat } from '../js/collecte';


export default {
    data() {
        return {
            itemResponse: {
                commentaire: "",
                environnement: "private"
            },
            pending: {
                collecte: false,
                date: false
            },
            showForm: false,
            dateStart : null

        };
    },
    computed: {
        ...mapState(["collecte"])
    },
    watch: {
        collecte(val) {
            this.itemResponse.commentaire = val.commentaire;
        }
    },
    methods: {

        ...mapActions(['refreshCollecte','refreshCollectes']),
        /**
         * Démarre le contrôle.
         */
        startControl() {
            if (this.collecte.commentaire !== this.itemResponse.commentaire) {
                this.pending.collecte = true;
                this.itemResponse.environnement = "private";
                this.$app.apiPost("data/POST/collecte/" + this.collecte.id, this.itemResponse)
                    .then((data) => {
                        return this.refreshCollectes([data]);
                    })
                    .then(() => {
                        return this.$app.apiGet('data/GET/collecte/'+this.collecte.id, {
                        environnement: 'private'
                        });
                    })
                    .then ((collecte)=> {
                        this.refreshCollecte(collecte);
                        this.routeToQuestions();
                    })
                    .catch(this.$app.catchError).finally(this.pending.collecte = false);
            } else {this.routeToQuestions()}
            
        },
         /**
         * Inverse le mode d'affichage du formulaire
         */
         toggleForm() {
            this.showForm = !this.showForm;
        },
        /**
         * doit modifier la date du contrôle
         */
         changeDate() {
            this.pending.date = true;
            if (confirm('Voulez-vous modifier la date?')) { 
                console.log('totot','dateStart', this.dateStart)
                this.pending.date = false;
                this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                environnement: 'private', 
                date_start: 'this.dateStart',
            })
            .then((data) => {
                console.log(data,'data')
                this.showForm = false;
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.date = false;
            });

            }

            this.showForm = false;
         },
        /**
         * Modifie le format de la date entrée en paramètre et la retourne
         * sous le format 01 févr. 2021
         * @param {string} date
         */
         changeFormatDateLit(el) {
            return dateFormat(el);
        },
        /**
         * Redirige la route vers l'étape des questions
         */
        routeToQuestions() {
            this.$router.push({
                name: "collecteKnBloc",
                params: {
                    id: this.collecte.id,
                    bloc: this.collecte.formulaire.blocs[0].id
                }
            });
        }
    },
    

    mounted() {
        if (this.collecte) {
            this.itemResponse.commentaire = this.collecte.commentaire;
        }
    },
}
</script>