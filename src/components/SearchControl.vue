<template>
    <div>
        <form method="" class="card m-1">
            <div class="btn-group">
                <input type="date" class="form-control" id="dateDebutDone" name="dd_done" placeholder="Date début">
                <input type="date" class="form-control" id="dateFinDone" name="df_done">
                <div class="btn-group">
                    <button type="button" class="btn border dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-list"></i></button>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item" @click="allControl=true">Tous les contrôles</li>
                        <li class="dropdown-item" @click="byQuestion=true">Grouper par questionnaire</li>
                        <li class="dropdown-item" @click="byProject=true">Grouper par projet</li>
                    </ul>
                </div>
                <button class="btn btn-outline-primary"><i class="bi bi-arrow-return-left"></i></button>
                <!-- <i class="bi bi-arrow-right"></i> -->
            </div>
        </form>
    </div>
</template>
<script>

export default {

    data() {
        return {
            allControl: false,
            byQuestion: false,
            byProject: false,
        }
    }
}

</script>