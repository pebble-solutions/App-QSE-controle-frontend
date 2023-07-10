<template>
    <div class="row">
        <h1>Opérateur</h1>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations de l'opérateur sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations de l'opérateur</h3>
                    <p>{{ totalHabilitations }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Répartition des réponses</h3>
                    <OperatorBarChart></OperatorBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Nombre de KN par opérateur</h3>
                    <OperatorPieChart></OperatorPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <OperatorTable></OperatorTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OperatorBarChart from './OperatorBarChart.vue';
import OperatorPieChart from './OperatorPieChart.vue';
import OperatorTable from './OperatorTable.vue';

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
    components: { OperatorBarChart, OperatorPieChart, OperatorTable},
}
</script>
