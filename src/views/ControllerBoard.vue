<template>
	<div>
		<div class="container py-2">
			<template v-if="!stats">
				<h1 class="fs-3 my-3 text-center">Tableau de bord</h1>
				<alert-message variant="warning" icon="bi-exclamation-circle me-2" v-if="stat">Aucun résultat pour cette
					recherche.</alert-message>
				<div class="card my-3">
					<div class="card-body">
						<div class="row align-items-center">
							<div class="col display-6 fs-4 text-center">
								Retrouvez ici tes les Controles KN à effectuer. Cliquez sur la map pour lancer l'itinéraire ! 
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="d-flex align-items-center my-3">
					<div class="d-flex align-items-center">
						<user-image :name="personnelNom" className="me-2" />
						<h1 class="fs-3 m-0 me-3">{{ personnelNom }}</h1>
					</div>
					<div class="fw-light text-secondary text-end">du {{ changeFormatDateLit(requeteStat.dd) }} au
						{{ changeFormatDateLit(requeteStat.df) }}</div>
				</div>
				<charts :stats="stats" v-if="stats" />
			</template>
		</div>

		<!-- bloc de controle par jour -->
		<div class="container p-2">
			<div class="card my-3" v-for="(date, index) in dates" :key="index">
				<div class="card-body">
					<div class="row align-items-center">
						<div class="col-12">
							<div class="fw-light text-secondary text-center mb-1 fw-bold">{{ date.dayName }} {{ date.date }}</div>
						</div>
					</div>
					<CarteDeControle></CarteDeControle>
				</div>
			</div>
		</div><RouterView></RouterView>
</div>

</template>

<script>
	import { mapActions, mapState } from 'vuex';
	import Charts from '../components/Charts.vue';
	import AlertMessage from '../components/pebble-ui/AlertMessage.vue';
	import UserImage from '../components/pebble-ui/UserImage.vue';
	import { dateFormat } from '../js/collecte';
	import CarteDeControle from '../components/CarteDeControle.vue';
	


	export default {
		data() {
			return {
				dates: [],
			
			};
		},
		mounted() {
			this.generateDates();
		},
		methods: {
			generateDates() {
    const today = new Date();
    const daysInMilliseconds = 24 * 60 * 60 * 1000;
    for (let i = 0; i < 8; i++) {
      const date = new Date(today.getTime() + i * daysInMilliseconds);
      const formattedDate = this.formatDate(date); // Format "01 janvier 2023"
      const dayName = this.getDayName(date); // Nom du jour de la semaine (par exemple, "Jeudi")
      this.dates.push({ date: formattedDate, dayName: dayName });
    }
  },
			formatDate(date) {
				const options = { year: 'numeric', month: 'long', day: 'numeric' };
				return date.toLocaleDateString('fr-FR', options);
			},
			getDayName(date) {
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dayIndex = date.getDay();
    const dayName = joursSemaine[dayIndex];
    return dayName;
  },
			...mapActions(['refreshStat']),
			changeFormatDateLit(el) {
				return dateFormat(el);
			},
		},
		beforeUnmount() {
			this.refreshStat(null);
		},
		computed: {
			...mapState(['stat', 'requeteStat', 'listActifs']),
			stats() {
				let stats = null;

				if (this.stat) {
					for (const key in this.stat.stats) {
						stats = this.stat.stats[key];
						break;
					}
				}

				return stats;
			},
			personnelNom() {
				if (this.stats) {
					return this.stats.nom;
				}
				return "Sans nom";
			},
		},
		components: {
    Charts,
    AlertMessage,
    UserImage,
    CarteDeControle,
},
	};
</script>