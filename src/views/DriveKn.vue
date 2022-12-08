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
    },

    components: { CreateKn },
}
</script>