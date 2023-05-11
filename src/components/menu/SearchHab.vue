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
            required: true,
        }
    },
    data() {
        return {
            newMode: ''
        }
    },
    emits: ['update:mode'],

    watch: {
        newMode(){
            console.log(this.newMode,'mode');
            this.$emit('update:mode', this.newMode )
        }

        
    },
    
    
    
    
    
    methods: {
        // updateVal(mode){
        //     console.log(mode, 'mode')
        //     this.mode = mode;
        //     this.$emit('update:'+mode);
            
        // },
        
        /**
         * Observe le changement de valeur du choix des options de tri et émet un évènement
         * 
         * @param   {string} newVal
         */
         setMode(mode){
            console.log(mode, 'setmode')
            this.newMode = mode;

        },
    },

    mounted() {
        this.newMode = this.mode
    }
}

</script>
