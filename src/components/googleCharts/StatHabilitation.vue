<template>
    <div class="row">
        <h1>Habilitations</h1>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations</h3>
                    <p>{{ totalHabilitations }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition de réponses par KN</h3>
                    <KnBarChart :jsonData="jsonData"></KnBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <KnPieChart :jsonData="jsonData"></KnPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <KnTable :jsonData="jsonData"></KnTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import KnBarChart from './KnBarChart.vue';
import KnPieChart from './KnPieChart.vue';
import KnTable from './KnTable.vue';

export default {
    props: {
        currentHabilitations: {
            type: Number,
            required: true
        },
        totalHabilitations: {
            type: Number,
            required: true
        }
    },
    computed:{
        ...mapState['collectes'],
    },
    components: { KnBarChart, KnPieChart, KnTable},
    data() {
        return {
            jsonData: { "test": "oui"  }
        }
    },
}
</script>
