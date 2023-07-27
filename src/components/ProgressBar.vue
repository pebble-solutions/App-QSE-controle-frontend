<template>
    <div v-if="varTime" class="progress progress-ht" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-ht overflow-visible text-light" role="progressbar"    :class="returnClass(varTime)" :style="returnStyle(varTime)" >
            {{ returnLabel(varTime) }}
        </div>
    </div> 
</template>

<script>

export default {
    
    props: {
        dd:{
            type: String,
        },
        df: {
            type: String,
        },
        value: Object
    },
    computed: {
        /**
         * Return the habiliation begin date
         */
        valueDd() {
            if (this.dd) {
                return new Date(this.dd);
            } else {
                return new Date(this.value.dd);
            }
        },

        /**
         * Return the habiliation begin date
         */
        valueDf() {
            if (this.df) {
                return new Date(this.df);
            } else {
                return new Date(this.value.df);
            }
        },

        varTime(){
            const now = new Date();
            const endDate = this.valueDf;
            const beginDate = this.valueDd;
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
            const beginDate = new Date(this.valueDd);

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
            if (180 < data.restinDays) {
                return 'bg-success';
            }

            if (120 < data.restinDays && 180 >= data.restinDays) {
                return 'bg-info';
            }

            if (90 < data.restinDays && 120 >= data.restinDays) {
                return 'bg-warning';
            }

            if (0 < data.restinDays && 90>= data.restinDays) {
                return 'bg-danger text-light';
            }

            if (0 >= data.restinDays) {
                return 'bg-dark text-light';
            }
            
        },

        returnStyle(data) {
            if(data.consoPerCent>0){
               return "width:"+data.consoPerCent +"%"
            }
            else return "width: 100%"
        },

        /**
         * return the sentence to display in the progress bar
         * in function if it's expired or not
         * 
         * @param {object} data contient restinDay, consoPerCent et totalDays de l'habilitation
         * 
         * @return {string}
         */
        returnLabel(data) {
            if(data.restinDays <= 0) {
                return "expiré depuis " + this.convertNbDayInYearMonthDay(Math.abs(data.restinDays));
            }
            else{
                return 'Renouvellement sous ' + this.convertNbDayInYearMonthDay(Math.abs(data.restinDays));
            }
        },

        /**
         * Convertie un nombre de jour en Y ans M month D jours
         * 
         * @param {number} $nbDay 
         * 
         * @return {string}
         */
        convertNbDayInYearMonthDay(nbDay) {
            console.log('nb de day to convert', nbDay);
            const DaysInOneYear = 365.25;
            const DaysInOneMonth = 30.4167;

            let years = Math.floor(nbDay / DaysInOneYear);
            let remainingDaysAfterYears = nbDay % DaysInOneYear;

            let months = Math.floor(remainingDaysAfterYears / DaysInOneMonth);
            let days = Math.floor(remainingDaysAfterYears % DaysInOneMonth);

            let yearsLabel = years + " an" + (years > 1 ? 's ' : ' ');
            let monthsLabel = months + ' mois ';
            let andLabel = years || months ? 'et ' : '';
            
            return (years > 0 ? yearsLabel : '') + (months > 0 ? monthsLabel : '') + (days > 1 ? andLabel + days + ' jours' : '');
        }
    },
}

</script>