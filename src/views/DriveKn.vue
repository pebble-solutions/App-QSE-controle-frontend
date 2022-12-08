<template>

    <div>
        <h1 >KN programmés</h1> 
        <div class="row">
            <div class="col">
                <div class="card mb-2">
                    <div class="card-body"> ici un kan programmés</div>
                </div>
            </div>  
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <h2>Programmer un nouveau KN</h2>
                            <CreateKn></CreateKn>
                        </div>
                    </div>
                </div>
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

            pending: {
                loadForm: true,
                loadAgent: true
            },
        }
    },
    computed: {
        ...mapState(["openedElement", "formulaires", "listActifs"])
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