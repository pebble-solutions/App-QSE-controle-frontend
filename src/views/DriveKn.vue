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
    },

    components: { CreateKn },
}
</script>