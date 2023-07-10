<template>
    <div class="row">
        <h1>Projet</h1>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Habilitations du projet sur la période</h3>
                    <p>{{ currentHabilitations }}</p>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Toutes les Habilitations du projet</h3>
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
                    <ProjectBarChart></ProjectBarChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <h3 class="card-title fs-4">Nombre de KN par projet</h3>
                    <ProjectPieChart></ProjectPieChart>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card my-2">
                <div class="card-body">
                    <ProjectTable></ProjectTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectBarChart from './ProjectBarChart.vue';
import ProjectPieChart from './ProjectPieChart.vue';
import ProjectTable from './ProjectTable.vue';

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
    components: { ProjectBarChart, ProjectPieChart, ProjectTable},
}
</script>
