<template>
    <div>
        {{ agent.cache_nom }}<span class="fw-lighter ms-1"> #{{ agent.id }}</span>

        <div class="badge-group" v-if="nbTotalHabilitation">
            <template v-for="badge in badges" :key="badge.label">
                <span class="badge status-badge" :class="'text-bg-'+badge.style" v-if="getHabiliationNb(badge.style) > 0">
                    <i class="bi" :class="badge.icon"></i>
                    <span class="mx-1">{{ getHabiliationNb(badge.style) }}</span>
                    <span class="status-detail">{{ badge.label }}</span>
                </span>
            </template>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.status-badge .status-detail {
	display: none;
}

.status-badge:hover .status-detail {
	display: inline;
}

.badge-group {
    display: flex;
    align-items: center;
    
    > .badge {
        border-radius: 0;

        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
}
</style>


<script>

export default {
    props: {
        agent: Object,
        stats: Array
    },

    data() {
        return {
            nbTotalHabilitation: 0,
            nbExpired: 0,
            nbExpirationWarning: 0,
            badges: [
                {
                    style: "secondary",
                    icon: "bi-calendar2-check-fill",
                    label: "Habilitation"
                },
                {
                    style: "danger",
                    icon: "bi-exclamation-triangle-fill",
                    label: "Expirée"
                },
                {
                    style: "warning",
                    icon: "bi-exclamation-triangle-fill",
                    label: "Expire dans 1 mois"
                }
            ]
        }
    },

    methods: {
        /**
         * Retourne le nombre a afficher en fonction du style du badge
         * 
         * @param {string} badgeStyle le style du badge
         * 
         * @return {number}
         */
        getHabiliationNb(badgeStyle) {
            let dataNb;

            switch (badgeStyle) {
                case "danger":
                    dataNb = this.nbExpired;
                    break;

                case "warning":
                    dataNb = this.nbExpirationWarning;
                    break;
            
                default:
                    dataNb = this.nbTotalHabilitation;
                    break;
            }

            return dataNb;
        },
    },

    mounted() {
        if (this.stats) {
            this.nbTotalHabilitation = this.stats.total;
            this.nbExpired = this.stats.expired;
            this.nbExpirationWarning = this.stats.expirationWarning;
        }
    },
};

</script>