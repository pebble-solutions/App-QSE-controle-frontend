<template>
    <div class="container">
            <div class="my-2">
                <h2 class="fs-5"></h2>

                <div class="btn-group w-100" role="group" aria-label="filtre des habilitations">
                    <!-- <button class="btn btn-outline-secondary" type="button" @click.prevent="setmode('default')">
                        veille
                    </button> -->
                    <button  class="btn btn-outline-secondary" type="button" @click.prevent="setMode('byAgent')">
                        Agents
                    </button>
                    <button class="btn btn-outline-secondary" @click.prevent="setMode('byHab')">
                        Habilitations 
                    </button>
                </div>
            </div>

        <!-- <div class="text-center my-4">
            <button  type="button" class="btn btn-primary col-8">
                <span></span>
                Appliquer
            </button>
        </div> -->
    </div>
</template>
<script>

export default {
    props: {
        mode:{
            type: String,
            default: 'veille',
            required: true,
        }
    },

    methods: {
        setMode(mode){
            if(mode ==='default'){
                console.log(mode)
            }
            else if (mode ==='byHab'){
                console.log(mode)

            }
            else if(mode ==='byAgent'){
                console.log(mode)
            }
        }
    }
}

</script>
