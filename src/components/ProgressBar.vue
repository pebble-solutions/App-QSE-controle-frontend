<template>
    <div class="progress progress-ht" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <div v-if="label >= 0 & label <= 600" class="progress-bar" :class="classLabel(label)" :style="stylePercent(percent)">reste {{label}} jours</div>
        <div v-else-if="label >= 600" class="progress-bar" :class="classLabel(label)" :style="stylePercent(percent)"></div>
        <div v-else class="progress-bar" :class="classLabel(label)" :style="stylePercent(percent)">expirée depuis {{Math.abs(label)}} jours</div>
    </div> 
<div>label:  {{ label }} percent: {{ percent }}</div>
</template>

<script>

export default {
    
    props: {
        dd:{
            type: String,
        },
        df: {
            type: String,
        }
    },
    computed: {

        label(){
            const now = new Date();
            const endDate = new Date(this.df);

            let nowTime = now.getTime()/1000;
            let endTime = endDate.getTime()/1000;


            let restTime = endTime - nowTime;
            let restinDays = Math.floor(restTime / (60*60*24));
            // if(restinDays < 0){
            //     return 'habilitation caduque depuis'+Math.abs(restinDays);
            // }

            return restinDays
        },
        percent(){
            const now = new Date();
            const beginDate = new Date(this.dd);

            let nowTime = now.getTime()/1000;
            let beginTime = beginDate.getTime()/1000;

            let time = nowTime-beginTime;
            let consoDays = Math.floor(time /(60*60*24));
            let  percent = Math.floor(consoDays/ 11);
            return percent
        }

    },
    methods: {
        classLabel(label){  

                    if(label <= 0) return 'bg-danger text-light';
                    else if(label > 0 & label < 180) return 'bg-warning text-danger';
                    else if(label > 500) return 'bg-success'
                
            
        },

        stylePercent(percent){
            if(percent > 0){
               return "width:"+percent +"%"
            }
            else return "width: 100%"
        }
    }
}

</script>