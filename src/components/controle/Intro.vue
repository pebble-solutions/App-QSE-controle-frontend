<template>
    
    <div class="my-2" v-if="collecte">
        <div class="card-body">
            <div class="card-title">
                <label for="context" class="form-label">
                    Contexte général du contrôle:
                </label>

                <textarea class="form-control" id="context" name="context" rows="6" placeholder="contexte..." v-model="itemResponse.commentaire"></textarea>
            </div>
            <div class="d-flex justify-content-end flex-column flex-md-row align-items-center" v-if="collecte.formulaire?.blocs?.length">
                <div class="my-2">
                    <form class="input-group me-2" method="post" @submit.prevent="recordDate(dateStart)" v-if="editDateForm">
                        <input type="date" class="form-control" id="dateControle" name="dateControle"  required v-model="dateStart">
                        <button class="btn btn-outline-primary" type="submit" :disabled="pending.date">
                            <span class="spinner-border spinner-border-sm" role="status" v-if="pending.date"></span>
                            <i class="bi bi-check2" v-else></i>
                        </button>
                        <button class="btn btn-outline-secondary" type="button" :disabled="pending.date" @click.prevent="toggleDateForm()">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </form>
                    <div class="input-group me-2" v-else>
                        <div class="input-group-text">
                            <i class="bi bi-calendar-event me-2"></i> 
                            Le {{getDisplayFormatedDate(computedDateStart)  }}
                        </div>
                        <button class="btn btn-outline-secondary" type="button" @click.prevent="toggleDateForm()">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                    </div>
                </div>

                <button type="button" class="btn btn-primary btn-lg w-auto d-block my-2" @click.prevent="startControl()" :disabled="pending.collecte || editDateForm">
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
import { getDisplayFormatedDate, toSqlDate, getDateFromSQL } from '../../js/date';


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
            editDateForm: false,
            dateStart : null

        };
    },
    computed: {
        ...mapState(["collecte"]),

        /**
         * Retourne la date enregistrée dans date_start ou bien la date du jour
         * 
         * @return {string}
         */
        computedDateStart() {
            if (this.collecte.date_start) {
                return toSqlDate(getDateFromSQL(this.collecte.date_start));
            }
            else {
                return toSqlDate(new Date());
            }
        }
    },
    watch: {
        collecte(val) {
            this.itemResponse.commentaire = val.commentaire;
        }
    },
    methods: {

        ...mapActions(['refreshCollecte', 'refreshCollectes', "setCollecteHeaders"]),

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
            } else { this.routeToQuestions(); }
            
        },
         /**
         * Inverse le mode d'affichage du formulaire
         */
        toggleDateForm() {
            this.editDateForm = !this.editDateForm;
            if (this.editDateForm) {
                this.dateStart = this.computedDateStart;
            }
        },
        /**
         * doit modifier la date du contrôle
         */
        recordDate() {
            this.pending.date = true;
            this.$app.apiPost('data/POST/collecte/'+this.collecte.id, {
                environnement: 'private', 
                date_start: this.dateStart,
            })
            .then((data) => {
                this.setCollecteHeaders(data);
                this.editDateForm = false;
            })
            .catch(this.$app.catchError)
            .finally(() => {
                this.pending.date = false;
            });
        },

        /**
         * Modifie le format de la date entrée en paramètre et la retourne
         * sous le format 01 févr. 2021
         * @param {string} date
         */
        getDisplayFormatedDate(el) {
            return getDisplayFormatedDate(el);
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