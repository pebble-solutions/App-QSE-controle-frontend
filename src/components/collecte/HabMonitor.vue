<template>
    <div class="list-group">
        <h2>
            hab ........# {{ habId }}
        </h2>
        <div class="list-group-item mb-2">
            échéance habilitation: {{hab.df }}
            <progress-bar :dd=hab.dd :df=hab.df></progress-bar>
        </div>
        <div class="list-group-item mb-2">
            précédents contrôles: {{ results.val3 }}
            
        </div>
        <div class="list-group-item mb-2">
            échéance controle:  {{ control.delay }}
            <progress-bar :dd="control.date_last" :df="control.delay"></progress-bar>
        </div>
    </div>
</template>
<script>
import ProgressBar from '../ProgressBar.vue';
export default {
    components: { ProgressBar },

    props: {
        habId: Number,
    },
    data() {
        return {
            hab:{
                dd: "2021-08-31 16:20:12",
                df: "2025-07-20 13:42:06"
            },
            results:{
                
                    
                    val1: 's',
                    val2: 'm',
                    val3: 's'

                
            },
            
            control:{
                date_last: "2023-01-31 16:20:12",
                delay: "2023-06-30 16:20:12"
            }
                   

        }
    }
}
</script>