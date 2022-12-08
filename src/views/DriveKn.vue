<template>

    <div>
        <h1 >Gestion des contrôles KN</h1>
            
        <div class="row">
            <div class="col">
                <div class="card mb-2">
                    <div class="card-body">Stats KN</div>
                </div>
            </div>    
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
</template>

<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import CreateKn from '../components/CreateKn.vue';

export default {
    computed: {
        ...mapState(["openedElement", "forms", "listActifs"])
    },
    methods: {
        ...mapActions(["refreshForms", "refreshListActifs"]),
        loadForm() {
            this.$app.apiGet("data/GET/formulaire")
                .then((data) => {
                console.log(data, "formulaires");
                this.refreshForms(data);
            })
                .catch(this.$app.catchError);
        },
        loadAgent() {
            this.$app.apiGet("structurePersonnel/GET/list", {
                actif: true
            })
                .then((data) => {
                console.log(data, "agents");
                this.refreshListActifs(data);
            })
                .catch(this.$app.catchError);
        }
    },
    mounted() {
        this.loadForm();
        this.loadAgent();
    },
    components: { CreateKn }
}
</script>