<template>
	<div class="px-4 py-2" v-if="$store.state.login">
		<div>
			<img src="@/assets/pebble-dev.png" alt="Pebble Dev" class="logo">
		</div>
		<h1 class="text-center">Bienvenue dans votre nouvelle application</h1>
		<hr>
		<h2>Bibliothèques pré-installés</h2>
		<ul>
			<li><a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/" target="_blank">Bootstrap 5</a></li>
			<li><a href="https://icons.getbootstrap.com/" target="_blank">Bootstrap icons</a></li>
			<li><a href="https://router.vuejs.org/" target="_blank">Vue Router</a></li>
			<li><a href="https://vuex.vuejs.org/" target="_blank">Vue X (store)</a></li>
		</ul>

		<h2>Outils de développement</h2>
		<ul>
			<li><strong><a href="https://github.com/cairnmanagement/pebble-ui" target="_blank">pebble-ui</a></strong> (module vuejs)</li>
			<li><strong><a href="https://github.com/cairnmanagement/appjs" target="_blank">APP.js</a></strong> (fonctions de gestion de l'application et de connexion à l'API)</li>
		</ul>
		<h2>Pour bien démarrer</h2>
		<ol>
			<li>Lisez la documentation de <strong><a href="https://github.com/cairnmanagement/sample-app">pebbleapp</a></strong> pour rester à jour</li>
			<li>Configurez la base de votre application dans /src/config.json</li>
			<li>Ne modifiez pas les sous-modules (/src/components/pebble-ui, /src/js/app). Ceux-ci se mettent à jour via pebbleapp.</li>
			<li>Développez vos vues dans /src/views et vos composants d'interface dans /src/components</li>
		</ol>
	</div>
</template>

<style lang="scss" scoped>
.logo {
	max-width:360px;
	display:block;
	margin:20px auto;
}
</style>

<script>

export default {
	name: 'Home'
}
</script>
