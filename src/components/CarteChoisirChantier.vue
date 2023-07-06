<template>
    <div class="bg-white h-100 rounded shadow-sm">
    <div class="container d-flex flex-column" style="height: 100%;">
        <div class="flex-grow-1 d-flex align-items-center justify-content-center">
            <p class="text-center text-gray">Il n'y a pas de chantier renseigné pour ce contrôle</p>
        </div>

        <div class="form-group mt-3">
            <select class="form-control" style="width: 100%;">
                <option v-for="choice in choices" :key="choice">{{ choice }}</option>
            </select>
        </div>


        <div class="text-center mt-2 d-lg-block">
            <button class="btn btn-primary btn-block w-100 mb-sm-3 my-md-3" style="width: 100%;">Assigner ce
                chantier</button>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            choices: ["VEUILLEZ CHOISIR UN CHANTIER", "Redon", "Lorient", "Vannes", "Quimper", "Brest", "Rennes", "Lyon", "Paris", "Le Havre", "Marseille"]
        };
    }
};
</script>

<style>
.text-gray {
    color: #888;
}

.bg-gray {
    background-color: #f8f8f8;
}

.mt-3 {
    margin-top: 1rem;
}
</style>
