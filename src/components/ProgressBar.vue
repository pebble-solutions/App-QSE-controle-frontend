<template>
    <div class="progress progress-ht" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <!-- <div v-if="label >= 0 & label <= 600" class="progress-bar" :class="classLabel(label)" :style="stylePercent(percent)">reste {{label}} jours</div>
        <div v-else-if="label >= 600" class="progress-bar" :class="classLabel(label)" :style="stylePercent(percent)"></div>
        <div v-else class="progress-bar" :class="classLabel(label)" :style="stylePercent(percent)">expirée depuis {{Math.abs(label)}} jours</div> -->
        <div class="progress-bar progress-ht" role="progressbar" :class="returnClass(varTime)" :style="returnStyle(varTime)"> {{ varTime }} </div>
    </div> 
    <!-- {{varTime}} -->
</template>

<script>

export default {
    
    props: {
        dd:{
            type: Date,
        },
        df: {
            type: Date,
        }
    },
    computed: {

        varTime(){
            const now = new Date();
            const endDate = new Date(this.df);
            const beginDate = new Date(this.dd)
            let nowTime = now.getTime()/1000;
            let endTime = endDate.getTime()/1000;
            let beginTime = beginDate.getTime()/1000;

            let consoTime = nowTime - beginTime;
            let restTime = endTime - nowTime;
            let totalTime = endTime - beginTime;

            let restinDays = Math.floor(restTime / (60*60*24));
            let totalDays = Math.floor(totalTime) /(60*60*24);
            let consoDays = Math.floor(consoTime)/(60*24*60);

            let consoPerCent = Math.ceil((consoDays/totalDays)*100)

            let data = {restinDays,consoPerCent,totalDays}
           
            return data
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
        returnClass(data){  
            if(50>=data.consoPerCent && data.consoPerCent>=0) {
                return 'bg-success'
            }
            else if(70>=data.consoPerCent && data.consoPerCent>=51){
                return 'bg-primary'
            } 
            else if(85>=data.consoPerCent && data.consoPerCent>=71){
                return 'bg-warning'
            }
            else return 'bg-danger text-light'
            
        },

        returnStyle(data){
            if(data.consoPerCent>0){
               return "width:"+data.consoPerCent +"%"
            }
            else return "width: 100%"
        }
    }
}

</script>