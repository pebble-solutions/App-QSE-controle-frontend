<template>
    <!-- Ce span affiche une badge. La classe de la badge est déterminée par le computed 'badgeClass'.
         Le contenu de la badge est le nombre de jours de différence entre la date actuelle et 'dfCritique'. 
        
        !!! Il attends une date au format '2023-07-31' -->


    <span class="badge" :class="badgeClass">
				<i class="bi bi-hourglass"></i>
				{{ getDateDifference(dfCritique) }} j
	</span>
</template>

<script>
export default {
	props: {
        // 'date' est une propriété transmise au composant, qui doit être une string et est nécessaire pour le fonctionnement du composant.
        date: {
            type: String,
            required: true,
        },
	},
	computed: {
        // 'dfCritique' est simplement une référence à la propriété 'date'.
		dfCritique() {
			return this.date;
		},
		badgeClass() {
            // Crée deux objets Date pour la date actuelle et 'dfCritique'.
			const currentDate = new Date();
			const dfDate = new Date(this.dfCritique);

            // Si 'dfCritique' est dans le futur, retourne 'badge bg-success' pour rendre la badge verte.
            // Sinon, retourne 'badge bg-danger' pour rendre la badge rouge.
			if (dfDate > currentDate) {
				return 'badge bg-success';
			} else {
				return 'badge bg-danger';
			}
		},
	},
	methods: {
		getDateDifference(date) {
            // Crée deux objets Date pour la date actuelle et la date donnée.
			const currentDate = new Date();
			const dfDate = new Date(date);

            // Calcule la différence de temps en millisecondes entre les deux dates.
			const timeDifference = dfDate.getTime() - currentDate.getTime();

            // Convertit cette différence en jours.
			const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // Si la différence de jours est positive (c'est-à-dire que la date donnée est dans le futur), préfixe avec '-'.
            // Sinon, si elle est négative (la date donnée est dans le passé), préfixe avec '+'.
            // Si elle est nulle (la date donnée est la date actuelle), ne retourne rien.
			if (dayDifference > 0) {
				return `-${dayDifference}`;
			} else if (dayDifference < 0) {
				return `+${Math.abs(dayDifference)}`;
			} else {
				return ``;
			}
		},
	},
};
</script>
