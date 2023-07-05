<template>
    <div>
        <AppModal @modal-hide="routeToParent()">
            <div class="bg-light">
            <div class="col display-6 fs-4 text-center mb-2">
                Infos Agent
            </div>
            <MiniInfosAgent></MiniInfosAgent>

            <!-- Informations diverses sur l'agent -->
            <div class="mt-3">
                <div class="fw-bold">Type de contrat :</div>
                <div>Contrat à durée déterminée</div>
                <div class="fw-bold">Durée du contrat :</div>
                <div>12 mois</div>
                <div class="fw-bold">Date d'embauche :</div>
                <div>01/01/2023</div>
            </div>

            <div class="mt-3">
                <div class="fw-bold">Poste occupé :</div>
                <div>Agent de maintenance</div>
                <div class="fw-bold">Service :</div>
                <div>Maintenance des voies</div>
                <div class="fw-bold">Horaires de travail :</div>
                <div>8h00 - 16h00</div>
            </div>

            <div class="mt-3">
                <div class="fw-bold">Matricule :</div>
                <div>123456</div>
            </div>

            <div class="mt-3">
                <div class="fw-bold">Numéro de badge :</div>
                <div>789012</div>
            </div>

            <!-- Ajoutez d'autres lignes d'informations ici -->

            <div class="mt-3">
                <div class="fw-bold">Prochains contrôles KN programmés :</div>
                <div>
                    <ul>
                        <li>Contrôle 1 - Date : 12/08/2023</li>
                        <li>Contrôle 2 - Date : 25/09/2023</li>
                        <li>Contrôle 3 - Date : 05/11/2023</li>
                    </ul>
                </div>
            </div>

            <div class="mt-3">
                <div class="fw-bold">Liste des habilitations :</div>
                <div>
                    <ul>
                        <li>Habilitation 1 - Validité : 10/12/2024</li>
                        <li>Habilitation 2 - Validité : 20/06/2025</li>
                        <li>Habilitation 3 - Validité : 15/09/2026</li>
                    </ul>
                </div>
            </div>

            <SuiviHabilitation></SuiviHabilitation>

            <!-- Autres informations utiles -->
            <div class="mt-3">
                <div class="fw-bold">Autres informations :</div>
                <div>
                    <ul>
                        <li>alergique aux arachides</li>
                        <li>a déjà regardé toutes les saison de "l'amour est dans le pré"</li>
                        <li>j'ai soif</li>
                    </ul>
                </div>
            </div>

            <!-- personne à contacter en urgence -->
            <div class="mt-3">
                <div class="fw-bold">Personne à contacter en cas d'urgence :</div>
                <div>
                    <ul>
                        <li>nom : Dupont</li>
                        <li>prénom : Jean</li>
                        <li>lien de parenté : père</li>
                        <li>numéro de téléphone : 06 12 34 56 78</li>
                    </ul>
                </div>
            </div>

        </div>

        </AppModal>


    </div>
</template>

<script>
import AppModal from '../components/pebble-ui/AppModal.vue';
import MiniInfosAgent from '../components/MiniInfosAgent.vue';
import SuiviHabilitation from '../components/SuiviHabilitation.vue';
export default {
    components: {
        AppModal,
        MiniInfosAgent,
        SuiviHabilitation,


    },


    methods: {

        /**
         * Retourne à la vue précédente
         */
        routeToParent() {
            this.$router.push({ name: 'ControllerBoard' },);

        }

    },
}
</script>