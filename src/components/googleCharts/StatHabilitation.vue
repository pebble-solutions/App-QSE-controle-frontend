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
                    <HabilitationBarChart></HabilitationBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition des types d'habilitations</h3>
                    <HabilitationPieChart></HabilitationPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <HabilitationTable></HabilitationTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HabilitationBarChart from './HabilitationBarChart.vue';
import HabilitationPieChart from './HabilitationPieChart.vue';
import HabilitationTable from './HabilitationTable.vue';

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
    components: { HabilitationBarChart, HabilitationPieChart, HabilitationTable},
}
</script>
