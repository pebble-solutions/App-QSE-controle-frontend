<template>

    <div>
        <h1 >KN programmés</h1> 
                <div v-for="col in collectes" :key=col.id class="list-group">
                    <div class="list-group-item"> {{col.id}} </div>
                </div>
                {{collectes}}
                <div class="card">
                    <div class="card-body">
                        <button @click="(newKn=true)" class="btn btn-lg btn-outline-primary" v-if="(newKn == false)">Programmer un nouveau KN<i class="bi bi-box-arrow-right mx-2"></i></button>
                        <CreateKn :new=" newKn" v-if="(newKn == true)"></CreateKn>

                    </div>
                </div>
                
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CreateKn from '../components/CreateKn.vue';

export default {
    data() {
        return {
            newKn: false,

            pending: {
                loadForm: true,
                loadAgent: true
            },
        }
    },
    computed: {
        ...mapState(["openedElement", "formulaires", "listActifs", "collectes"])
    },
    methods: {
        ...mapActions(["refreshFormulaires", "refreshListActifs"]),

        loadForm() {
            this.pending.loadForm = true;
            this.$app.apiGet('data/GET/formulaire')
                .then((data) => {
                    console.log (data, 'formulaires');
                    this.refreshFormulaires(data);
                })
                .catch(this.$app.catchError)
                .finally(this.pending.loadForm = false);
        },

        loadAgent() {
            this.pending.loadAgent = true;
            this.$app.apiGet('structurePersonnel/GET/list', {
                actif:true
            })
                .then((data) => {
                    console.log (data, 'agents');
                    this.refreshListActifs(data);
                })
                .catch(this.$app.catchError)
                .finally(this.pending.loadAgent = false);
        },
    },
    mounted() {
        this.loadForm();
        this.loadAgent();
    },
    components: { CreateKn }
}
</script>