<template>
    <!-- Ce span affiche une badge. La classe de la badge est déterminée par le computed 'badgeClass'.
         Le contenu de la badge est le nombre de jours de différence entre la date actuelle et 'dfCritique'. 
        
        !!! Il attends une date au format '2023-07-' -->


		<span class="badge" :class="badgeClass">
    <i class="bi bi-hourglass"></i>
    {{ getDateDifference(dfCritique) }} j
  </span>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    dfCritique() {
      return this.date;
    },
    badgeClass() {
      const currentDate = new Date();
      const dfDate = new Date(this.dfCritique);

      if (dfDate > currentDate) {
        return 'badge bg-success';
      } else {
        return 'badge bg-danger';
      }
    },
  },
  methods: {
    getDateDifference(date) {
      const currentDate = new Date();
      const dfDate = new Date(date);
      const timeDifference = dfDate.getTime() - currentDate.getTime();
      const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      if (dayDifference > 0) {
        return `-${dayDifference - 1}`;
      } else if (dayDifference < 0) {
        return `+${Math.abs(dayDifference) + 1}`;
      } else {
        return ``;
      }
    },
  },
};
</script>




