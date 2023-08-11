<template>
    <div class="container py-2 px-2">
      <div v-for="route in filteredRoutes" :key="route.name">
        <h1 class="fs-3 my-3" v-if="matchRoute(route.name)">
          Consultation des contrôles réalisés
          <strong v-if="route.strongText">{{ route.strongText }}</strong>
        </h1>
        <div class="card my-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6 col-lg-4 col-12">
                <img src="../assets/consultation.jpg" class="img-fluid" alt="consultation de contrôles" />
              </div>
              <div class="col display-6">
                <p class="fs-4 text-center"> Selectionner un <strong>{{ route.subject }}</strong> {{ route.message }}</p>
                <ul v-if="route.showSearchInfo">
                  <li class="fs-5 mb-2">
                    Vous pouvez effectuer une recherche {{ route.searchInfoText }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        routes: [
          {
            name: "consultationKnWtBcl",
            strongText: "sans bouclage",
            subject : "contôle",
            message: " dans la liste de gauche pour le consulter",
            showSearchInfo: true,
            searchInfoText: "par résultat SAMI du contrôle",
          },
          {
            name: "consultationSsOperateur",
            strongText: "sans opérateur",
            subject : "contôle",
            message: " dans la liste de gauche pour le consulter",
          },
          {
            name: "consultationSsControleur",
            strongText: "sans controleur",
            subject : "contôle",
            message: " dans la liste de gauche pour le consulter",
          },
          {
            name: "consultationOperateur",
            strongText: "par opérateur",
            subject : "opérateur",
            message: " dans la liste de gauche pour afficher l'ensemble des contrôles correspondants.",
            showSearchInfo: true,
            searchInfoText: "par nom",
          },
          {
            name: "consultationControleur",
            strongText: "par controleur",
            subject : "controleur",
            message: " dans la liste de gauche pour afficher l'ensemble des contrôles correspondants.",
            showSearchInfo: true,
            searchInfoText: "par nom",
          },
        ],
      };
    },
    methods: {
      matchRoute(name) {
        return this.$route.name === name;
      },
    },
    computed: {
      filteredRoutes() {
        return this.routes.filter(route => this.matchRoute(route.name));
      },
    },
  };
  </script>
  
  