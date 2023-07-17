<template>
    <div class="row">
        <h1>Contrôleur</h1>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations du contrôleur sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations du contrôleur</h3>
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
                    <ControlerBarChart :jsonData="jsonData"></ControlerBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Nombre de KN par projet</h3>
                    <ControlerPieChart :jsonData="jsonData"></ControlerPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <ControlerTable :jsonData="jsonData"></ControlerTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ControlerBarChart from './ControlerBarChart.vue';
import ControlerPieChart from './ControlerPieChart.vue';
import ControlerTable from './ControlerTable.vue';

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
    components: { ControlerBarChart, ControlerPieChart, ControlerTable},
    data() {
        return {
            jsonData: { "test": "oui"  }
        }
    },
}
</script>
